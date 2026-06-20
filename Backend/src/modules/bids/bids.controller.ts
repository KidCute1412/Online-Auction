import { Request, Response } from "express";
import * as BidsService from "./bids.service.ts";
import { io } from "@/server.ts";
import {
  getBidderBannedTemplate,
  sendMail,
  getBidSuccessTemplate,
  getBuyNowSuccessTemplate,
  getOutbidNotificationTemplate,
} from "@/helpers/mail.helper.ts";
import { slugify } from "@/helpers/slug.helper.ts";

// Handle product buy now checkout request
export async function buyNowProduct(req: Request, res: Response) {
  try {
    const user_id = (req as any).user.user_id;
    const product_id = req.body.product_id;
    const buy_price = req.body.buy_price;
    const isSeller = await BidsService.checkUserIsSeller(user_id, product_id);
    if (isSeller) {
      return res.status(400).json({
        status: "error",
        message: "Seller cannot buy their own product",
      });
    }

    const isInBuyNowTime = await BidsService.isProductInBiddingTime(product_id);
    if (!isInBuyNowTime) {
      return res.status(400).json({
        status: "error",
        message: "Product is not available for buy now",
      });
    }

    const order = await BidsService.buyNowProduct(user_id, product_id, buy_price);
    const productInfo = await BidsService.getProductById(product_id);
    const email = (req as any).user.email;
    const username = (req as any).user.username;
    const product_name_slug = slugify(productInfo.product_name);
    const productUrl = `${process.env.CLIENT_URL}/product/${product_name_slug}-${product_id}`;
    const emailContent = getBuyNowSuccessTemplate({
      buyer_username: username,
      product_name: productInfo.product_name,
      product_link: productUrl,
      buy_now_price: buy_price,
    });
    sendMail(email, "Successfully purchased product", emailContent);

    io.to(`bidding_room_${product_id}`).emit("new_bid", { data: productInfo });

    return res.status(200).json({
      status: "success",
      order_id: order.order_id,
      end_time: order.end_time,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Server error on buy now",
    });
  }
}

// Middleware helper to check user validity for bid
export async function handleNewUserPlayBid(req: Request, res: Response, next: Function) {
  try {
    const user_id = (req as any).user.user_id;
    const userInfo = await BidsService.getUserById(user_id);
    if (userInfo.rating_count === 0) {
      // Logic placeholder for new users
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Server error verifying bidding account",
    });
  }
}

// Play a new bid on product auction
export async function playBid(req: Request, res: Response) {
  try {
    const user_id = (req as any).user.user_id;
    const product_id = req.body.product_id;
    const max_price = req.body.max_price;

    const isValidTime = await BidsService.isProductInBiddingTime(product_id);
    if (!isValidTime) {
      return res.status(400).json({
        status: "error",
        message: "Product is not in bidding period",
      });
    }

    const isValid = await BidsService.isMaxPriceValid(product_id, max_price);
    if (!isValid) {
      return res.status(400).json({
        status: "error",
        message: "Invalid bid price",
      });
    }

    const isSeller = await BidsService.checkUserIsSeller(user_id, product_id);
    if (isSeller) {
      return res.status(400).json({
        status: "error",
        message: "Seller cannot bid on their own product",
      });
    }

    const isBuyNowExceeded = await BidsService.isBidExceedBuyNowPrice(product_id, max_price);
    if (isBuyNowExceeded.result) {
      await BidsService.buyNowProduct(user_id, product_id, isBuyNowExceeded.buy_now_price!);
      const productInfo = await BidsService.getProductById(product_id);
      const email = (req as any).user.email;
      const username = (req as any).user.username;
      const product_name_slug = slugify(productInfo.product_name);
      const productUrl = `${process.env.CLIENT_URL}/product/${product_name_slug}-${product_id}`;
      const emailContent = getBuyNowSuccessTemplate({
        buyer_username: username,
        product_name: productInfo.product_name,
        product_link: productUrl,
        buy_now_price: isBuyNowExceeded.buy_now_price!,
      });
      sendMail(email, "Successfully purchased product", emailContent);
      io.to(`bidding_room_${product_id}`).emit("new_bid", { data: productInfo });
    } else {
      BidsService.autoExtendBiddingTime(product_id);
      const result = await BidsService.playBid(user_id, product_id, max_price);
      const productInfo = await BidsService.getProductById(product_id);
      const email = (req as any).user.email;
      const username = (req as any).user.username;
      const product_name_slug = slugify(productInfo.product_name);
      const productUrl = `${process.env.CLIENT_URL}/product/${product_name_slug}-${product_id}`;
      const emailContent = getBidSuccessTemplate({
        bidder_username: username,
        product_name: productInfo.product_name,
        product_link: productUrl,
        max_price: max_price,
        current_price: productInfo.current_price,
      });
      sendMail(email, "Successfully placed bid", emailContent);

      if (result && result.isOldBidderOutbidded && result.oldPriceOwnerId) {
        const oldBidderInfo = await BidsService.getUserById(result.oldPriceOwnerId);
        const oldBidderEmailContent = getOutbidNotificationTemplate({
          bidderUsername: oldBidderInfo.username,
          productName: productInfo.product_name,
          productUrl: productUrl,
          newCurrentPrice: productInfo.current_price,
          yourMaxBid: result?.oldPriceOwnerBid,
        });
        sendMail(oldBidderInfo.email, "You have been outbid", oldBidderEmailContent);
      }

      io.to(`bidding_room_${product_id}`).emit("new_bid", { data: productInfo });
    }

    return res.status(200).json({ status: "success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
}

// Fetch transaction history records of bids on a product
export async function getBidHistoryByProductId(req: Request, res: Response) {
  try {
    const product_id = req.query.product_id;
    const user_id = (req as any).user.user_id;
    const { isSeller, bidHistory } = await BidsService.getBidHistory(Number(product_id), user_id);
    return res.status(200).json({
      status: "success",
      data: bidHistory,
      isSeller: isSeller,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
}

// Permanently ban bidder from active product auction room
export async function banBidder(req: Request, res: Response) {
  try {
    const ban_user_id = req.body.banned_user_id;
    const product_id = req.body.product_id;
    const reason = req.body.reason;

    const isAlreadyBanned = await BidsService.isBannedBidder(product_id, ban_user_id);
    if (isAlreadyBanned) {
      return res.status(400).json({
        status: "error",
        message: "Bidder was already banned",
      });
    }
    const data = await BidsService.banBidder(product_id, ban_user_id, reason);

    const bannedUserInfo = await BidsService.getUserById(ban_user_id);
    const productInfo = await BidsService.getProductById(product_id);
    const sellerInfo = await BidsService.getUserById(productInfo.seller_id);

    const product_name_slug = slugify(productInfo.product_name);
    const productUrl = `${process.env.CLIENT_URL}/product/${product_name_slug}-${product_id}`;
    const emailContent = getBidderBannedTemplate({
      bidder_username: bannedUserInfo.username,
      seller_username: sellerInfo.username,
      product_name: productInfo.product_name,
      product_link: productUrl,
      reason: reason,
    });
    sendMail(bannedUserInfo.email, "Banned from bidding on this product", emailContent);

    io.to(`bidding_room_${product_id}`).emit("new_bid", { data: productInfo });
    return res.status(200).json({
      status: "success",
      data: data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Server error banning bidder",
    });
  }
}

// Middleware checking if user is banned from product bidding list
export async function checkBannedBidder(req: Request, res: Response, next: Function) {
  try {
    const user_id = (req as any).user.user_id;
    const product_id = req.body.product_id;
    const isBanned = await BidsService.isBannedBidder(product_id, user_id);
    if (isBanned) {
      return res.status(403).json({
        status: "error",
        message: "You have been banned from bidding on this product",
      });
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Server error checking banned status",
    });
  }
}

// Middleware checking if bidder's review ratings meet limits
export async function checkRatingUser(req: Request, res: Response, next: Function) {
  try {
    const user_id = (req as any).user.user_id;
    const currentUserRating = await BidsService.checkRatingUser(user_id, 4);
    if (!currentUserRating) {
      return res.status(400).json({
        status: "error",
        message: "User ratings too low to bid",
      });
    }
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Server error checking user rating",
    });
  }
}
