import db from "@/config/database.config.ts";

// Verify if a user is the seller of a given product
export async function checkUserIsSeller(user_id: number, product_id: number): Promise<boolean> {
  const query = await db.raw(
    `select *
     from products
     where product_id = ? and seller_id = ?`,
    [product_id, user_id]
  );
  const result = query.rows;
  return result && result.length > 0;
}

// Validate whether a bid's max price meets incremental requirements
export async function isMaxPriceValid(product_id: number, max_price: number): Promise<boolean> {
  const findCurrentPrice = await db.raw(
    `select current_price, step_price
     from products
     where product_id = ?`,
    [product_id]
  );
  const currentPrice = Number(findCurrentPrice.rows[0].current_price);
  let stepPrice = Number(findCurrentPrice.rows[0].step_price || 0);

  if (max_price < currentPrice + stepPrice) {
    return false;
  }
  if (stepPrice && (max_price - currentPrice) % stepPrice !== 0) {
    return false;
  }
  return true;
}

// Retrieve the highest bid for a product from history
export async function getHighestBidByProductId(product_id: number): Promise<number | null> {
  const findMaxPriceHistory = await db.raw(
    `select MAX(max_price) as highest_price
     from bidding_history
     where product_id = ? and status is NULL
     LIMIT 1 offset 0`,
    [product_id]
  );
  return findMaxPriceHistory.rows[0].highest_price;
}

// Verify if user is the current leader of the bid
export async function isCurrentPriceOwner(user_id: number, product_id: number): Promise<boolean> {
  const findPriceOwner = await db.raw(
    `select price_owner_id
     from products
     where product_id = ?`,
    [product_id]
  );
  const priceOwnerId = findPriceOwner.rows[0].price_owner_id;
  return priceOwnerId == user_id;
}

// Execute play bid within a serializable transaction block
export async function playBid(user_id: number, product_id: number, max_price: number) {
  const trx = await db.transaction();
  try {
    const lockProduct = await trx.raw(
      `SELECT product_id, current_price, step_price, price_owner_id
       FROM products
       WHERE product_id = ?
       FOR UPDATE`,
      [product_id]
    );
    const productData = lockProduct.rows[0];
    if (!productData) {
      throw new Error("Product not found");
    }

    const isPriceOwner = productData.price_owner_id == user_id;
    if (isPriceOwner) {
      await trx.raw(
        `UPDATE bidding_history
         SET max_price = ?
         WHERE product_id = ? AND user_id = ? AND status IS NULL AND created_at = 
         (SELECT MAX(created_at) FROM bidding_history WHERE product_id = ? AND user_id = ? AND status IS NULL)`,
        [max_price, product_id, user_id, product_id, user_id]
      );
      await trx.commit();
      return;
    }

    const findMaxPriceHistory = await trx.raw(
      `SELECT *
       FROM bidding_history bh
       WHERE bh.product_id = ? AND bh.status IS NULL
       ORDER BY bh.max_price DESC, bh.created_at DESC
       LIMIT 1
       FOR UPDATE`,
      [product_id]
    );
    const maxPriceHistoryRow = findMaxPriceHistory.rows[0];
    const oldMaxPrice = maxPriceHistoryRow ? maxPriceHistoryRow.max_price : null;
    const oldProductPrice = maxPriceHistoryRow ? maxPriceHistoryRow.product_price : null;
    const oldPriceOwnerId = maxPriceHistoryRow ? maxPriceHistoryRow.price_owner_id : null;

    let newProductPrice = oldProductPrice;
    let newPriceOwnerId = oldPriceOwnerId;
    let shouldInsertOldBidderRow = false;
    let oldBidderNewPrice = oldProductPrice;

    if (oldMaxPrice == null) {
      newProductPrice = Number(productData.current_price);
      newPriceOwnerId = user_id;
    } else {
      if (max_price <= oldMaxPrice) {
        newProductPrice = Number(max_price);
        shouldInsertOldBidderRow = true;
        if (max_price < oldMaxPrice) {
          const stepPrice = Number(productData.step_price);
          oldBidderNewPrice = Number(max_price) + stepPrice;
        } else {
          oldBidderNewPrice = Number(max_price);
        }
        newPriceOwnerId = oldPriceOwnerId;
      } else {
        const stepPrice = Number(productData.step_price);
        newProductPrice = Number(oldMaxPrice) + stepPrice;
        newPriceOwnerId = user_id;
      }
    }

    await trx.raw(
      `INSERT INTO bidding_history (user_id, product_id, max_price, product_price, price_owner_id)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, product_id, max_price, newProductPrice, newPriceOwnerId]
    );

    if (shouldInsertOldBidderRow && oldPriceOwnerId) {
      await new Promise((resolve) => setTimeout(resolve, 10));
      await trx.raw(
        `INSERT INTO bidding_history (user_id, product_id, max_price, product_price, price_owner_id)
         VALUES (?, ?, ?, ?, ?)`,
        [oldPriceOwnerId, product_id, oldMaxPrice, oldBidderNewPrice, oldPriceOwnerId]
      );
      newProductPrice = oldBidderNewPrice;
    }

    const bidTurnsIncrement = shouldInsertOldBidderRow ? 2 : 1;
    await trx.raw(
      `UPDATE products
       SET current_price = ?, price_owner_id = ?, bid_turns = COALESCE(bid_turns, 0) + ?
       WHERE product_id = ?`,
      [newProductPrice, newPriceOwnerId, bidTurnsIncrement, product_id]
    );

    await trx.commit();
    return {
      current_price: newProductPrice,
      price_owner_id: newPriceOwnerId,
      isOldBidderOutbidded: !shouldInsertOldBidderRow,
      oldPriceOwnerId: oldPriceOwnerId,
      oldPriceOwnerBid: oldMaxPrice,
    };
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}

// Retrieve bid logs for a specific product ID
export async function getBidHistoryByProductId(product_id: number) {
  const bidHistory = await db.raw(
    `select bh.*, u1.username as username, u1.user_id as user_id,
            u2.username as price_owner_username
     from bidding_history as bh
     left join users u1 on bh.user_id = u1.user_id
     left join users u2 on bh.price_owner_id = u2.user_id
     where bh.product_id = ?
     order by bh.created_at DESC, bh.bidding_id DESC`,
    [product_id]
  );
  return bidHistory.rows;
}

// Check user ratings logic limits
export async function checkRatingUser(user_id: number, valid_rating: number): Promise<boolean> {
  const query = await db.raw(
    `select *
     from users
     where user_id = ?`,
    [user_id]
  );
  const result = query.rows;
  if (result[0].rating_count == 0) {
    return true;
  }
  return result[0].rating >= valid_rating;
}

// Determine if a bid exceeds the buy now price threshold
export async function isBidExceedBuyNowPrice(
  product_id: number,
  bid_price: number
): Promise<{ result: boolean; buy_now_price: number | null }> {
  const query = await db.raw(
    `select buy_now_price
     from products
     where product_id = ?`,
    [product_id]
  );
  const result = query.rows;
  const buy_now_price = result[0].buy_now_price;
  if (buy_now_price == null) {
    return { result: false, buy_now_price: null };
  }
  return {
    result: bid_price >= buy_now_price,
    buy_now_price: buy_now_price,
  };
}

// Execute buy now product logic within a serializable transaction block
export async function buyNowProduct(user_id: number, product_id: number, buy_price: number) {
  const trx = await db.transaction();
  try {
    const productQuery = await trx.raw(
      `SELECT product_id, buy_now_price, end_time, price_owner_id, seller_id
       FROM products
       WHERE product_id = ?
       FOR UPDATE`,
      [product_id]
    );
    const product = productQuery.rows[0];
    if (!product) {
      throw new Error("Product not found");
    }
    if (product.buy_now_price == null) {
      throw new Error("Product does not have buy now price");
    }
    if (buy_price < product.buy_now_price) {
      throw new Error("Buy price is less than buy now price");
    }
    if (new Date(product.end_time) < new Date()) {
      throw new Error("Auction has ended");
    }
    if (product.seller_id == user_id) {
      throw new Error("Seller cannot buy their own product");
    }

    await trx.raw(
      `UPDATE products
       SET end_time = NOW(),
           current_price = ?,
           price_owner_id = ?,
           bid_turns = COALESCE(bid_turns, 0) + 1
       WHERE product_id = ?`,
      [product.buy_now_price, user_id, product_id]
    );

    await trx.raw(
      `INSERT INTO bidding_history (user_id, product_id, max_price, product_price, price_owner_id)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, product_id, product.buy_now_price, product.buy_now_price, user_id]
    );

    const newOrderQuery = await trx.raw(
      `INSERT INTO orders (user_id, product_id)
       VALUES (?, ?)
       RETURNING order_id`,
      [user_id, product_id]
    );
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

// Ban a specific bidder from a product auction
export async function banBidder(product_id: number, banned_user_id: number, reason: string) {
  const query = await db.raw(
    `select * from ban_auction_user (?, ?, ?)`,
    [product_id, banned_user_id, reason]
  );
  return query.rows[0].ban_auction_user;
}

// Check if a bidder is currently banned from a product auction
export async function isBannedBidder(product_id: number, user_id: number): Promise<boolean> {
  const query = await db.raw(
    `select 1
     from bidding_ban_user
     where product_id = ? and user_id = ?`,
    [product_id, user_id]
  );
  const result = query.rows;
  return result && result.length > 0;
}
