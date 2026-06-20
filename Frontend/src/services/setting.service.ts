import { apiRequest } from "./api.client.ts";

export const settingService = {
  getAutoExtendTime: async (): Promise<any> => {
    return apiRequest(`/api/setting/auto_extend_time`);
  },
};
