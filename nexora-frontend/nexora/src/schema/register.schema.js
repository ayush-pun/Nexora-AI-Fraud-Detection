import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "First name is required"),

    lastName: z
      .string()
      .min(2, "Last name is required"),

    username: z
      .string()
      .min(3, "Username must be at least 3 characters"),

    email: z
      .email("Invalid email address"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    confirmPassword: z
      .string(),

    phoneNumber: z
      .string()
      .min(7, "Enter a valid phone number"),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );