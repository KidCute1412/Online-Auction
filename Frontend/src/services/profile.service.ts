import { apiRequest } from "./api.client.ts";

export const profileService = {
  getMe: async (): Promise<any> => {
    return apiRequest(`/profiles/me`);
  },

  editProfile: async (body: FormData): Promise<any> => {
    return apiRequest(`/profiles/me`, {
      method: "PATCH",
      body,
    });
  },

  getProfileDetail: async (params?: Record<string, any>): Promise<any> => {
    return apiRequest(`/profiles/${params?.user_id}`, { params });
  },
};
