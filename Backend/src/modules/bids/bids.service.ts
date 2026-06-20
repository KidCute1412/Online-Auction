import * as BidsModel from "./bids.model.ts";
import * as userModels from "@/models/users.model.ts";
import * as productsService from "@/modules/products/products.service.ts";

// Extend bidding time automatically if the bid occurs close to the end time
export async function autoExtendBiddingTime(product_id: number): Promise<void> {
  try {
    await productsService.extendBiddingTimeIfNeeded(product_id);
  } catch (error) {
    console.error("Failed to automatically extend bidding time:", error);
  }
}

// Retrieve details of a product by ID
export async function getProductById(product_id: number) {
  return await productsService.getProductById(product_id);
}

// Retrieve user account details by ID
export async function getUserById(user_id: number) {
  return await userModels.getUserById(user_id);
}

// Check if a product is currently within its bidding duration
export async function isProductInBiddingTime(product_id: number): Promise<boolean> {
  return await productsService.isProductInBiddingTime(product_id);
}

// Check if the user is the seller of the product
export async function checkUserIsSeller(user_id: number, product_id: number): Promise<boolean> {
  return await BidsModel.checkUserIsSeller(user_id, product_id);
}

// Validate if the maximum bid price meets incremental constraints
export async function isMaxPriceValid(product_id: number, max_price: number): Promise<boolean> {
  return await BidsModel.isMaxPriceValid(product_id, max_price);
}

// Check if a bid price exceeds the buy now price threshold
export async function isBidExceedBuyNowPrice(product_id: number, bid_price: number) {
  return await BidsModel.isBidExceedBuyNowPrice(product_id, bid_price);
}

// Execute buy now product transaction logic
export async function buyNowProduct(user_id: number, product_id: number, buy_price: number) {
  return await BidsModel.buyNowProduct(user_id, product_id, buy_price);
}

// Place a new bid transaction
export async function playBid(user_id: number, product_id: number, max_price: number) {
  return await BidsModel.playBid(user_id, product_id, max_price);
}

// Fetch transaction history of bids on a product
export async function getBidHistory(product_id: number, user_id: number) {
  const isSeller = await BidsModel.checkUserIsSeller(user_id, product_id);
  const bidHistory = await BidsModel.getBidHistoryByProductId(product_id);
  return { isSeller, bidHistory };
}

// Ban a specific bidder from the product auction
export async function banBidder(product_id: number, banned_user_id: number, reason: string) {
  return await BidsModel.banBidder(product_id, banned_user_id, reason);
}

// Check if a bidder is banned from product auction
export async function isBannedBidder(product_id: number, user_id: number): Promise<boolean> {
  return await BidsModel.isBannedBidder(product_id, user_id);
}

// Check if a bidder's ratings meet limit constraints
export async function checkRatingUser(user_id: number, valid_rating: number): Promise<boolean> {
  return await BidsModel.checkRatingUser(user_id, valid_rating);
}
