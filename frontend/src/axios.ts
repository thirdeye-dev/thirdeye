import axios, { AxiosResponse } from "axios";

import { getAccessToken, removeUserCookie } from "@/cookies";
import Router from "next/router";

const instance = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  transformRequest: (data, headers) => {
    const access_token = getAccessToken();

    if (access_token !== null) {
      headers["Authorization"] = `JWT ${access_token}`;
    }

    return data;
  },
});

// Global error handler
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const response: AxiosResponse = error.response;

    // If we get a 401, redirect to the login page.
    if (response.status === 401) {
      removeUserCookie();
      Router.push("/login");
    }
  }
);

export default instance;
