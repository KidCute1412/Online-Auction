import db from "@/config/database.config.ts";

// Create a new order in the database
export async function createOrder(data: any) {
  try {
    await db("orders").insert(data);
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

// Retrieve order details by buyer user ID and product ID
export async function getOrderDetail(user_id: number, product_id: number) {
  try {
    return await db("orders").where({ user_id, product_id }).first();
  } catch (error) {
    console.error("Error fetching order detail:", error);
    throw error;
  }
}

// Retrieve order details combined with product and bidder info for the seller
export async function getSellerOrderView(product_id: number) {
  try {
    const result = await db.raw(
      `
      SELECT 
        o.*,
        p.product_name,
        p.product_images,
        p.buy_now_price,
        p.end_time,
        u.user_id as winner_id,
        u.username as winner_name,
        u.email as winner_email,
        u.avatar as winner_avatar
      FROM orders o
      JOIN products p ON o.product_id = p.product_id
      JOIN users u ON o.user_id = u.user_id
      WHERE o.product_id = ?
      LIMIT 1
      `,
      [product_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error fetching seller order view:", error);
    throw error;
  }
}

// Fetch order details by product ID
export async function getOrderByProductId(product_id: number) {
  try {
    return await db("orders").where({ product_id }).first();
  } catch (error) {
    console.error("Error fetching order by product ID:", error);
    throw error;
  }
}

// Update order status and optional shipping label URL
export async function updateOrderStatus(
  order_id: number,
  status: string,
  shipping_label_image_url?: string
) {
  try {
    const updateData: any = { order_status: status };
    if (shipping_label_image_url) {
      updateData.shipping_label_image_url = shipping_label_image_url;
    }
    await db("orders").where({ order_id }).update(updateData);
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}
