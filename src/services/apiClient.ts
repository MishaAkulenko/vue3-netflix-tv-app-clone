import { useLocaleStore } from '@/stores/localeStore.ts';
import { API_BASE_URL } from '@/constants/globalConst.ts';

const createRequestHeaders = (customHeaders = {}) => {
  const { locale } = useLocaleStore();

  return {
    'Content-Type': 'application/json',
    'Accept-Language': locale,
    ...customHeaders
  };
};

interface RequestParams {
  url: string;
  payload?: any; // або більш конкретний тип, наприклад string | FormData
  method?: string;
  customHeaders?: Record<string, string>;
}

const doRequest = async ({ url, payload, method = 'GET', customHeaders }: RequestParams) => {
  return fetch(`${API_BASE_URL}${url}`, {
    method,
    body: JSON.stringify(payload),
    headers: createRequestHeaders(customHeaders)
  }).then((response) => {
    return response.json();
  });
};
export { createRequestHeaders, doRequest };
