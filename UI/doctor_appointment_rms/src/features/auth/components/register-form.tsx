"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { registerSchema } from "../schemas/register.schema";
import type { RegisterDto } from "../types/auth.types";
import { useRegister } from "../hooks/use-register";

export function RegisterForm() {
  const registerMutation = useRegister();
  
  // Visibility states for the two password fields
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "", // Added for local validation
      role: "User",
    },
  });

  const onSubmit = (values: any) => {
    // We destructure to separate the frontend-only field from the payload
    const { confirmPassword, ...payload } = values;
    
    // Only send the payload that matches your backend requirements
    registerMutation.mutate(payload);
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Register to get started</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Input placeholder="First Name" {...form.register("firstName")} />
          {form.formState.errors.firstName && (
            <p className="text-sm text-red-500">{form.formState.errors.firstName.message?.toString()}</p>
          )}

          <Input placeholder="Last Name" {...form.register("lastName")} />
          {form.formState.errors.lastName && (
            <p className="text-sm text-red-500">{form.formState.errors.lastName.message?.toString()}</p>
          )}

          <Input placeholder="Email" {...form.register("email")} />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500">{form.formState.errors.email.message?.toString()}</p>
          )}

          {/* Password Field */}
          <div className="relative">
            <Input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              {...form.register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="text-sm text-red-500">{form.formState.errors.password.message?.toString()}</p>
          )}

          {/* Confirm Password Field (Frontend Only) */}
          <div className="relative">
            <Input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              {...form.register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {form.formState.errors.confirmPassword && (
            <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message?.toString()}</p>
          )}

          <Input placeholder="Role (User/Admin/Doctor)" {...form.register("role")} />
          
          <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? "Creating..." : "Register"}
          </Button>

          {registerMutation.isError && (
            <p className="text-sm text-red-500 text-center">
              Registration failed. Try again.
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}