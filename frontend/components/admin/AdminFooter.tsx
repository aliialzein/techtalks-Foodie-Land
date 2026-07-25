/* eslint-disable @next/next/no-img-element */

// Shared footer for the admin panel.
export default function AdminFooter() {
  return (
    <footer className="border-t border-[#eef0f3] bg-white">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col items-center justify-between gap-2 px-6 py-5 text-[13px] text-[#8a8a8a] sm:flex-row sm:px-8 lg:px-12">
        <div className="flex items-center gap-3">
          <img src="/home/logo.png" alt="FoodSpot" className="h-6 w-auto" />
          <span>© 2026 FoodSpot — Admin Panel. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-5">
          <a href="#" className="hover:text-[#d97a3a]">Privacy Policy</a>
          <a href="#" className="hover:text-[#d97a3a]">Terms of Service</a>
          <a href="#" className="hover:text-[#d97a3a]">Help Center</a>
        </div>
      </div>
    </footer>
  );
}
