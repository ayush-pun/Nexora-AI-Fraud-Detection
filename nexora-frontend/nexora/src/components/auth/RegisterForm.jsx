import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "../ui/Input";
import Button from "../ui/Button";

import { registerSchema } from "../../schema/register.schema";
import { useRegister } from "../../services/auth/auth.mutation";

const RegisterForm = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const { mutate, isPending } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data) => {
    mutate(data, {
      onSuccess: () => {
        alert("Registration successful!");
        navigate("/login", { replace: true });
      },

      onError: (error) => {
        console.error(error);

        alert(
          error?.response?.data?.message ||
            "Registration failed."
        );
      },
    });
  };

  return (
    <>
      <div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Nexora
          </h1>

          <p className="mt-1 text-slate-500">
            AI Powered Digital Wallet
          </p>
        </div>

        <h2 className="mt-8 text-4xl font-bold tracking-tight text-slate-900">
          Create account
        </h2>

        <p className="mt-3 text-slate-500">
          Start your secure digital wallet journey.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <Input
          label="First Name"
          placeholder="John"
          error={errors.firstName}
          {...register("firstName")}
        />

        <Input
          label="Last Name"
          placeholder="Doe"
          error={errors.lastName}
          {...register("lastName")}
        />

        <Input
          label="Username"
          placeholder="john_doe"
          error={errors.username}
          {...register("username")}
        />

        <Input
          label="Email"
          type="email"
          placeholder="john@example.com"
          error={errors.email}
          {...register("email")}
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="98XXXXXXXX"
          error={errors.phoneNumber}
          {...register("phoneNumber")}
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
              onClick={() => setShowPassword(!showPassword)}
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

        <Input
          label="Confirm Password"
          type={
            showConfirmPassword ? "text" : "password"
          }
          placeholder="••••••••"
          error={errors.confirmPassword}
          {...register("confirmPassword")}
          rightIcon={
            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="text-slate-400 hover:text-slate-700"
            >
              {showConfirmPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          }
        />

        <Button
          type="submit"
          disabled={isPending}
          className="bg-slate-900 hover:bg-slate-800 hover:shadow-lg disabled:opacity-50"
        >
          {isPending
            ? "Creating Account..."
            : "Create Account"}
        </Button>

        <div className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Sign In
          </Link>
        </div>
      </form>
    </>
  );
};

export default RegisterForm;

