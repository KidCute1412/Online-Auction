import { apiRequest } from "./api.client.ts";

export const accountService = {
  register: async (body: any): Promise<any> => {
    return apiRequest(`/accounts/register`, {
      method: "POST",
      body,
    });
  },

  verifyAccount: async (params: { email: string }): Promise<any> => {
    return apiRequest(`/accounts/verify-account`, { params });
  },

  verifyRegister: async (body: { email: string; otp: string }): Promise<any> => {
    return apiRequest(`/accounts/verify-register`, {
      method: "POST",
      body,
    });
  },

  verifyForgotPassword: async (body: { email: string; otp: string }): Promise<any> => {
    return apiRequest(`/accounts/verify-forgot-password`, {
      method: "PATCH",
      body,
    });
  },

  forgotPassword: async (body: { email: string }): Promise<any> => {
    return apiRequest(`/accounts/forgot-password`, {
      method: "POST",
      body,
    });
  },

  resetPassword: async (body: any): Promise<any> => {
    return apiRequest(`/accounts/reset-password`, {
      method: "POST",
      body,
    });
  },

  changePassword: async (body: any): Promise<any> => {
    return apiRequest(`/accounts/change-password`, {
      method: "PATCH",
      body,
    });
  },

  verifyChangePassword: async (body: { email: string; otp: string }): Promise<any> => {
    return apiRequest(`/accounts/verify-change-password`, {
      method: "POST",
      body,
    });
  },

  login: async (body: any): Promise<any> => {
    return apiRequest(`/accounts/login`, {
      method: "POST",
      body,
    });
  },

  googleLogin: async (body: { idToken: string }): Promise<any> => {
    return apiRequest(`/accounts/google-login`, {
      method: "POST",
      body,
    });
  },

  logout: async (): Promise<any> => {
    return apiRequest(`/accounts/logout`, {
      method: "POST",
    });
  },
};
