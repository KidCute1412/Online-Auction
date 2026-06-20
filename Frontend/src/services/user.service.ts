import { apiRequest } from "./api.client.ts";

const ADMIN_PATH = import.meta.env.VITE_PATH_ADMIN;

export const userService = {
  registerSeller: async (body: any): Promise<any> => {
    return apiRequest(`/api/user/register-seller`, {
      method: "POST",
      body,
    });
  },

  rateUser: async (body: any): Promise<any> => {
    return apiRequest(`/api/user/rate`, {
      method: "POST",
      body,
    });
  },

  getRatingCount: async (params?: Record<string, any>): Promise<any> => {
    return apiRequest(`/api/user/rating-count`, { params });
  },

  getRatingHistory: async (params?: Record<string, any>): Promise<any> => {
    return apiRequest(`/api/user/rating-history`, { params });
  },

  adminList: async (params?: Record<string, any>, body?: any): Promise<any> => {
    return apiRequest(`/${ADMIN_PATH}/api/user/list`, {
      method: "POST",
      params,
      body,
    });
  },

  adminGetTotal: async (params?: Record<string, any>): Promise<any> => {
    return apiRequest(`/${ADMIN_PATH}/api/user/number-of-users`, {
      method: "POST",
      params,
    });
  },

  adminDetail: async (id: number): Promise<any> => {
    return apiRequest(`/${ADMIN_PATH}/api/user/detail/${id}`);
  },

  adminEditRole: async (id: number, body: any): Promise<any> => {
    return apiRequest(`/${ADMIN_PATH}/api/user/edit-role/${id}`, {
      method: "PATCH",
      body,
    });
  },

  adminResetPassword: async (id: number, body: any): Promise<any> => {
    return apiRequest(`/${ADMIN_PATH}/api/user/reset-password/${id}`, {
      method: "PATCH",
      body,
    });
  },

  adminListApplications: async (params?: Record<string, any>): Promise<any> => {
    return apiRequest(`/${ADMIN_PATH}/api/application-form/list`, { params });
  },

  adminGetApplicationDetail: async (id: number): Promise<any> => {
    return apiRequest(`/${ADMIN_PATH}/api/application-form/detail/${id}`);
  },

  adminEditApplication: async (id: number, body: any): Promise<any> => {
    return apiRequest(`/${ADMIN_PATH}/api/application-form/edit/${id}`, {
      method: "PATCH",
      body,
    });
  },

  adminGetApplicationsTotal: async (params?: Record<string, any>): Promise<any> => {
    return apiRequest(`/${ADMIN_PATH}/api/application-form/number-of-applications`, {
      method: "POST",
      params,
    });
  },

  adminSetApplicationStatus: async (id: number, body: any): Promise<any> => {
    return apiRequest(`/${ADMIN_PATH}/api/application-form/set-status/${id}`, {
      method: "PATCH",
      body,
    });
  },

  adminGetFormsTotal: async (params?: Record<string, any>): Promise<any> => {
    return apiRequest(`/${ADMIN_PATH}/api/application-form/number-of-forms`, {
      params,
    });
  },
};
