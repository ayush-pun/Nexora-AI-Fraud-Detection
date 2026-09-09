import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";


// ========================================
// LAYOUTS
// ========================================

import DashboardLayout from "../layouts/DashboardLayout";
import AdminLayout from "../layouts/AdminLayout";


// ========================================
// AUTH PAGES
// ========================================

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";


// ========================================
// USER PAGES
// ========================================

import UserDashboard from "../pages/users/UserDashboard";
import SendMoney from "../pages/users/SendMoney";
import WithdrawMoney from "../pages/users/WithdrawMoney";
import DepositMoney from "../pages/users/DepositMoney";
import Transactions from "../pages/users/Transaction";
import Profile from "../pages/users/Profile";
import Notifications from "../pages/users/Notifications";


// ========================================
// ADMIN PAGES
// ========================================

import AdminDashboard from "../pages/admin/AdminDashboard";
import Users from "../pages/admin/Users";
import FraudCases from "../pages/admin/FraudCases";
import BlackList from "../pages/admin/BlackList";
import Wallet from "../pages/admin/Wallet";
import Analytics from "../pages/admin/Analytics";

// ========================================
// ROUTE PROTECTION
// ========================================

import ProtectedRoute from "./ProtectedRoute";


const AppRoutes = () => {

  return (
    <BrowserRouter>

      <Routes>

        {/* =========================================
                    PUBLIC ROUTES
                ========================================== */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* =========================================
                    USER ROUTES
                ========================================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["ROLE_USER"]}
            >
              <DashboardLayout>
                <UserDashboard />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

    


        <Route
          path="/send-money"
          element={
            <ProtectedRoute
              allowedRoles={["ROLE_USER"]}
            >
              <DashboardLayout>
                <SendMoney />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />


        <Route
          path="/withdraw"
          element={
            <ProtectedRoute
              allowedRoles={["ROLE_USER"]}
            >
              <DashboardLayout>
                <WithdrawMoney />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />


        <Route
          path="/deposit-money"
          element={
            <ProtectedRoute
              allowedRoles={["ROLE_USER"]}
            >
              <DashboardLayout>
                <DepositMoney />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />


        <Route
          path="/transactions"
          element={
            <ProtectedRoute
              allowedRoles={["ROLE_USER"]}
            >
              <DashboardLayout>
                <Transactions />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />


        <Route
          path="/profile"
          element={
            <ProtectedRoute
              allowedRoles={["ROLE_USER"]}
            >
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />


        <Route
          path="/notifications"
          element={
            <ProtectedRoute
              allowedRoles={["ROLE_USER"]}>
              <DashboardLayout>
                <Notifications />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        


        {/* =========================================
                    ADMIN ROUTES
                ========================================== */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute
              allowedRoles={["ROLE_ADMIN"]}
            >
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </ProtectedRoute>
          }
        />


        <Route
          path="/admin/users"
          element={
            <ProtectedRoute
              allowedRoles={["ROLE_ADMIN"]}
            >
              <AdminLayout>
                <Users />
              </AdminLayout>
            </ProtectedRoute>
          }
        />


        <Route
          path="/admin/fraud-cases"
          element={
            <ProtectedRoute
              allowedRoles={["ROLE_ADMIN"]}
            >
              <AdminLayout>
                <FraudCases />
              </AdminLayout>
            </ProtectedRoute>
          }
        />


        <Route
          path="/admin/wallets"
          element={
            <ProtectedRoute
              allowedRoles={["ROLE_ADMIN"]}
            >
              <AdminLayout>
                <Wallet />
              </AdminLayout>
            </ProtectedRoute>
          }
        />


        <Route
          path="/admin/blacklist"
          element={
            <ProtectedRoute
              allowedRoles={["ROLE_ADMIN"]}
            >
              <AdminLayout>
                <BlackList />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
              <AdminLayout>
                <Analytics />
              </AdminLayout>
            </ProtectedRoute>
          }
        />


        {/* =========================================
                    ANALYST ROUTES
                ========================================== */}

        {/*
                <Route
                    path="/analyst/dashboard"
                    element={
                        <ProtectedRoute
                            allowedRoles={["ROLE_ANALYST"]}
                        >
                            <AnalystDashboard />
                        </ProtectedRoute>
                    }
                />
                */}

      </Routes>

    </BrowserRouter>
  );
};


export default AppRoutes;