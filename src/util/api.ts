import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getaccessToken } from "./get_token";
import Cookies from "js-cookie";

export const ATD_API_BASIC_PATH = process.env.NEXT_PUBLIC_ATD_API_BASIC_PATH;
export const ATD_API_AUTH_PATH = process.env.NEXT_PUBLIC_AUTH_API_BASIC_PATH;

export type ApiResponseType = {
    meta?: {
        code?: number,
        result?: string,
        resultMsg?: string,
    }
    content?: any,
}

export const Api = axios.create({
  baseURL: ATD_API_BASIC_PATH,
  timeout: 10000,
  params: {},
});
export const AuthApi = axios.create({
  baseURL: ATD_API_AUTH_PATH,
  timeout: 10000,
  params: {},
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

Api.interceptors.response.use(
  async (response: AxiosResponse) => {
    const {data, config} = response
    if (String(response.data.meta.resultMsg).includes('만료') || String(response.data.meta.resultMsg).includes('jwt') || response.status !== 200) {
      const request = await getaccessToken();
      if (request && request.username && Cookies.get("accessToken")) {
        let newConfig = config?.headers
          ? {
              ...config,
              headers: {
                ...config.headers,
                Authorization: Cookies.get("accessToken"),
              },
            }
          : config;
        return axios(newConfig);
      }
      location.href= "/logout"
    }
    return response.data;
  },

  async (error) => {
    const response = error.response;
    if ((response.data.meta?.resultMsg && (String(response.data.meta?.resultMsg).includes('만료') || String(response.data.meta?.resultMsg).includes('jwt'))) || response.status !== 200) {
      const request = await getaccessToken();
      if (request && request.username && Cookies.get("accessToken")) {
        let newConfig = {
          ...error.config,
          headers: error.config.headers
            ? {
                ...error.config.headers,
                Authorization: Cookies.get("accessToken"),
              }
            : {},
        };
        return axios(newConfig);
      }
      Cookies.remove("accessToken");
    }
    if(response.data?.meta?.resultMsg) return {
      meta: {
        resultMsg: response.data?.meta?.resultMsg
      },
    };
    return response.data;
  }
);
