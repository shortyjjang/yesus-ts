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
    if (response.data.meta.resultMsg || response.status !== 200) {
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
    }
    return response.data;
  },

  async (error) => {
    console.log(error);
    console.log(error.response);
    if (
      (error.response.data &&
        error.response.data.meta &&
        error.response.data.meta.resultMsg) ||
      error.response.status !== 200
    ) {
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
      return {
        meta: {
          resultMsg: error.response.data.meta.resultMsg
            ? error.response.data.meta.resultMsg
            : "잘못된 요청입니다",
        },
      };
    }
    return error.response.data;
  }
);
