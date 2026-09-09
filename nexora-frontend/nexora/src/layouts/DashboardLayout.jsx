import Sidebar from "../components/layout/Sidebar";
import { useSidebar } from "../context/SidebarContext";

const DashboardLayout = ({ children }) => {
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-[#EEF4FA]">

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main
        className={`min-h-screen transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          {children}
        </div>
      </main>

    </div>
  );
};

export default DashboardLayout;