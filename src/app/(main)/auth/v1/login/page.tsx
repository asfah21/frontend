import type { Metadata } from "next";

import { Command } from "lucide-react";

import { VisionCoreLoginForm } from "../../_components/visioncore-login-form";

export const metadata: Metadata = {
  title: "Login — VisionCore",
  description: "Masuk ke sistem VisionCore dengan akun Anda.",
};

export default function LoginV1Page() {
  return (
    <div className="flex min-h-dvh w-full overflow-hidden bg-background selection:bg-primary/20 selection:text-primary-foreground">
      {/* Left side (Desktop only) */}
      <div className="relative hidden w-[42%] flex-col items-center justify-center bg-primary p-12 text-blue-50 lg:flex">
        {/* Background Subtle Gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-blue-700 to-blue-800 opacity-90 dark:from-blue-900 dark:to-slate-950" />

        <div className="relative z-10 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md shadow-xl border border-white/20">
            <Command className="h-9 w-9 text-white" />
          </div>
          <h1 className="mb-3 text-5xl font-semibold tracking-tight text-white line-tight">GAVIS</h1>
          <p className="text-lg text-blue-100/80 font-medium">GSI AI Vision for Intelligent Surveillance</p>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-12 left-12 h-32 w-32 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-24 right-12 h-48 w-48 rounded-full bg-blue-400/10 blur-3xl" />
      </div>

      {/* Right side (Form) */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 lg:p-12 relative">
        {" "}
        {/* role="main"> */}
        <div className="w-full max-w-[400px] animate-in fade-in lg:slide-in-from-right-4 duration-700">
          <div className="mb-10 text-center">
            <h2 className="text-xl font-bold text-foreground tracking-tight mb-3">Login</h2>
            <p className="text-[15px] leading-relaxed text-muted-foreground max-w-[320px] mx-auto">
              Welcome back, please enter your username or email and password to login
            </p>
          </div>

          <VisionCoreLoginForm />

          {/* <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground/80 font-medium">
              Don&apos;t have an account?{" "}
              <a href="#" className="font-bold text-primary hover:underline hover:underline-offset-4 transition-all">
                Register
              </a>
            </p>
          </div> */}
        </div>
        {/* <footer className="absolute bottom-8 text-center text-[10px] uppercase tracking-widest text-muted-foreground/40 lg:hidden">
           © {new Date().getFullYear()} VisionCore &mdash; Sistem Pemantauan Cerdas
        </footer> */}
      </main>
    </div>
  );
}
