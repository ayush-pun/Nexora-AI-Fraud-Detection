import { useQuery } from "@tanstack/react-query";

import {
  getNotifications,
  getUnreadNotificationCount,
} from "./notification.service";

export const useNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });
};

export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: ["notification-unread-count"],
    queryFn: getUnreadNotificationCount,

    // Keep the badge reasonably fresh.
    refetchInterval: 30000,

    // Refetch when user comes back to the tab.
    refetchOnWindowFocus: true,
  });
};