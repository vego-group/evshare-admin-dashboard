"use client";

import { motion } from "framer-motion";
import LoginHeaderCompact from "./login-header-compact";
import OtpForm from "./otp-form";

interface OtpVerifyProps {
  mobile: string;
}

function OtpVerify({ mobile }: OtpVerifyProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0f1118] px-4 py-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[image:url('/images/scooter.jpg')] bg-size-[100%_100%] bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-[#0f1118]/72" />
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -right-20 top-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col items-center justify-center gap-5"
      >
        <LoginHeaderCompact />

        <motion.section
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.45, ease: "easeOut" }}
          className="w-full rounded-2xl border border-primary/30 bg-white p-4 shadow-[0_22px_45px_rgba(0,0,0,0.35)] md:p-5"
        >
          <div className="mb-1 text-center">
            <h2 className="text-base font-bold text-secondary">
              التحقق من الهوية
            </h2>
            <p className="mt-1 text-xs text-gray-400">
              أدخل رمز التحقق المرسل إلى جوالك
            </p>
          </div>

          <OtpForm mobile={mobile} />
        </motion.section>
      </motion.div>
    </main>
  );
}

export default OtpVerify;
