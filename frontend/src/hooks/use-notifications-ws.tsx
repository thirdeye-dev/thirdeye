import useSWRSubscription from "swr/subscription";

import { WEBSOCKET_URL } from "@/constants";
import { getAccessToken } from "@/cookies";
import Notification from "@/models/notification";

export default function useNotificationsWS(organizationId: string) {
  const { data, ...swr } = useSWRSubscription<Notification, Error, string>(
    `${WEBSOCKET_URL}/ws/notifications/${organizationId}?token=${getAccessToken()}`,
    (key, { next }) => {
      const socket = new WebSocket(key);

      socket.addEventListener("message", (event) =>
        next(null, JSON.parse(event.data))
      );
      // @ts-ignore
      socket.addEventListener("error", (event) => next(event.error));

      return () => socket.close();
    }
  );

  return {
    notification: data,
    ...swr,
  };
}
