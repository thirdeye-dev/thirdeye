import { getCookie, deleteCookie } from "cookies-next";

export function getAccessToken(): string | null {
  try {
    const user_cookie = JSON.parse(getCookie("user") as string);

    return user_cookie.access_token;
  } catch (error) {
    return null;
  }
}

export function removeUserCookie() {
  deleteCookie("user");
}
