import {
  ArrowLeft,
  Bell,
  Check,
  CheckCheck,
  Clock,
  ShieldAlert,
  Wallet,
  XCircle,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../layouts/DashboardLayout";

import {
  useNotifications,
  useUnreadNotificationCount,
} from "../../services/notification/notification.query";

import { useMarkNotificationAsRead } from "../../services/notification/notification.mutation";

const Notifications = () => {
  const navigate = useNavigate();

  const {
    data: notifications = [],
    isLoading,
    isError,
  } = useNotifications();

  const {
    data: unreadData,
    isLoading: isUnreadCountLoading,
  } = useUnreadNotificationCount();

  const {
    mutate: markAsRead,
    isPending: isMarkingRead,
  } = useMarkNotificationAsRead();

  /*
   * Backend might return:
   *
   * 5
   *
   * OR
   *
   * { count: 5 }
   *
   * OR
   *
   * { unreadCount: 5 }
   */

  const unreadCount =
    typeof unreadData === "number"
      ? unreadData
      : unreadData?.count ??
        unreadData?.unreadCount ??
        0;

  const handleMarkAsRead = (notification) => {
    if (!notification?.id) {
      return;
    }

    if (notification.read) {
      return;
    }

    if (isMarkingRead) {
      return;
    }

    markAsRead(notification.id);
  };

  const getNotificationIcon = (notification) => {
    const type = notification?.type?.toUpperCase();

    if (type?.includes("FRAUD")) {
      return (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-100">
          <ShieldAlert
            size={22}
            className="text-red-600"
          />
        </div>
      );
    }

    if (type?.includes("TRANSACTION")) {
      return (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-100">
          <Wallet
            size={22}
            className="text-indigo-600"
          />
        </div>
      );
    }

    if (type?.includes("SECURITY")) {
      return (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-100">
          <ShieldAlert
            size={22}
            className="text-amber-600"
          />
        </div>
      );
    }

    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
        <Bell
          size={22}
          className="text-slate-600"
        />
      </div>
    );
  };

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    const notificationDate = new Date(date);

    if (Number.isNaN(notificationDate.getTime())) {
      return "";
    }

    return notificationDate.toLocaleString("en-NP", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl">

        {/* ================= HEADER ================= */}

        <div className="mb-8 flex items-center gap-4">

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="rounded-xl border border-slate-200 bg-white p-3 text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="flex-1">

            <div className="flex flex-wrap items-center gap-3">

              <h1 className="text-3xl font-bold text-slate-900">
                Notifications
              </h1>

              {!isUnreadCountLoading && unreadCount > 0 && (
                <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
                  {unreadCount} unread
                </span>
              )}

            </div>

            <p className="mt-1 text-slate-500">
              Stay updated with your Nexora account activity.
            </p>

          </div>

        </div>

        {/* ================= LOADING ================= */}

        {isLoading && (
          <div className="space-y-4">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex gap-4">

                  <div className="h-12 w-12 rounded-2xl bg-slate-200" />

                  <div className="flex-1 space-y-3">

                    <div className="h-5 w-48 rounded bg-slate-200" />

                    <div className="h-4 w-3/4 rounded bg-slate-200" />

                    <div className="h-3 w-32 rounded bg-slate-200" />

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

        {/* ================= ERROR ================= */}

        {isError && (
          <div className="flex min-h-[40vh] items-center justify-center">

            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">

              <XCircle
                size={40}
                className="mx-auto text-red-500"
              />

              <h2 className="mt-4 text-xl font-bold text-red-800">
                Unable to load notifications
              </h2>

              <p className="mt-2 text-sm text-red-600">
                We couldn't retrieve your notifications.
              </p>

            </div>

          </div>
        )}

        {/* ================= EMPTY ================= */}

        {!isLoading &&
          !isError &&
          notifications.length === 0 && (

            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">

                <Bell
                  size={30}
                  className="text-indigo-600"
                />

              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                No notifications
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                You're all caught up. We'll notify you when
                there is important activity on your Nexora
                account.
              </p>

            </div>
          )}

        {/* ================= NOTIFICATIONS ================= */}

        {!isLoading &&
          !isError &&
          notifications.length > 0 && (

            <div className="space-y-4">

              {notifications.map((notification) => (

                <div
                  key={notification.id}
                  className={`
                    group rounded-3xl border p-5 shadow-sm
                    transition-all duration-300
                    hover:-translate-y-1 hover:shadow-lg
                    ${
                      notification.read
                        ? "border-slate-200 bg-white"
                        : "border-indigo-200 bg-indigo-50/40"
                    }
                  `}
                >

                  <div className="flex gap-4">

                    {/* ICON */}

                    {getNotificationIcon(notification)}

                    {/* CONTENT */}

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                        <div>

                          <div className="flex items-center gap-2">

                            <h2
                              className={`
                                font-bold
                                ${
                                  notification.read
                                    ? "text-slate-800"
                                    : "text-slate-900"
                                }
                              `}
                            >
                              {notification.title}
                            </h2>

                            {!notification.read && (
                              <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                            )}

                          </div>

                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {notification.message}
                          </p>

                        </div>

                        {!notification.read && (
                          <span className="shrink-0 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                            New
                          </span>
                        )}

                      </div>

                      {/* FOOTER */}

                      <div className="mt-4 flex flex-col gap-3 border-t border-slate-200/70 pt-4 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex items-center gap-2 text-xs text-slate-400">

                          <Clock size={14} />

                          <span>
                            {formatDate(notification.createdAt)}
                          </span>

                        </div>

                        {/* MARK AS READ */}

                        {!notification.read && (
                          <button
                            type="button"
                            onClick={() =>
                              handleMarkAsRead(notification)
                            }
                            disabled={
                              isMarkingRead
                            }
                            className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >

                            <Check size={15} />

                            {isMarkingRead
                              ? "Marking..."
                              : "Mark as read"}

                          </button>
                        )}

                        {/* READ */}

                        {notification.read && (
                          <div className="flex items-center gap-2 text-xs font-medium text-emerald-600">

                            <CheckCheck size={15} />

                            Read

                          </div>
                        )}

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>
          )}

      </div>
    </DashboardLayout>
  );
};

export default Notifications;