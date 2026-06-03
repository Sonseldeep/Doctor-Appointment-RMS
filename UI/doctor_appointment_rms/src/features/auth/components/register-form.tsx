"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

  const form = useForm<RegisterDto>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "User",
    },
  });

  const onSubmit = (values: RegisterDto) => {
    registerMutation.mutate(values);
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Register to get started</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          
          {/* First Name */}
          <Input placeholder="First Name" {...form.register("firstName")} />
          {form.formState.errors.firstName && (
            <p className="text-sm text-red-500">
              {form.formState.errors.firstName.message}
            </p>
          )}

          {/* Last Name */}
          <Input placeholder="Last Name" {...form.register("lastName")} />
          {form.formState.errors.lastName && (
            <p className="text-sm text-red-500">
              {form.formState.errors.lastName.message}
            </p>
          )}

          {/* Email */}
          <Input placeholder="Email" {...form.register("email")} />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500">
              {form.formState.errors.email.message}
            </p>
          )}

          {/* Password */}
          <Input
            type="password"
            placeholder="Password"
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="text-sm text-red-500">
              {form.formState.errors.password.message}
            </p>
          )}

          {/* Role */}
          <Input placeholder="Role (User/Admin/Doctor)" {...form.register("role")} />
          {form.formState.errors.role && (
            <p className="text-sm text-red-500">
              {form.formState.errors.role.message}
            </p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={registerMutation.isPending}
          >
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