import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const signupSchema = z
  .object({
    username: z.string().min(2, "Username must be at least 2 characters long"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const productSchema = z.object({
  title: z
    .string()
    .min(1, "Product title is required")
    .max(100, "Title must be 100 characters or less"),
  category: z.string().min(1, "Please select a category"),
  description: z
    .string()
    .min(1, "Product description is required")
    .max(500, "Description must be 500 characters or less"),
  price: z.coerce
    .number()
    .min(0.01, "Price must be greater than 0")
    .max(99999, "Price is too high"),
});

export const profileSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters long"),
  email: z.string().email("Please enter a valid email address"),
});
export const categories = [
  { id: 2, name: "Electronics" },
  { id: 1, name: "Clothing" },
  { id: 3, name: "Furniture" },
  { id: 4, name: "Books" },
  { id: 5, name: "Sports" },
  { id: 6, name: "Home & Garden" },
  { id: 7, name: "Toys" },
  { id: 8, name: "Automotive" },
  { id: 9, name: "Health & Beauty" },
  { id: 10, name: "Other" },
];
