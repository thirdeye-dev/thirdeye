import { getCookie, deleteCookie, setCookie } from "cookies-next";

export function getAccessToken(): string | null {
  try {
    const user_cookie = JSON.parse(getCookie("user") as string);

    return user_cookie.access_token;
  } catch (error) {
    return null;
  }
}

export function setUserCookie(access_token: string, refresh_token: string) {
  const cookie = {
    access_token,
    refresh_token,
  };

  setCookie("user", JSON.stringify(cookie), {
    path: "/",
    maxAge: 24 * 7 * 60 * 60, // Expires after 7 days, in seconds
    sameSite: true,
  });
}

export function removeUserCookie() {
  deleteCookie("user");
}
