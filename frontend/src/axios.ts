import axios, { AxiosResponse } from "axios";

import { getAccessToken } from "@/cookies";
import Router from "next/router";

const instance = axios.create({
  baseURL: "/api",
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

    // If we get a 401 or 403, redirect to the login page.
    if (response.status === 401 || response.status === 403) {
      Router.push("/login");
    }
  }
);

export default instance;
