import axios from "axios";

import { getAccessToken } from "@/cookies";

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

export default instance;
