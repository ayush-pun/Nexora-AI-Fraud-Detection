import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("accessToken");
  const storedUser = localStorage.getItem("user");

  // Not logged in
  if (!token || !storedUser) {
    return <Navigate to="/" replace />;
  }

  let user;

  try {
    user = JSON.parse(storedUser);
  } catch (error) {
    console.error("Invalid user data in localStorage");

    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    return <Navigate to="/" replace />;
  }

  // Role-based protection
  if (allowedRoles && allowedRoles.length > 0) {
    const userRoles = user?.roles || [];

    const hasAllowedRole = allowedRoles.some((role) =>
      userRoles.includes(role)
    );

    if (!hasAllowedRole) {
      // Admin
      if (userRoles.includes("ROLE_ADMIN")) {
        return <Navigate to="/admin/dashboard" replace />;
      }

      // Analyst
      if (userRoles.includes("ROLE_ANALYST")) {
        return <Navigate to="/analyst/dashboard" replace />;
      }

      // Normal user
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;