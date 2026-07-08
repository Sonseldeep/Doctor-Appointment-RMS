// "use client";

// import { useState } from "react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// import { useResetPassword } from "@/features/auth/hooks/use-reset-password";

// export default function ResetPasswordPage() {
//   const resetPassword = useResetPassword();

//   const [form, setForm] = useState({
//     email: "",
//     otp: "",
//     newPassword: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = () => {
//     resetPassword.mutate(form);
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle>Reset Password</CardTitle>
//         </CardHeader>

//         <CardContent className="space-y-4">
//           <Input
//             name="email"
//             placeholder="Email"
//             onChange={handleChange}
//           />

//           <Input
//             name="otp"
//             placeholder="OTP"
//             onChange={handleChange}
//           />

//           <Input
//             type="password"
//             name="newPassword"
//             placeholder="New Password"
//             onChange={handleChange}
//           />

//           <Button
//             className="w-full"
//             onClick={handleSubmit}
//             disabled={resetPassword.isPending}
//           >
//             {resetPassword.isPending
//               ? "Resetting..."
//               : "Reset Password"}
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useResetPassword } from "@/features/auth/hooks/use-reset-password";

function ResetPasswordFormContent() {
  const resetPassword = useResetPassword();
  const searchParams = useSearchParams();
  
  // Extract the email parameter string from the URL structure
  const emailFromUrl = searchParams.get("email") || "";

  const [form, setForm] = useState({
    email: emailFromUrl,
    otp: "",
    newPassword: "",
  });

  // Keep the React form state properly synced when the URL loads
  useEffect(() => {
    if (emailFromUrl) {
      setForm((prev) => ({ ...prev, email: emailFromUrl }));
    }
  }, [emailFromUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    resetPassword.mutate(form);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            readOnly={!!emailFromUrl} // Prevents editing if data comes from URL
            className={emailFromUrl ? "bg-muted cursor-not-allowed text-muted-foreground" : ""}
          />

          <Input
            name="otp"
            placeholder="OTP"
            value={form.otp}
            onChange={handleChange}
          />

          <Input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
          />

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={resetPassword.isPending}
          >
            {resetPassword.isPending ? "Resetting..." : "Reset Password"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Next.js App Router demands useSearchParams hooks run within a Suspense boundary
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-muted/40 text-muted-foreground text-sm">Loading...</div>}>
      <ResetPasswordFormContent />
    </Suspense>
  );
}