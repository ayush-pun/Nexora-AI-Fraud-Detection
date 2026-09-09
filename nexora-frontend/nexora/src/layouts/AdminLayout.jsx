
import { useState } from "react";
import { Menu, Bell } from "lucide-react";

import AdminSidebar from "../components/admin/AdminSidebar";

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* =========================
          SIDEBAR
      ========================== */}

      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* =========================
          MAIN AREA
      ========================== */}

      <div className="lg:pl-64">
        {/* Top Header */}

        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            {/* Mobile menu */}

            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={22} />
            </button>

            <div>
              <p className="text-sm font-semibold text-slate-900">
                Admin Portal
              </p>

              <p className="text-xs text-slate-400">
                Nexora AI Fraud Detection
              </p>
            </div>
          </div>

          {/* Right side */}

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <Bell size={20} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>

            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                A
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Administrator
                </p>

                <p className="text-xs text-slate-400">
                  Admin
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}

        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;