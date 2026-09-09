import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "../ui/Input";
import Button from "../ui/Button";

import { loginSchema } from "../../schema/login.schema";
import { useLogin } from "../../services/auth/auth.mutation";

const LoginForm = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const { mutate, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    mutate(data, {
      onSuccess: (response) => {
        const {
          accessToken,
          refreshToken,
          user,
        } = response;

        // Store authentication data
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));

        // Get roles returned by the backend
        const roles = user?.roles || [];

        // Admin
        if (roles.includes("ROLE_ADMIN")) {
          navigate("/admin/dashboard", {
            replace: true,
          });
          return;
        }

        // Fraud analyst
        if (roles.includes("ROLE_ANALYST")) {
          navigate("/analyst/dashboard", {
            replace: true,
          });
          return;
        }

        // Normal wallet user
        if (roles.includes("ROLE_USER")) {
          navigate("/dashboard", {
            replace: true,
          });
          return;
        }

        // Unknown / invalid role
        alert(
          "Your account does not have a valid role."
        );
      },

      onError: (error) => {
        alert(
          error?.response?.data?.message ||
            "Invalid email or password"
        );
      },
    });
  };

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Nexora
        </h1>

        <p className="mt-1 text-slate-500">
          AI Powered Digital Wallet
        </p>

        <h2 className="mt-8 text-4xl font-bold tracking-tight text-slate-900">
          Welcome back
        </h2>

        <p className="mt-3 text-slate-500">
          Sign in to continue securely.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email}
          {...register("email")}
        />

        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          error={errors.password}
          {...register("password")}
          rightIcon={
            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="text-slate-400 hover:text-slate-700"
            >
              {showPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          }
        />

        <div className="flex justify-end">
          <button
            type="button"
            className="text-sm font-medium text-slate-600 hover:text-indigo-600"
          >
            Forgot password?
          </button>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="bg-slate-900 hover:bg-slate-800 hover:shadow-lg disabled:opacity-50"
        >
          {isPending ? "Signing In..." : "Sign In"}
        </Button>

        <div className="text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Register
          </Link>
        </div>
      </form>
    </>
  );
};

export default LoginForm;