import { apiRequest } from "./api.client.ts";

const ADMIN_PATH = import.meta.env.VITE_PATH_ADMIN;

export const productService = {
  getPageList: async (params?: Record<string, any>): Promise<any> => {
    return apiRequest(`/api/products/page_list`, { params });
  },

  getDetail: async (params?: Record<string, any>): Promise<any> => {
    return apiRequest(`/api/products/detail`, { params });
  },

  postProduct: async (body: FormData): Promise<any> => {
    return apiRequest(`/api/products/post-product`, {
      method: "POST",
      body,
    });
  },

  updateDescription: async (body: any): Promise<any> => {
    return apiRequest(`/api/products/update/description`, {
      method: "PATCH",
      body,
    });
  },

  getMyProducts: async (): Promise<any> => {
    return apiRequest(`/api/products/my-products`);
  },

  search: async (params?: Record<string, any>): Promise<any> => {
    return apiRequest(`/api/products/search`, { params });
  },

  getLoveStatus: async (productId: number): Promise<any> => {
    return apiRequest(`/api/products/love_status`, {
      params: { product_id: productId },
    });
  },

  updateLoveStatus: async (body: any): Promise<any> => {
    return apiRequest(`/api/products/update_love_status`, {
      method: "POST",
      body,
    });
  },

  getQuestions: async (params?: Record<string, any>): Promise<any> => {
    return apiRequest(`/api/products/questions`, { params });
  },

  postQuestion: async (body: any): Promise<any> => {
    return apiRequest(`/api/products/questions`, {
      method: "POST",
      body,
    });
  },

  getEndingSoon: async (): Promise<any> => {
    return apiRequest(`/api/products/ending_soon`);
  },

  getHighestPrice: async (): Promise<any> => {
    return apiRequest(`/api/products/highest_price`);
  },

  getMostBids: async (): Promise<any> => {
    return apiRequest(`/api/products/most_bids`);
  },

  getDetailForWinner: async (params?: Record<string, any>): Promise<any> => {
    return apiRequest(`/api/products/detail-for-winner`, { params });
  },

  getRelated: async (params?: Record<string, any>): Promise<any> => {
    return apiRequest(`/api/products/related`, { params });
  },

  adminList: async (params?: Record<string, any>, body?: any): Promise<any> => {
    return apiRequest(`/${ADMIN_PATH}/api/product/list`, {
      method: "POST",
      params,
      body,
    });
  },

  adminGetTotal: async (params?: Record<string, any>, body?: any): Promise<any> => {
    return apiRequest(`/${ADMIN_PATH}/api/product/number-of-products`, {
      method: "POST",
      params,
      body,
    });
  },

  adminDetail: async (id: number): Promise<any> => {
    return apiRequest(`/${ADMIN_PATH}/api/product/detail/${id}`);
  },

  adminDelete: async (id: number): Promise<any> => {
    return apiRequest(`/${ADMIN_PATH}/api/product/delete/${id}`, {
      method: "PATCH",
    });
  },

  adminRestore: async (id: number): Promise<any> => {
    return apiRequest(`/${ADMIN_PATH}/api/product/restore/${id}`, {
      method: "PATCH",
    });
  },

  adminDestroy: async (id: number): Promise<any> => {
    return apiRequest(`/${ADMIN_PATH}/api/product/destroy/${id}`, {
      method: "DELETE",
    });
  },
};
