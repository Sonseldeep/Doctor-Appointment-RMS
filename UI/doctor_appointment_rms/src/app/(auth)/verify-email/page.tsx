"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { useVerifyEmail } from "@/features/auth/hooks/use-verify-email";
import { useResendOtp } from "@/features/auth/hooks/use-resend-otp";

export default function VerifyEmailPage() {
  const email = useSearchParams().get("email") || "";

  const [otp, setOtp] = useState("");

  const verifyEmail = useVerifyEmail();
  const resendOtp = useResendOtp();

  const handleVerify = () => {
    verifyEmail.mutate({ email, otp });
  };

  const handleResend = () => {
    resendOtp.mutate({ email });
  };

  const isOtpComplete = otp.length === 6;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle>Verify Your Email</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Enter the 6-digit code sent to <b>{email}</b>
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          
          {/* OTP INPUT */}
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={setOtp}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {/* VERIFY BUTTON */}
          <Button
            className="w-full"
            onClick={handleVerify}
            disabled={!isOtpComplete || verifyEmail.isPending}
          >
            {verifyEmail.isPending ? "Verifying..." : "Verify Email"}
          </Button>

          {/* RESEND OTP */}
          <Button
            variant="outline"
            className="w-full"
            onClick={handleResend}
            disabled={resendOtp.isPending}
          >
            {resendOtp.isPending ? "Resending..." : "Resend OTP"}
          </Button>

          {/* ERROR MESSAGE */}
          {verifyEmail.isError && (
            <p className="text-sm text-red-500 text-center">
              Invalid OTP. Please try again.
            </p>
          )}

          {/* SUCCESS MESSAGE */}
          {resendOtp.isSuccess && (
            <p className="text-sm text-green-600 text-center">
              OTP sent successfully
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}