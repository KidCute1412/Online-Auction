import { Router } from "express";
import * as bidsController from "./bids.controller.ts";

const route = Router();

// Handle play bid request
route.post("/play", bidsController.checkBannedBidder, bidsController.checkRatingUser, bidsController.playBid);

// Get bidding history logs
route.get("/history", bidsController.getBidHistoryByProductId);

// Buy now product immediately
route.post("/buy_now", bidsController.checkBannedBidder, bidsController.checkRatingUser, bidsController.buyNowProduct);

// Ban a specific bidder from product bidding
route.post("/ban_bidder", bidsController.banBidder);

export default route;
