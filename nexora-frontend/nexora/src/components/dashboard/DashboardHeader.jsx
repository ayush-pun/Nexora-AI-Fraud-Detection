import { Bell, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "../../context/SidebarContext";
import { useUnreadNotificationCount } from "../../services/notification/notification.query";

const DashboardHeader = ({ user }) => {
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();

  const { data: unreadData } = useUnreadNotificationCount();

  const unreadCount =
    typeof unreadData === "number"
      ? unreadData
      : unreadData?.count ||
        unreadData?.unreadCount ||
        0;

  const hour = new Date().getHours();

  let greeting = "Hello";

  if (hour < 12) greeting = "Good Morning";
  else if (hour < 18) greeting = "Good Afternoon";
  else greeting = "Good Evening";

  const fullName = user?.fullName
    ?.split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(" ");

  return (
    <header className="flex items-center justify-between">
      <div className="flex items-center gap-5">
        {/* Sidebar Button */}
        <button
          onClick={toggleSidebar}
          className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition-all duration-300 hover:scale-105 hover:bg-slate-50 hover:shadow-md"
        >
          <Menu size={20} />
        </button>

        {/* Greeting */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            {greeting},{" "}
            <span className="text-indigo-600">
              {fullName || "User"}
            </span>{" "}
            👋
          </h1>

          <p className="mt-2 text-slate-500">
            Welcome back to Nexora Wallet
          </p>
        </div>
      </div>

      {/* Notification Bell */}
      <button
        onClick={() => navigate("/notifications")}
        className="relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
        aria-label="Notifications"
      >
        <Bell
          size={22}
          className="text-slate-700"
        />

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold text-white shadow-sm">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
    </header>
  );
};

export default DashboardHeader;