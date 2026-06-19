// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Eye, EyeOff } from "lucide-react";

// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";

// import { registerSchema } from "../schemas/register.schema";
// import type { RegisterDto } from "../types/auth.types";
// import { useRegister } from "../hooks/use-register";

// export function RegisterForm() {
//   const registerMutation = useRegister();
  
//   // Visibility states for the two password fields
//   const [showPass, setShowPass] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   const form = useForm<any>({
//     resolver: zodResolver(registerSchema),
//     defaultValues: {
//       firstName: "",
//       lastName: "",
//       email: "",
//       password: "",
//       confirmPassword: "", // Added for local validation
//       role: "User",
//     },
//   });

//   const onSubmit = (values: any) => {
//     // We destructure to separate the frontend-only field from the payload
//     const { confirmPassword, ...payload } = values;
    
//     // Only send the payload that matches your backend requirements
//     registerMutation.mutate(payload);
//   };

//   return (
//     <Card className="w-full max-w-md shadow-xl">
//       <CardHeader className="text-center">
//         <CardTitle>Create Account</CardTitle>
//         <CardDescription>Register to get started</CardDescription>
//       </CardHeader>

//       <CardContent>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//           <Input placeholder="First Name" {...form.register("firstName")} />
//           {form.formState.errors.firstName && (
//             <p className="text-sm text-red-500">{form.formState.errors.firstName.message?.toString()}</p>
//           )}

//           <Input placeholder="Last Name" {...form.register("lastName")} />
//           {form.formState.errors.lastName && (
//             <p className="text-sm text-red-500">{form.formState.errors.lastName.message?.toString()}</p>
//           )}

//           <Input placeholder="Email" {...form.register("email")} />
//           {form.formState.errors.email && (
//             <p className="text-sm text-red-500">{form.formState.errors.email.message?.toString()}</p>
//           )}

//           {/* Password Field */}
//           <div className="relative">
//             <Input
//               type={showPass ? "text" : "password"}
//               placeholder="Password"
//               {...form.register("password")}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPass(!showPass)}
//               className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
//             >
//               {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           </div>
//           {form.formState.errors.password && (
//             <p className="text-sm text-red-500">{form.formState.errors.password.message?.toString()}</p>
//           )}

//           {/* Confirm Password Field (Frontend Only) */}
//           <div className="relative">
//             <Input
//               type={showConfirm ? "text" : "password"}
//               placeholder="Confirm Password"
//               {...form.register("confirmPassword")}
//             />
//             <button
//               type="button"
//               onClick={() => setShowConfirm(!showConfirm)}
//               className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
//             >
//               {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           </div>
//           {form.formState.errors.confirmPassword && (
//             <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message?.toString()}</p>
//           )}

//           <Input placeholder="Role (User/Admin/Doctor)" {...form.register("role")} />
          
//           <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
//             {registerMutation.isPending ? "Creating..." : "Register"}
//           </Button>

//           {registerMutation.isError && (
//             <p className="text-sm text-red-500 text-center">
//               Registration failed. Try again.
//             </p>
//           )}
//         </form>
//       </CardContent>
//     </Card>
//   );
// }

// "use client";

// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Eye, EyeOff } from "lucide-react";
// import { RiStethoscopeLine, RiUserLine } from "@remixicon/react";

// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";

// import { registerSchema } from "../schemas/register.schema";
// import type { RegisterDto } from "../types/auth.types";
// import { useRegister } from "../hooks/use-register";

// export function RegisterForm() {
//   const registerMutation = useRegister();
  
//   // Visibility states for the two password fields
//   const [showPass, setShowPass] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   const form = useForm<any>({
//     resolver: zodResolver(registerSchema),
//     defaultValues: {
//       firstName: "",
//       lastName: "",
//       email: "",
//       password: "",
//       confirmPassword: "", 
//       role: "Registered", // Default internally mapped to "Registered" (Patient)
//     },
//   });

//   const onSubmit = (values: any) => {
//     const { confirmPassword, ...payload } = values;
//     registerMutation.mutate(payload);
//   };

//   return (
//     <Card className="w-full max-w-md shadow-xl">
//       <CardHeader className="text-center">
//         <CardTitle>Create Account</CardTitle>
//         <CardDescription>Register to get started</CardDescription>
//       </CardHeader>

//       <CardContent>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//           <Input placeholder="First Name" {...form.register("firstName")} />
//           {form.formState.errors.firstName && (
//             <p className="text-sm text-red-500">{form.formState.errors.firstName.message?.toString()}</p>
//           )}

//           <Input placeholder="Last Name" {...form.register("lastName")} />
//           {form.formState.errors.lastName && (
//             <p className="text-sm text-red-500">{form.formState.errors.lastName.message?.toString()}</p>
//           )}

//           <Input placeholder="Email" {...form.register("email")} />
//           {form.formState.errors.email && (
//             <p className="text-sm text-red-500">{form.formState.errors.email.message?.toString()}</p>
//           )}

//           {/* Password Field */}
//           <div className="relative">
//             <Input
//               type={showPass ? "text" : "password"}
//               placeholder="Password"
//               {...form.register("password")}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPass(!showPass)}
//               className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
//             >
//               {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           </div>
//           {form.formState.errors.password && (
//             <p className="text-sm text-red-500">{form.formState.errors.password.message?.toString()}</p>
//           )}

//           {/* Confirm Password Field */}
//           <div className="relative">
//             <Input
//               type={showConfirm ? "text" : "password"}
//               placeholder="Confirm Password"
//               {...form.register("confirmPassword")}
//             />
//             <button
//               type="button"
//               onClick={() => setShowConfirm(!showConfirm)}
//               className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
//             >
//               {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           </div>
//           {form.formState.errors.confirmPassword && (
//             <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message?.toString()}</p>
//           )}

//           {/* Role Selection Cards */}
//           <div className="space-y-2 pt-2">
//             <p className="text-sm font-medium text-slate-700">Select a Role</p>
//             <div className="grid grid-cols-2 gap-4">
//               <div 
//                 className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all select-none ${
//                   form.watch("role") === "Doctor" 
//                     ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm" 
//                     : "border-gray-200 hover:border-blue-300 text-gray-600"
//                 }`}
//                 onClick={() => form.setValue("role", "Doctor", { shouldValidate: true })}
//               >
//                 <RiStethoscopeLine className="w-8 h-8 mb-2" />
//                 <span className="font-semibold text-sm">Doctor</span>
//               </div>

//               <div 
//                 className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all select-none ${
//                   form.watch("role") === "Registered" 
//                     ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm" 
//                     : "border-gray-200 hover:border-blue-300 text-gray-600"
//                 }`}
//                 onClick={() => form.setValue("role", "Registered", { shouldValidate: true })}
//               >
//                 <RiUserLine className="w-8 h-8 mb-2" />
//                 <span className="font-semibold text-sm">Patient</span>
//               </div>
//             </div>
//             {form.formState.errors.role && (
//               <p className="text-sm text-red-500">{form.formState.errors.role.message?.toString()}</p>
//             )}
//           </div>
          
//           <Button type="submit" className="w-full mt-4" disabled={registerMutation.isPending}>
//             {registerMutation.isPending ? "Creating Account..." : "Register"}
//           </Button>

//           {registerMutation.isError && (
//             <p className="text-sm font-medium text-red-500 text-center mt-2">
//               Registration failed. Please check your details and try again.
//             </p>
//           )}
//         </form>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowLeft } from "lucide-react"; // Imported ArrowLeft
import { RiStethoscopeLine, RiUserLine } from "@remixicon/react";
import Link from "next/link"; // Imported Link for home redirection

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
      confirmPassword: "", 
      role: "Registered", // Default internally mapped to "Registered" (Patient)
    },
  });

  const onSubmit = (values: any) => {
    const { confirmPassword, ...payload } = values;
    registerMutation.mutate(payload);
  };

  return (
    // Added 'relative' class to properly anchor the absolutely positioned back arrow
    <Card className="relative w-full max-w-md shadow-xl">
      
      {/* --- BACK TO HOME ARROW --- */}
      <Link
        href="/"
        className="absolute left-4 top-4 p-2 hover:bg-muted text-muted-foreground hover:text-foreground active:scale-95 rounded-xl transition-all border border-border shadow-sm bg-background flex items-center justify-center group"
        aria-label="Back to home"
      >
        <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform stroke-[2.5]" />
      </Link>

      <CardHeader className="text-center pt-8"> {/* Added pt-8 to balance structural layout with arrow */}
        <CardTitle className="text-3xl font-bold tracking-tight">Create Account</CardTitle>
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

          {/* Confirm Password Field */}
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

          {/* Role Selection Cards */}
          <div className="space-y-2 pt-2">
            <p className="text-sm font-medium text-slate-700">Select a Role</p>
            <div className="grid grid-cols-2 gap-4">
              <div 
                className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all select-none ${
                  form.watch("role") === "Doctor" 
                    ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm" 
                    : "border-gray-200 hover:border-blue-300 text-gray-600"
                }`}
                onClick={() => form.setValue("role", "Doctor", { shouldValidate: true })}
              >
                <RiStethoscopeLine className="w-8 h-8 mb-2" />
                <span className="font-semibold text-sm">Doctor</span>
              </div>

              <div 
                className={`flex flex-col items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all select-none ${
                  form.watch("role") === "Registered" 
                    ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm" 
                    : "border-gray-200 hover:border-blue-300 text-gray-600"
                }`}
                onClick={() => form.setValue("role", "Registered", { shouldValidate: true })}
              >
                <RiUserLine className="w-8 h-8 mb-2" />
                <span className="font-semibold text-sm">Patient</span>
              </div>
            </div>
            {form.formState.errors.role && (
              <p className="text-sm text-red-500">{form.formState.errors.role.message?.toString()}</p>
            )}
          </div>
          
          <Button type="submit" className="w-full mt-4" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? "Creating Account..." : "Register"}
          </Button>

          {registerMutation.isError && (
            <p className="text-sm font-medium text-red-500 text-center mt-2">
              Registration failed. Please check your details and try again.
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}