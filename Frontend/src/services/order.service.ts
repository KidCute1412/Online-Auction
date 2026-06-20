import { apiRequest } from "./api.client.ts";

export const orderService = {
  createOrder: async (body: FormData): Promise<any> => {
    return apiRequest(`/api/order/create`, {
      method: "POST",
      body,
    });
  },

  getOrderDetail: async (params: { order_id?: string; product_id?: number }): Promise<any> => {
    return apiRequest(`/api/order/status`, { params });
  },

  getSellerOrderView: async (params: { order_id?: string; product_id?: number }): Promise<any> => {
    return apiRequest(`/api/order/seller-view`, { params });
  },

  rejectOrder: async (body: { order_id: string; reason?: string }): Promise<any> => {
    return apiRequest(`/api/order/reject`, {
      method: "POST",
      body,
    });
  },

  approveOrder: async (body: FormData): Promise<any> => {
    return apiRequest(`/api/order/approve`, {
      method: "POST",
      body,
    });
  },
};
