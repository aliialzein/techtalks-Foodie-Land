/* eslint-disable @next/next/no-img-element */

// Shared FoodSpot footer used across the marketing + auth pages.
export default function SiteFooter() {
  return (
    <footer id="support" className="border-t border-[#e6e6e6] bg-[#fafafb]">
      <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-6 py-14 sm:px-8 lg:grid-cols-2 lg:px-12">
        <div className="max-w-[520px]">
          <img src="/home/logo.png" alt="FoodSpot" className="h-10 w-auto" />
          <p className="mt-5 text-[18px] leading-[25px] text-[#3c3c43] lg:text-[19px]">
            FoodSpot is a modern food discovery platform that helps users
            explore restaurants, browse menus, and order their favorite meals
            quickly and easily — all in one place.
          </p>
          <img
            src="/home/social.svg"
            alt="Social links"
            className="mt-6 h-6 w-auto"
          />
        </div>

        <div className="grid grid-cols-2 gap-8 font-[family-name:var(--font-jakarta)] sm:justify-items-end">
          <div>
            <h4 className="text-[16px] font-bold text-[#d97a3a]">Support</h4>
            <ul className="mt-3 space-y-3 text-[14px] text-[#191d23]">
              <li><a href="/contact" className="hover:text-[#d97a3a]">Contact Us</a></li>
              <li><a href="#" className="hover:text-[#d97a3a]">FAQ</a></li>
              <li><a href="#" className="hover:text-[#d97a3a]">Tutorials</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[16px] font-bold text-[#d97a3a]">Resources</h4>
            <ul className="mt-3 space-y-3 text-[14px] text-[#191d23]">
              <li><a href="#" className="hover:text-[#d97a3a]">A-Z Index</a></li>
              <li><a href="#" className="hover:text-[#d97a3a]">Privacy and Legal</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
