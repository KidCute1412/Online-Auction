import db from "../config/database.config.ts";

export async function checkUserIsSeller (user_id: number, product_id: number) {

    const query = await db.raw (
        `select *
        from products
        where product_id = ? and seller_id = ?`,
        [product_id, user_id]
    );
    const result = await query.rows;
    if (!result || result.length === 0){
        return false;
    }
    return true;
}

export async function isMaxPriceValid (product_id: number, max_price: number) {
    // max_bid must >= current_price + step_price and (max_price - current_price) % step_price === 0
    const findCurrentPrice = await db.raw(`
        select current_price, step_price
        from products
        where product_id = ?
    `, [product_id]);
    const currentPrice = await findCurrentPrice.rows[0].current_price;
    let stepPrice = await findCurrentPrice.rows[0].step_price;
    stepPrice = stepPrice ? stepPrice : 0;

    if (max_price < currentPrice + stepPrice){
        return false;
    }
    if (stepPrice && (max_price - currentPrice) % stepPrice != 0){
        return false;
    }

    return true;
}

export async function getHighestBidByProductId (product_id: number) {
    const findMaxPriceHistory = await db.raw(`
        select MAX(max_price) as highest_price
        from bidding_history
        where product_id = ? and status is NULL
        LIMIT 1 offset 0
    `, [product_id]);
    const maxPriceHistory = await findMaxPriceHistory.rows[0].highest_price;
    return maxPriceHistory;
}

export async function isCurrentPriceOwner (user_id: number, product_id: number) {
    const findPriceOwner = await db.raw(`
        select price_owner_id
        from products
        where product_id = ?
    `, [product_id]);
    const priceOwnerId = await findPriceOwner.rows[0].price_owner_id;
    console.log(`Current price owner id for product ${product_id} is ${priceOwnerId}`);
    return priceOwnerId == user_id;
}

export async function playBid (user_id: number, product_id: number, max_price: number) {
    // ============================================================================
    // CRITICAL: Use transaction with row-level locking to prevent race conditions
    // ============================================================================
    
    const trx = await db.transaction();
    
    try {
        // Lock the product row for update (prevents concurrent modifications)
        const lockProduct = await trx.raw(`
            SELECT product_id, current_price, step_price, price_owner_id
            FROM products
            WHERE product_id = ?
            FOR UPDATE
        `, [product_id]);
        
        const productData = lockProduct.rows[0];
        if (!productData) {
            throw new Error('Product not found');
        }
        
        // Check if user is current price owner
        const isPriceOwner = productData.price_owner_id == user_id;

        if (isPriceOwner){
            console.log(`Updating max_price for existing bid of user ${user_id}`);
            //  just update max_price in bidding_history (no update timestamp)
            await trx.raw(`
                UPDATE bidding_history
                SET max_price = ?
                WHERE product_id = ? AND user_id = ? AND status IS NULL AND created_at = 
                (SELECT MAX(created_at) FROM bidding_history WHERE product_id = ? AND user_id = ? AND status IS NULL)
            `, [max_price, product_id, user_id, product_id, user_id]);
            
            await trx.commit();
            return;
        }

        // Get max price history with lock
        const findMaxPriceHistory = await trx.raw(`
            SELECT *
            FROM bidding_history bh
            WHERE bh.product_id = ? AND bh.status IS NULL
            ORDER BY bh.max_price DESC, bh.created_at DESC
            LIMIT 1
            FOR UPDATE
        `, [product_id]);
        
        console.log("Find Max Price History: ", findMaxPriceHistory.rows);
        const maxPriceHistoryRow = findMaxPriceHistory.rows[0];
        const oldMaxPrice = maxPriceHistoryRow ? maxPriceHistoryRow.max_price : null;
        const oldProductPrice = maxPriceHistoryRow ? maxPriceHistoryRow.product_price : null;
        const oldPriceOwnerId = maxPriceHistoryRow ? maxPriceHistoryRow.price_owner_id : null;

        //  Handle product_price update
        let newProductPrice = oldProductPrice;
        let newPriceOwnerId = oldPriceOwnerId;
        let shouldInsertOldBidderRow = false;
        let oldBidderNewPrice = oldProductPrice;
        
        // First bid
        if (oldMaxPrice == null){
            newProductPrice = Number(productData.current_price);
            newPriceOwnerId = user_id;
        }
        else{
            if (max_price <= oldMaxPrice){
                // the first person is priority (current bidder lose)
                newProductPrice = Number(max_price);
                shouldInsertOldBidderRow = true;
                
                // Calculate old bidder's new price
                if (max_price < oldMaxPrice) {
                    // New bidder bid lower - old bidder's price increases by step_price
                    const stepPrice = Number(productData.step_price);
                    oldBidderNewPrice = Number(max_price) + stepPrice;
                } else {
                    // New bidder matched max price - old bidder keeps priority with same price
                    oldBidderNewPrice = Number(max_price);
                }
                
                // Old bidder remains the price owner
                newPriceOwnerId = oldPriceOwnerId;
            }
            else {
                // increase by step_price (current bidder win)
                const stepPrice = Number(productData.step_price);
                newProductPrice = Number(oldMaxPrice) + stepPrice;
                newPriceOwnerId = user_id;
            }
        }
        
        // Step 1: Insert new bidder's bid first
        const insertResult1 = await trx.raw(`
            INSERT INTO bidding_history (user_id, product_id, max_price, product_price, price_owner_id)
            VALUES (?, ?, ?, ?, ?)
            RETURNING bidding_id
        `, [user_id, product_id, max_price, newProductPrice, newPriceOwnerId]);
        
        console.log(`[STEP 1] Inserted new bidder bid: ${insertResult1.rows[0].bidding_id}`);

        // Step 2: After new bid is committed, insert old bidder's automatic counter-bid if they still win
        if (shouldInsertOldBidderRow && oldPriceOwnerId) {
            // Add small delay to ensure different timestamp (PostgreSQL can have same timestamp for sequential inserts)
            await new Promise(resolve => setTimeout(resolve, 10));
            
            const insertResult2 = await trx.raw(`
                INSERT INTO bidding_history (user_id, product_id, max_price, product_price, price_owner_id)
                VALUES (?, ?, ?, ?, ?)
                RETURNING bidding_id
            `, [oldPriceOwnerId, product_id, oldMaxPrice, oldBidderNewPrice, oldPriceOwnerId]);
            
            console.log(`[STEP 2] Inserted old bidder counter-bid: ${insertResult2.rows[0].bidding_id}`);
            
            // Update final product price to old bidder's new price
            newProductPrice = oldBidderNewPrice;
        }

        // Calculate bid_turns increment: +2 if old bidder auto-bid inserted, +1 otherwise
        const bidTurnsIncrement = shouldInsertOldBidderRow ? 2 : 1;

        // Update products table within transaction
        await trx.raw(`
            UPDATE products
            SET current_price = ?, price_owner_id = ?, bid_turns = COALESCE(bid_turns, 0) + ?
            WHERE product_id = ?
        `, [newProductPrice, newPriceOwnerId, bidTurnsIncrement, product_id]);
        
        // Commit transaction
        await trx.commit();
        console.log(`[TRANSACTION SUCCESS] Bid placed for product ${product_id} by user ${user_id}`);

        return ({
            current_price: newProductPrice,
            price_owner_id: newPriceOwnerId,
            isOldBidderOutbidded: !shouldInsertOldBidderRow, // if old bidder was outbidded,
            oldPriceOwnerId: oldPriceOwnerId,
            oldPriceOwnerBid: oldMaxPrice
        })
        
    } catch (error) {
        // Rollback on error
        await trx.rollback();
        console.error(`[TRANSACTION FAILED] Error in playBid:`, error);
        throw error;
    }
}




export async function getBidHistoryByProductId (product_id: number){
   const bidHistory = await db.raw(`
        select bh.*, u1.username as username, u1.user_id as user_id,
               u2.username as price_owner_username
        from bidding_history as bh
        left join users u1 on bh.user_id = u1.user_id
        left join users u2 on bh.price_owner_id = u2.user_id
        where bh.product_id = ?
        order by bh.created_at DESC, bh.bidding_id DESC
   `, [product_id]);
    
    return bidHistory.rows;
}


export async function checkRatingUser (user_id : number, valid_rating: number){

    const query = await db.raw (`
            select *
            from users
            where user_id = ?
        `, [user_id]);
    const result = await query.rows;
    if (result[0].rating_count == 0) // Skip new user account with no rating
        return true;
    const user_rating = result[0].rating;
    if (user_rating < valid_rating)
        return false;
    return true;
}

export async function isBidExceedBuyNowPrice (product_id: number, bid_price: number) {
    const query = await db.raw (`
            select buy_now_price
            from products
            where product_id = ?
        `, [product_id]);
    const result = await query.rows;
    const buy_now_price = result[0].buy_now_price;
    if (buy_now_price == null)
        return { result: false, buy_now_price: null };
    return {
        result: bid_price >= buy_now_price,
        buy_now_price: buy_now_price
    }
}

export async function buyNowProduct (user_id: number, product_id : number, buy_price : number) {
    const trx = await db.transaction();

    try {
        // Lock product row and validate conditions
        const productQuery = await trx.raw(`
            SELECT 
                product_id,
                buy_now_price,
                end_time,
                price_owner_id,
                seller_id
            FROM products
            WHERE product_id = ?
            FOR UPDATE
        `, [product_id]);

        const product = productQuery.rows[0];

        if (!product) {
            throw new Error('Product not found');
        }

        // Validate buy_now_price exists and matches
        if (product.buy_now_price == null) {
            throw new Error('Product does not have buy now price');
        }

        if (buy_price < product.buy_now_price) {
            throw new Error('Buy price is less than buy now price');
        }

        // Check if auction is still active
        if (new Date(product.end_time) < new Date()) {
            throw new Error('Auction has ended');
        }

        // Check if user is not the seller
        if (product.seller_id == user_id) {
            throw new Error('Seller cannot buy their own product');
        }

        // Update product - end auction immediately
        await trx.raw(`
            UPDATE products
            SET end_time = NOW(),
                current_price = ?,
                price_owner_id = ?,
                bid_turns = COALESCE(bid_turns, 0) + 1
            WHERE product_id = ?
        `, [product.buy_now_price, user_id, product_id]);

        // Always insert new bid for "Buy Now" action to maintain complete history
        // Buy Now is a distinct action that should be recorded separately
        await trx.raw(`
            INSERT INTO bidding_history (user_id, product_id, max_price, product_price, price_owner_id)
            VALUES (?, ?, ?, ?, ?)
        `, [user_id, product_id, product.buy_now_price, product.buy_now_price, user_id]);

        // Create order for the user
        const newOrderQuery = await trx.raw(`
            INSERT INTO orders (user_id, product_id)
            VALUES (?, ?)
            RETURNING order_id
        `, [user_id, product_id]);

        const order_id = newOrderQuery.rows[0].order_id;
        
        await trx.commit();

        return {
            order_id: order_id,
            end_time: new Date().toISOString(),
        };

    } catch (error) {
        await trx.rollback();
        throw error;
    }
}

export async function banBidder (product_id: number, banned_user_id: number, reason: string) {
    console.log (`Banning user ${banned_user_id} from product ${product_id} for reason: ${reason}`);
    const query = await db.raw (`
            select * from ban_auction_user (?, ?, ?)
        `, [product_id, banned_user_id, reason]);
    return query.rows[0].ban_auction_user;
}

export async function isBannedBidder (product_id: number, user_id: number) {
    const query = await db.raw (`
            select 1
            from bidding_ban_user
            where product_id = ? and user_id = ?
        `, [product_id, user_id]);
    const result = await query.rows;
    return (result && result.length > 0);
}