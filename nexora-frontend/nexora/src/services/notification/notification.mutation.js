import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationAsRead } from "./notification.service";

export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,

    onMutate: async (notificationId) => {
      // Cancel requests that could overwrite our optimistic update
      await queryClient.cancelQueries({
        queryKey: ["notifications"],
      });

      await queryClient.cancelQueries({
        queryKey: ["notification-unread-count"],
      });

      // Save current cache for rollback
      const previousNotifications =
        queryClient.getQueryData(["notifications"]);

      const previousUnreadCount =
        queryClient.getQueryData(["notification-unread-count"]);

      // -----------------------------------------
      // 1. Immediately mark notification as read
      // -----------------------------------------

      queryClient.setQueryData(
        ["notifications"],
        (oldNotifications) => {
          if (!Array.isArray(oldNotifications)) {
            return oldNotifications;
          }

          return oldNotifications.map((notification) => {
            if (notification.id !== notificationId) {
              return notification;
            }

            return {
              ...notification,
              read: true,
              readAt: new Date().toISOString(),
            };
          });
        }
      );

      // -----------------------------------------
      // 2. Immediately decrease unread count
      // -----------------------------------------

      queryClient.setQueryData(
        ["notification-unread-count"],
        (oldData) => {
          // Backend returns a number
          if (typeof oldData === "number") {
            return Math.max(0, oldData - 1);
          }

          // In case backend later returns:
          // { count: 5 }
          if (
            oldData &&
            typeof oldData.count === "number"
          ) {
            return {
              ...oldData,
              count: Math.max(0, oldData.count - 1),
            };
          }

          // In case backend returns:
          // { unreadCount: 5 }
          if (
            oldData &&
            typeof oldData.unreadCount === "number"
          ) {
            return {
              ...oldData,
              unreadCount: Math.max(
                0,
                oldData.unreadCount - 1
              ),
            };
          }

          return oldData;
        }
      );

      return {
        previousNotifications,
        previousUnreadCount,
      };
    },

    // -----------------------------------------
    // If API fails → restore previous state
    // -----------------------------------------

    onError: (_error, _notificationId, context) => {
      if (context?.previousNotifications !== undefined) {
        queryClient.setQueryData(
          ["notifications"],
          context.previousNotifications
        );
      }

      if (context?.previousUnreadCount !== undefined) {
        queryClient.setQueryData(
          ["notification-unread-count"],
          context.previousUnreadCount
        );
      }
    },

    // -----------------------------------------
    // Backend is the final source of truth
    // -----------------------------------------

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });

      queryClient.invalidateQueries({
        queryKey: ["notification-unread-count"],
      });
    },
  });
};