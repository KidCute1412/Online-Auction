import { Router } from "express";
import * as bidsController from "./bids.controller.ts";

const route = Router();

// Place a new bid on a product
route.post("/", bidsController.checkBannedBidder, bidsController.checkRatingUser, bidsController.playBid);

// Get bid history for a product (via query params)
route.get("/", bidsController.getBidHistoryByProductId);

// Purchase a product immediately via buy now
route.post("/purchase", bidsController.checkBannedBidder, bidsController.checkRatingUser, bidsController.buyNowProduct);

// Ban a bidder from a product auction
route.post("/bans", bidsController.banBidder);

export default route;
