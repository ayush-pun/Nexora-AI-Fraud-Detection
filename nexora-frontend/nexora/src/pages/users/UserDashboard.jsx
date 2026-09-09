import { useMemo } from "react";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import WalletCard from "../../components/dashboard/WalletCard";
import TransactionList from "../../components/dashboard/TransactionList";
import QuickActions from "../../components/dashboard/QuickActions";
import AIStatusCard from "../../components/dashboard/AIStatusCard";
import WalletInsights from "../../components/dashboard/WalletInsights";

const UserDashboard = () => {
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  return (
    <div className="min-h-full bg-slate-50">
      {/* Header */}
      <DashboardHeader user={user} />

      {/* Main Dashboard */}
      <main className="px-4 pb-8 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">

          {/* Top Section */}
          <div className="grid gap-6 lg:grid-cols-3">
            
            {/* Wallet */}
            <div className="lg:col-span-2">
              <WalletCard />
            </div>

            {/* Quick Actions */}
            <div>
              <QuickActions />
            </div>
          </div>

          {/* Middle Section */}
          <div className="grid gap-6 lg:grid-cols-3">

            {/* Recent Transactions */}
            <div className="lg:col-span-2">
              <TransactionList />
            </div>

            {/* Wallet Insights */}
            <div>
              <WalletInsights />
            </div>
          </div>

          {/* AI / Fraud Protection */}
          <div>
            <AIStatusCard />
          </div>

        </div>
      </main>
    </div>
  );
};

export default UserDashboard;