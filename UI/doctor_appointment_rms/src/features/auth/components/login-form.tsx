// "use client";

// import { Loader2, Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link"; // Added for seamless client-side routing
// import { toast } from "sonner";

// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// import { loginSchema } from "../schemas/auth.schema";
// import type { LoginDto } from "../types/auth.types";

// import { useLogin } from "../hooks/use-login";
// import { useForgotPassword } from "../hooks/use-forgot-password";

// export function LoginForm() {
//   const loginMutation = useLogin();
//   const forgotPassword = useForgotPassword();
//   const router = useRouter();

//   const [email, setEmail] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const form = useForm<LoginDto>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const onSubmit = (values: LoginDto) => {
//     loginMutation.mutate(values);
//   };

//   const handleForgotPassword = () => {
//     if (!email) {
//       toast.error("Please enter your email first");
//       return;
//     }

//     forgotPassword.mutate(
//       { email },
//       {
//         onSuccess: () => {
//           toast.success("OTP sent to your email");
//           router.push("/reset-password");
//         },
//         onError: () => {
//           toast.error("Failed to send OTP");
//         },
//       }
//     );
//   };

//   const isAuthError = loginMutation.isError;

//   return (
//     <Card className="relative w-full max-w-md shadow-xl border bg-background/95 backdrop-blur">
      
//       <Link
//         href="/"
//         className="absolute left-4 top-4 p-2 hover:bg-muted text-muted-foreground hover:text-foreground active:scale-95 rounded-xl transition-all border border-border shadow-sm bg-background flex items-center justify-center group"
//         aria-label="Back to home"
//       >
//         <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform stroke-[2.5]" />
//       </Link>

//       <CardHeader className="space-y-2 text-center">
//         <CardTitle className="text-3xl font-bold tracking-tight">
//           Welcome Back
//         </CardTitle>

//         <CardDescription>
//           Login to continue to your account
//         </CardDescription>
//       </CardHeader>

//       <CardContent>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="space-y-5"
//         >
//           {/* Email Field Panel */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium">Email</label>

//             <Input
//               placeholder="john@example.com"
//               autoComplete="email"
//               className={`h-11 transition-colors ${
//                 isAuthError || form.formState.errors.email
//                   ? "border-destructive bg-destructive/5 focus-visible:ring-destructive"
//                   : ""
//               }`}
//               {...form.register("email")}
//               onChange={(e) => {
//                 form.setValue("email", e.target.value);
//                 setEmail(e.target.value);
//               }}
//             />

//             {form.formState.errors.email && (
//               <p className="text-sm text-destructive">
//                 {form.formState.errors.email.message}
//               </p>
//             )}
//           </div>

//           {/* Password Field Panel with Visibility Toggle */}
//           <div className="space-y-2">
//             <label className="text-sm font-medium">Password</label>

//             <div className="relative">
//               <Input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="••••••••"
//                 autoComplete="current-password"
//                 className={`h-11 pr-10 transition-colors ${
//                   isAuthError || form.formState.errors.password
//                     ? "border-destructive bg-destructive/5 focus-visible:ring-destructive"
//                     : ""
//                 }`}
//                 {...form.register("password")}
//               />
              
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
//                 tabIndex={-1}
//               >
//                 {showPassword ? (
//                   <EyeOff className="size-4" />
//                 ) : (
//                   <Eye className="size-4" />
//                 )}
//               </button>
//             </div>

//             {form.formState.errors.password && (
//               <p className="text-sm text-destructive">
//                 {form.formState.errors.password.message}
//               </p>
//             )}

//             {isAuthError && !form.formState.errors.password && (
//               <div className="flex items-start gap-1.5 mt-2 text-destructive animate-in fade-in duration-200">
//                 <AlertCircle className="size-4 mt-0.5 flex-shrink-0" />
//                 <span className="text-xs font-medium leading-relaxed">
//                   Invalid Credentials. Please double check your entries.
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* Submit */}
//           <Button
//             type="submit"
//             disabled={loginMutation.isPending}
//             className="h-11 w-full font-semibold"
//           >
//             {loginMutation.isPending ? (
//               <>
//                 <Loader2 className="mr-2 size-4 animate-spin" />
//                 Signing in...
//               </>
//             ) : (
//               "Sign In"
//             )}
//           </Button>

//           {/* Links Section (Forgot Password & Register) */}
//           <div className="space-y-3 pt-1 text-center">
//             <div>
//               <Dialog>
//                 <DialogTrigger asChild>
//                   <button 
//                     type="button" 
//                     className="text-sm text-blue-600 hover:underline font-medium"
//                   >
//                     Forgot password?
//                   </button>
//                 </DialogTrigger>

//                 <DialogContent className="space-y-4">
//                   <DialogHeader>
//                     <DialogTitle>Reset Password</DialogTitle>
//                   </DialogHeader>

//                   <Input
//                     placeholder="Enter your email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                   />

//                   <Button
//                     className="w-full"
//                     onClick={handleForgotPassword}
//                     disabled={forgotPassword.isPending}
//                   >
//                     {forgotPassword.isPending
//                       ? "Sending OTP..."
//                       : "Send OTP"}
//                   </Button>
//                 </DialogContent>
//               </Dialog>
//             </div>

//             {/*  Register Redirect Context Link Row */}
//             <div className="text-sm text-muted-foreground border-t pt-3 mt-1">
//               {"Don't have an account? "}
//               <Link 
//                 href="/register" 
//                 className="text-blue-600 hover:underline font-semibold transition-colors"
//               >
//                 Register here
//               </Link>
//             </div>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { Loader2, Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { loginSchema } from "../schemas/auth.schema";
import type { LoginDto } from "../types/auth.types";
import { useLogin } from "../hooks/use-login";
import { useForgotPassword } from "../hooks/use-forgot-password";
import { RiHeartPulseFill } from "@remixicon/react";

export function LoginForm() {
  const loginMutation = useLogin();
  const forgotPassword = useForgotPassword();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginDto>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginDto) => {
    loginMutation.mutate(values);
  };

  const handleForgotPassword = () => {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }
    forgotPassword.mutate(
      { email },
      {
        onSuccess: () => {
          toast.success("OTP sent to your email");
          router.push("/reset-password");
        },
        onError: () => {
          toast.error("Failed to send OTP");
        },
      }
    );
  };

  const isAuthError = loginMutation.isError;

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* LEFT PANEL - Branding & Illustration (Hidden on smaller screens) */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 flex-col justify-between relative overflow-hidden p-12 text-white">
        {/* Decorative Background Circles */}
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
            Your Health, <br /> Our Priority.
          </h1>
          <p className="text-lg text-blue-100 leading-relaxed">
            Log in to access your dashboard, manage appointments, and connect with top healthcare professionals seamlessly.
          </p>
        </div>

        <div className="relative z-10 text-sm text-blue-200">
          © {new Date().getFullYear()} DocCare Health. All rights reserved.
        </div>
      </div>

      {/* RIGHT PANEL - Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 sm:p-12 xl:p-24 relative bg-slate-50 lg:bg-white">
        <Link
          href="/"
          className="absolute left-6 top-6 sm:left-8 sm:top-8 p-2 hover:bg-slate-100 text-slate-500 rounded-full transition-all flex items-center justify-center group"
          aria-label="Back to home"
        >
          <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
        </Link>

        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Welcome Back</h2>
            <p className="text-slate-500">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email Address</label>
              <Input
                placeholder="john@example.com"
                autoComplete="email"
                className={`h-12 rounded-xl bg-white border-slate-200 transition-all focus-visible:ring-blue-600 focus-visible:border-blue-600 shadow-sm ${
                  isAuthError || form.formState.errors.email
                    ? "border-destructive focus-visible:ring-destructive"
                    : ""
                }`}
                {...form.register("email")}
                onChange={(e) => {
                  form.setValue("email", e.target.value);
                  setEmail(e.target.value);
                }}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`h-12 rounded-xl pr-10 bg-white border-slate-200 transition-all focus-visible:ring-blue-600 focus-visible:border-blue-600 shadow-sm ${
                    isAuthError || form.formState.errors.password
                      ? "border-destructive focus-visible:ring-destructive"
                      : ""
                  }`}
                  {...form.register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
              )}
              {isAuthError && !form.formState.errors.password && (
                <div className="flex items-center gap-1.5 mt-2 text-destructive animate-in fade-in">
                  <AlertCircle className="size-4 flex-shrink-0" />
                  <span className="text-sm font-medium">Invalid credentials. Please try again.</span>
                </div>
              )}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end pt-1">
              <Dialog>
                <DialogTrigger asChild>
                  <button type="button" className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors">
                    Forgot password?
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md rounded-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl">Reset Password</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Input
                      placeholder="Enter your registered email"
                      className="h-12 rounded-xl"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button
                      className="w-full h-12 rounded-xl text-base"
                      onClick={handleForgotPassword}
                      disabled={forgotPassword.isPending}
                    >
                      {forgotPassword.isPending ? "Sending OTP..." : "Send Reset Link"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="h-12 w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-base font-semibold shadow-md transition-all mt-2"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 size-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Registration Link */}
            <div className="text-center pt-6 text-slate-500">
              Don't have an account?{" "}
              <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors">
                Register here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}