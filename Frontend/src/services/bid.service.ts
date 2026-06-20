import { apiRequest } from "./api.client.ts";

export const bidService = {
  play: async (body: { product_id: number; bid_price: number; max_bid_price?: number }): Promise<any> => {
    return apiRequest(`/api/bid/play`, {
      method: "POST",
      body,
    });
  },

  getHistory: async (params: { product_id: number }): Promise<any> => {
    return apiRequest(`/api/bid/history`, { params });
  },

  buyNow: async (body: { product_id: number }): Promise<any> => {
    return apiRequest(`/api/bid/buy_now`, {
      method: "POST",
      body,
    });
  },

  banBidder: async (body: { product_id: number; banned_user_id: number; reason: string }): Promise<any> => {
    return apiRequest(`/api/bid/ban_bidder`, {
      method: "POST",
      body,
    });
  },
};
