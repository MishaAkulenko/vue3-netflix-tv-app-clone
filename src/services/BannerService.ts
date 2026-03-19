import { doRequest } from '@/services/apiClient.ts';
import type { Banner } from '@/types/banners.d.ts';

export const BannersService = {
  fetchBanners: async (): Promise<Banner[]> => {
    return await doRequest({ url: 'api/banners', method: 'GET' });
  }
};
