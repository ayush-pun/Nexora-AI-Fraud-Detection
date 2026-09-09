import {
  LayoutDashboard,
  Wallet,
  SendHorizontal,
  History,
  ShieldCheck,
  User,
  LogOut,
  Menu,
  ChevronLeft,
  Banknote,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useSidebar } from "../../context/SidebarContext";

const menuSections = [
  {
    title: "MAIN",
    items: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Send Money",
        path: "/send-money",
        icon: SendHorizontal,
      },
      {
        title: "Withdraw",
        path: "/withdraw",
        icon: Banknote,
      },
      {
        title: "Deposit Money",
        path: "/deposit-money",
        icon: Wallet,
      },
      {
        title: "Profile",
        path: "/profile",
        icon: User,
      },
      {
        title: "Transactions",
        path: "/transactions",
        icon: History,
      },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      {
        title: "Profile",
        path: "/profile",
        icon: User,
      },
    ],
  },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const { collapsed, toggleSidebar } = useSidebar();

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const initials =
    user?.fullName
      ?.split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase() || "U";

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("adminToken");

    navigate("/");
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-slate-200 bg-white transition-all duration-300 ${collapsed ? "w-20" : "w-64"
        }`}
    >
      {/* Logo */}

      <div
        className={`flex items-center ${collapsed ? "justify-center" : "justify-between"
          } border-b border-slate-100 px-5 py-6`}
      >
        {!collapsed && (
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              Nexora
            </h1>

            <p className="text-xs tracking-wide text-slate-400">
              AI Fraud Detection
            </p>
          </div>
        )}

        <button
          onClick={toggleSidebar}
          className="rounded-xl p-2 transition-all duration-300 hover:bg-slate-100"
        >
          {collapsed ? (
            <Menu size={20} />
          ) : (
            <ChevronLeft size={20} />
          )}
        </button>
      </div>

      {/* Navigation */}

      <nav className="mt-6 flex-1 overflow-y-auto px-3">
        {menuSections.map((section) => (
          <div
            key={section.title}
            className="mb-8"
          >
            {!collapsed && (
              <p className="mb-3 px-3 text-xs font-bold uppercase tracking-widest text-slate-400">
                {section.title}
              </p>
            )}

            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.title}
                    to={item.path}
                    title={collapsed ? item.title : ""}
                    className={({ isActive }) =>
                      `group relative flex items-center rounded-xl transition-all duration-300 ${collapsed
                        ? "justify-center p-3"
                        : "gap-4 px-4 py-3"
                      } ${isActive
                        ? "bg-indigo-50 text-indigo-700 shadow-sm"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <div className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-indigo-600"></div>
                        )}

                        <Icon
                          size={20}
                          className="transition-transform duration-300 group-hover:scale-110"
                        />

                        {!collapsed && (
                          <span className="font-medium">
                            {item.title}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}

      <div className="border-t border-slate-100 p-4">
        <div
          className={`flex items-center ${collapsed ? "justify-center" : "gap-3"
            }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-lg font-bold text-white">
            {initials}
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900">
                {user?.fullName}
              </p>

              <p className="truncate text-sm text-slate-500">
                {user?.email}
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          className={`mt-5 flex w-full items-center rounded-xl border border-slate-200 bg-slate-50 py-3 text-sm font-medium text-slate-700 transition-all duration-300 hover:border-red-100 hover:bg-red-50 hover:text-red-600 ${collapsed
            ? "justify-center"
            : "justify-center gap-2"
            }`}
        >
          <LogOut size={18} />

          {!collapsed && "Logout"}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

