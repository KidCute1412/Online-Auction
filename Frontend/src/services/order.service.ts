import { apiRequest } from "./api.client.ts";

export const orderService = {
  createOrder: async (body: FormData): Promise<any> => {
    return apiRequest(`/orders`, {
      method: "POST",
      body,
    });
  },

  getOrderDetail: async (params: { order_id?: string; product_id?: number }): Promise<any> => {
    return apiRequest(`/orders`, { params });
  },

  getSellerOrderView: async (params: { order_id?: string; product_id?: number }): Promise<any> => {
    return apiRequest(`/orders/seller`, { params });
  },

  rejectOrder: async (order_id: string, body: { reason?: string }): Promise<any> => {
    return apiRequest(`/orders/${order_id}/rejection`, {
      method: "PATCH",
      body,
    });
  },

  approveOrder: async (order_id: string, body: FormData): Promise<any> => {
    return apiRequest(`/orders/${order_id}/approval`, {
      method: "PATCH",
      body,
    });
  },
};
