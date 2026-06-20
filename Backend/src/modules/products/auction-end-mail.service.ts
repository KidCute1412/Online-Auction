import db from "@/config/database.config.ts";
import { 
  sendMail, 
  getWinnerEmailTemplate, 
  getSellerWithWinnerEmailTemplate, 
  getSellerNoWinnerEmailTemplate, 
  getLoserEmailTemplate 
} from "@/helpers/mail.helper.ts";
import { slugify } from "@/helpers/slug.helper.ts";
interface Product {
  product_id: number;
  product_name: string;
  current_price: number;
  price_owner_id: number | null;
  seller_id: number;
}

interface User {
  user_id: number;
  username: string;
  email: string;
}

// Generate product link
const getProductLink = (productSlug: string, productId: number): string => {
  const frontendUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  return `${frontendUrl}/product/${productSlug}-${productId}`;
};

// Get user info by ID
const getUserById = async (userId: number): Promise<User | null> => {
  try {
    const result = await db.raw(
      `SELECT user_id, username, email FROM users WHERE user_id = ?`,
      [userId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error(`[ERROR] Failed to get user ${userId}:`, error);
    return null;
  }
};

// Get all bidders (losers) for a product
const getLosersForProduct = async (productId: number, winnerId: number | null): Promise<User[]> => {
  try {
    const query = winnerId 
      ? `
        SELECT DISTINCT u.user_id, u.username, u.email 
        FROM bidding_history bh
        JOIN users u ON bh.user_id = u.user_id
        WHERE bh.product_id = ? 
        AND bh.user_id != ?
        AND bh.status IS NULL
      `
      : `
        SELECT DISTINCT u.user_id, u.username, u.email 
        FROM bidding_history bh
        JOIN users u ON bh.user_id = u.user_id
        WHERE bh.product_id = ?
        AND bh.status IS NULL
      `;
    
    const params = winnerId ? [productId, winnerId] : [productId];
    const result = await db.raw(query, params);
    return result.rows || [];
  } catch (error) {
    console.error(`[ERROR] Failed to get losers for product ${productId}:`, error);
    return [];
  }
};

// Send email to winner
export const sendWinnerEmail = async (winner: User, product: Product): Promise<boolean> => {
  try {
    const slug = slugify(product.product_name);
    const emailContent = getWinnerEmailTemplate({
      productName: product.product_name,
      productLink: getProductLink(slug, product.product_id),
      finalPrice: product.current_price,
    });

    await sendMail(
      winner.email,
      `Congratulations! You Won: ${product.product_name}`,
      emailContent
    );

    return true;
  } catch (error) {
    console.error(`[ERROR] Failed to send winner email to ${winner.email}:`, error);
    return false;
  }
};

// Send email to seller (with winner)
export const sendSellerWithWinnerEmail = async (
  seller: User, 
  product: Product, 
  winner: User
): Promise<boolean> => {
  try {
    const slug = slugify(product.product_name);
    const emailContent = getSellerWithWinnerEmailTemplate({
      productName: product.product_name,
      productLink: getProductLink(slug, product.product_id),
      finalPrice: product.current_price,
      winnerName: winner.username,
    });

    await sendMail(
      seller.email,
      `Sold! Auction Ended: ${product.product_name}`,
      emailContent
    );

    return true;
  } catch (error) {
    console.error(`[ERROR] Failed to send seller email to ${seller.email}:`, error);
    return false;
  }
};

// Send email to seller (no winner)
export const sendSellerNoWinnerEmail = async (
  seller: User, 
  product: Product
): Promise<boolean> => {
  try {
    const slug = slugify(product.product_name);
    const emailContent = getSellerNoWinnerEmailTemplate({
      productName: product.product_name,
      productLink: getProductLink(slug, product.product_id),
      finalPrice: product.current_price,
    });

    await sendMail(
      seller.email,
      `Auction Ended (No Winner): ${product.product_name}`,
      emailContent
    );

    return true;
  } catch (error) {
    console.error(`[ERROR] Failed to send seller email to ${seller.email}:`, error);
    return false;
  }
};

// Send email to losers (batch)
export const sendLosersEmails = async (
  losers: User[], 
  product: Product
): Promise<number> => {
  let successCount = 0;

  for (const loser of losers) {
    try {
      const slug = slugify(product.product_name);
      const emailContent = getLoserEmailTemplate({
        productName: product.product_name,
        productLink: getProductLink(slug, product.product_id),
        finalPrice: product.current_price,
      });

      const sent = await sendMail(
        loser.email,
        `Auction Ended: ${product.product_name}`,
        emailContent
      );

      if (sent) {
        successCount++;
      }

      
      // Rate limiting: delay between emails
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`[ERROR] Failed to send loser email to ${loser.email}:`, error);
    }
  }

  return successCount;
};

// Main function: Process auction end notifications
export const processAuctionEndNotification = async (product: Product): Promise<boolean> => {

  
  try {
    // Get seller info
    const seller = await getUserById(product.seller_id);
    if (!seller) {
      console.error(`[ERROR] Seller not found for product ${product.product_id}`);
      return false;
    }

    // Check if there's a winner
    if (product.price_owner_id) {
      // Has winner
      const winner = await getUserById(product.price_owner_id);
      if (!winner) {
        console.error(`[ERROR] Winner not found for product ${product.product_id}`);
        return false;
      }

      // Get losers
      const losers = await getLosersForProduct(product.product_id, product.price_owner_id);

      // Send all emails
      const results = await Promise.allSettled([
        sendWinnerEmail(winner, product),
        sendSellerWithWinnerEmail(seller, product, winner),
        sendLosersEmails(losers, product),
      ]);

      // Check results - consider success if winner and seller emails sent
      // Loser emails are less critical
      const winnerEmailSent = results[0].status === 'fulfilled' && results[0].value === true;
      const sellerEmailSent = results[1].status === 'fulfilled' && results[1].value === true;
      const loserEmailsResult = results[2];

      if (!winnerEmailSent || !sellerEmailSent) {
        console.error(`[ERROR] Critical emails failed for product ${product.product_id}`);
        console.error(`Winner email: ${winnerEmailSent ? 'OK' : 'FAILED'}`);
        console.error(`Seller email: ${sellerEmailSent ? 'OK' : 'FAILED'}`);
        return false;
      }

      // Log loser emails (non-critical)
      if (loserEmailsResult.status === 'fulfilled') {
        const losersSent = loserEmailsResult.value as number;
        console.log(`[INFO] Sent emails to ${losersSent}/${losers.length} losers`);
      } else {
        console.warn(`[WARNING] Failed to send loser emails:`, loserEmailsResult.reason);
      }
      
      return true;
    } else {
      // No winner
      const sent = await sendSellerNoWinnerEmail(seller, product);
      
      if (!sent) {
        console.error(`[ERROR] Failed to send no-winner email for product ${product.product_id}`);
      }

      return sent;
    }
  } catch (error) {
    console.error(`[ERROR] Failed to process auction end for product ${product.product_id}:`, error);
    return false;
  }
};

// Get expired products that need email notification
export const getExpiredProductsNeedingEmail = async (limit: number = 50): Promise<Product[]> => {
  try {
    const result = await db.raw(
      `
      SELECT 
        product_id, 
        product_name,  
        current_price, 
        price_owner_id, 
        seller_id
      FROM products
      WHERE end_time < NOW()
      AND auction_end_email_sent = FALSE
      ORDER BY end_time ASC
      LIMIT ?
      `,
      [limit]
    );

    return result.rows || [];
  } catch (error) {
    console.error('[ERROR] Failed to get expired products:', error);
    return [];
  }
};

// Mark product as email sent
export const markAuctionEmailSent = async (productId: number): Promise<boolean> => {
  try {
    await db('products')
      .where('product_id', productId)
      .update({ auction_end_email_sent: true });
    
    return true;
  } catch (error) {
    console.error(`[ERROR] Failed to mark email sent for product ${productId}:`, error);
    return false;
  }
};
