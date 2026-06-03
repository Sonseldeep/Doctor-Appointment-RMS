// "use client";

// import { Loader2 } from "lucide-react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";

// // import {
// //   Form,
// //   FormControl,
// //   FormField,
// //   FormItem,
// //   FormLabel,
// //   FormMessage,
// // } from "../../../components/ui/form";

// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// import {
//   loginSchema,
// } from "../schemas/auth.schema";

// import type {
//   LoginDto,
// } from "../types/auth.types";

// import { useLogin } from "../hooks/use-login";

// export function LoginForm() {
//   const loginMutation = useLogin();

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

//   return (
//     <div className="w-full max-w-md rounded-2xl border bg-background/95 p-8 shadow-xl backdrop-blur">
//       <div className="mb-8 space-y-2 text-center">
//         <h1 className="text-3xl font-bold tracking-tight">
//           Welcome Back
//         </h1>

//         <p className="text-sm text-muted-foreground">
//           Login to continue to your account
//         </p>
//       </div>

//       {loginMutation.isError && (
//         <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
//           Invalid credentials. Please try again.
//         </div>
//       )}

//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(onSubmit)}
//           className="space-y-5"
//         >
//           <FormField
//             control={form.control}
//             name="email"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Email</FormLabel>

//                 <FormControl>
//                   <Input
//                     placeholder="john@example.com"
//                     autoComplete="email"
//                     className="h-11"
//                     {...field}
//                   />
//                 </FormControl>

//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <FormField
//             control={form.control}
//             name="password"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Password</FormLabel>

//                 <FormControl>
//                   <Input
//                     type="password"
//                     placeholder="••••••••"
//                     autoComplete="current-password"
//                     className="h-11"
//                     {...field}
//                   />
//                 </FormControl>

//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           <Button
//             type="submit"
//             disabled={loginMutation.isPending}
//             className="h-11 w-full"
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
//         </form>
//       </Form>
//     </div>
//   );
// }

"use client";

import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { loginSchema } from "../schemas/auth.schema";
import type { LoginDto } from "../types/auth.types";
import { useLogin } from "../hooks/use-login";

export function LoginForm() {
  const loginMutation = useLogin();

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

  return (
    <Card className="w-full max-w-md shadow-xl border bg-background/95 backdrop-blur">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight">
          Welcome Back
        </CardTitle>

        <CardDescription>
          Login to continue to your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        {loginMutation.isError && (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            Invalid credentials. Please try again.
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>

            <Input
              placeholder="john@example.com"
              autoComplete="email"
              className="h-11"
              {...form.register("email")}
            />

            {form.formState.errors.email && (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>

            <Input
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              className="h-11"
              {...form.register("password")}
            />

            {form.formState.errors.password && (
              <p className="text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loginMutation.isPending}
            className="h-11 w-full"
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}