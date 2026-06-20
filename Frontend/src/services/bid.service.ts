import { apiRequest } from "./api.client.ts";

export const bidService = {
  play: async (body: { product_id: number; bid_price: number; max_price?: number }): Promise<any> => {
    return apiRequest(`/bids`, {
      method: "POST",
      body,
    });
  },

  getHistory: async (params: { product_id: number }): Promise<any> => {
    return apiRequest(`/bids`, { params });
  },

  buyNow: async (body: { product_id: number; buy_price: number }): Promise<any> => {
    return apiRequest(`/bids/purchase`, {
      method: "POST",
      body,
    });
  },

  banBidder: async (body: { product_id: number; banned_user_id: number; reason: string }): Promise<any> => {
    return apiRequest(`/bids/bans`, {
      method: "POST",
      body,
    });
  },
};
