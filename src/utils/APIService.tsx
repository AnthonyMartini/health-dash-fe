import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { fetchAuthSession } from "@aws-amplify/auth";

const BASE_URL =
  "https://34pdw0bjyi.execute-api.us-east-1.amazonaws.com/default/api";
//
export const API_METHODS = {
  GET: "GET",
  POST: "POST",
  DELETE: "DELETE",
} as const;

export type ApiMethod = keyof typeof API_METHODS;

export const API_ROUTES = {
  GET_HEALTH_DATA: { path: "/health-data", method: API_METHODS.GET },
  UPDATE_HEALTH_DATA: { path: "/health-data", method: API_METHODS.POST },
  GET_USER: { path: "/user-profile", method: API_METHODS.GET },
  UPDATE_USER: { path: "/user-profile", method: API_METHODS.POST },
  DELETE_USER: { path: "/user-profile", method: API_METHODS.DELETE },
  DELETE_WORKOUT_CARD: { path: "/workoutplan-card", method: API_METHODS.DELETE },
  UPDATE_WORKOUT_CARD: { path: "/workoutplan-card", method: API_METHODS.POST },
  GET_WORKOUT_CARD: { path: "/workoutplan-card", method: API_METHODS.GET },
  GET_WEEKLY_PLAN: { path: "/workoutplan-weekly", method: API_METHODS.GET },
  STORE_WEEKLY_PLAN: { path: "/workoutplan-weekly", method: API_METHODS.POST },
  DELETE_WEEKLY_PLAN: { path: "/workoutplan-weekly", method: API_METHODS.DELETE },
  LIST_TABLE: { path: "/health-data/tables", method: API_METHODS.GET },
  GET_GOALS: { path: "/goals", method: API_METHODS.GET },
  UPDATE_GOALS: { path: "/goals", method: API_METHODS.POST },
  SUBSCRIBE_NOTIFICATION: { path: "/user-profile/subscribe", method: API_METHODS.POST},
  UNSUBSCRIBE_NOTIFICATION: { path: "/user-profile/unsubscribe", method: API_METHODS.POST}
} as const;

export type ApiRoute = keyof typeof API_ROUTES;

export interface ApiOptions {
  queryParams?: Record<string, any>;
  body?: Record<string, any>;
  headers?: Record<string, string>;
}

const buildUrl = (path: string, queryParams?: Record<string, any>): string => {
  if (!queryParams) return `${BASE_URL}${path}`;

  const queryString = Object.entries(queryParams)
    .map(([key, value]) =>
      Array.isArray(value)
        ? value
            .map(
              (item) => `${encodeURIComponent(key)}=${encodeURIComponent(item)}`
            )
            .join("&")
        : `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");

  return `${BASE_URL}${path}?${queryString}`;
};

export const apiRequest = async <T = any,>(
  route: ApiRoute,
  options: ApiOptions = {}
): Promise<T> => {
  const { path, method } = API_ROUTES[route];
  const { queryParams, body, headers = {} } = options;

  try {
    // Step 1: Get Bearer Token using fetchAuthSession
    const token = (await fetchAuthSession()).tokens?.accessToken?.toString();
    //console.log();
    if (!token) {
      throw new Error("No token found, please login again.");
    }

    // Step 2: Build URL with query params
    const url = buildUrl(path, queryParams);

    // Step 3: Build Axios config
    const config: AxiosRequestConfig = {
      method,
      url,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include Bearer token here
        ...headers,
      },
      data: body || undefined,
    };

    console.log("API Request:", config);

    // Step 4: Make API call using Axios
    const response: AxiosResponse<T> = await axios(config);

    console.log("API Response:", response);

    return response.data;
  } catch (error: any) {
    console.error(
      `API Request failed: ${error.message}`,
      error.response.status
    );

    // Throw meaningful errors
    if (error.response) {
      throw new Error(error.response.status);
    } else if (error.request) {
      throw new Error("API Error: No response received from server");
    } else {
      throw new Error(`API Error: ${error.message}`);
    }
  }
};
