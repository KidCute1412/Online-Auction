import { apiRequest } from "./api.client.ts";

export const profileService = {
  getMe: async (): Promise<any> => {
    return apiRequest(`/api/me`);
  },

  editProfile: async (body: FormData): Promise<any> => {
    return apiRequest(`/api/profile/edit`, {
      method: "PATCH",
      body,
    });
  },

  getProfileDetail: async (params?: Record<string, any>): Promise<any> => {
    return apiRequest(`/api/profile/detail`, { params });
  },
};
