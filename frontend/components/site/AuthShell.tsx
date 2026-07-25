/* eslint-disable @next/next/no-img-element */
import type { ReactNode } from "react";
import SiteFooter from "./SiteFooter";

// Split auth layout from the Figma design: photo on the left, form on the
// right, shared footer below. Photo hides on small screens.
export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#fafafb] font-[family-name:var(--font-cambay)] text-[#242424]">
      <main className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col items-center gap-10 px-6 py-10 sm:px-8 lg:flex-row lg:gap-16 lg:px-12 lg:py-16">
        <div className="hidden w-full max-w-[560px] flex-1 lg:block">
          <img
            src="/home/cafe.jpg"
            alt="A cozy restaurant interior"
            className="aspect-square w-full rounded-2xl object-cover shadow-[0_10px_40px_rgba(17,17,17,0.08)]"
          />
        </div>
        <div className="w-full max-w-[440px] lg:flex-1">{children}</div>
      </main>
      <SiteFooter />
    </div>
  );
}
