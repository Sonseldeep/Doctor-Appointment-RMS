"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { RiStethoscopeLine, RiUserLine, RiHeartPulseFill } from "@remixicon/react";
import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { registerSchema } from "../schemas/register.schema";
import type { RegisterDto } from "../types/auth.types";
import { useRegister } from "../hooks/use-register";

export function RegisterForm() {
  const registerMutation = useRegister();
  
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<any>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "", 
      role: "Registered",
    },
  });

  const onSubmit = (values: any) => {
    const { confirmPassword, ...payload } = values;
    registerMutation.mutate(payload);
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* LEFT PANEL - Branding (Hidden on smaller screens) */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 flex-col justify-between relative overflow-hidden p-12 text-white">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex items-center gap-2">
          <div className="p-2 bg-white rounded-lg">
            <RiHeartPulseFill className="text-blue-600 size-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight">DocCare</span>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <h1 className="text-5xl font-bold leading-tight">
            Join Our <br /> Healthcare Network.
          </h1>
          <p className="text-lg text-blue-100 leading-relaxed">
            Create an account today to streamline your healthcare experience. It’s fast, secure, and entirely free.
          </p>
        </div>

        <div className="relative z-10 text-sm text-blue-200">
          © {new Date().getFullYear()} DocCare Health. All rights reserved.
        </div>
      </div>

      {/* RIGHT PANEL - Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 xl:p-16 relative bg-slate-50 lg:bg-white overflow-y-auto">
        <Link
          href="/"
          className="absolute left-6 top-6 sm:left-8 sm:top-8 p-2 hover:bg-slate-100 text-slate-500 rounded-full transition-all flex items-center justify-center group"
          aria-label="Back to home"
        >
          <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
        </Link>

        <div className="w-full max-w-md space-y-8 mt-12 lg:mt-0">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Create Account</h2>
            <p className="text-slate-500">Register as a patient or doctor to get started.</p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Fields Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">First Name</label>
                <Input 
                  placeholder="John" 
                  className="h-12 rounded-xl bg-white border-slate-200 focus-visible:ring-blue-600 focus-visible:border-blue-600 shadow-sm"
                  {...form.register("firstName")} 
                />
                {form.formState.errors.firstName && (
                  <p className="text-xs text-destructive">{form.formState.errors.firstName.message?.toString()}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Last Name</label>
                <Input 
                  placeholder="Doe" 
                  className="h-12 rounded-xl bg-white border-slate-200 focus-visible:ring-blue-600 focus-visible:border-blue-600 shadow-sm"
                  {...form.register("lastName")} 
                />
                {form.formState.errors.lastName && (
                  <p className="text-xs text-destructive">{form.formState.errors.lastName.message?.toString()}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <Input 
                placeholder="john@example.com" 
                className="h-12 rounded-xl bg-white border-slate-200 focus-visible:ring-blue-600 focus-visible:border-blue-600 shadow-sm"
                {...form.register("email")} 
              />
              {form.formState.errors.email && (
                <p className="text-xs text-destructive">{form.formState.errors.email.message?.toString()}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <Input
                  type={showPass ? "text" : "password"}
                  placeholder="Create a password"
                  className="h-12 rounded-xl pr-10 bg-white border-slate-200 focus-visible:ring-blue-600 focus-visible:border-blue-600 shadow-sm"
                  {...form.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-xs text-destructive">{form.formState.errors.password.message?.toString()}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700">Confirm Password</label>
              <div className="relative">
                <Input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="h-12 rounded-xl pr-10 bg-white border-slate-200 focus-visible:ring-blue-600 focus-visible:border-blue-600 shadow-sm"
                  {...form.register("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirm ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
              {form.formState.errors.confirmPassword && (
                <p className="text-xs text-destructive">{form.formState.errors.confirmPassword.message?.toString()}</p>
              )}
            </div>

            {/* Role Selection */}
            <div className="space-y-3 pt-2">
              <label className="text-sm font-semibold text-slate-700">I am registering as a:</label>
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all select-none ${
                    form.watch("role") === "Doctor" 
                      ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-600" 
                      : "border-slate-200 bg-white hover:border-blue-300 text-slate-600"
                  }`}
                  onClick={() => form.setValue("role", "Doctor", { shouldValidate: true })}
                >
                  <div className={`p-2 rounded-lg ${form.watch("role") === "Doctor" ? "bg-blue-100" : "bg-slate-100"}`}>
                    <RiStethoscopeLine className="size-5" />
                  </div>
                  <span className="font-semibold text-sm">Doctor</span>
                </div>

                <div 
                  className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all select-none ${
                    form.watch("role") === "Registered" 
                      ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-600" 
                      : "border-slate-200 bg-white hover:border-blue-300 text-slate-600"
                  }`}
                  onClick={() => form.setValue("role", "Registered", { shouldValidate: true })}
                >
                  <div className={`p-2 rounded-lg ${form.watch("role") === "Registered" ? "bg-blue-100" : "bg-slate-100"}`}>
                    <RiUserLine className="size-5" />
                  </div>
                  <span className="font-semibold text-sm">Patient</span>
                </div>
              </div>
              {form.formState.errors.role && (
                <p className="text-xs text-destructive">{form.formState.errors.role.message?.toString()}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-base font-semibold shadow-md transition-all mt-6" 
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 size-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            {registerMutation.isError && (
              <div className="flex items-center justify-center gap-2 mt-4 text-destructive bg-destructive/10 p-3 rounded-lg">
                <AlertCircle className="size-5" />
                <span className="text-sm font-medium">Registration failed. Please try again.</span>
              </div>
            )}

            {/* Login Link */}
            <div className="text-center pt-4 text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors">
                Sign in here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}