/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import { ArrowDownLeft, Receipt, ShoppingBag, ShoppingCart } from "lucide-react";
import PanelHeader from "@/components/owner/PanelHeader";
import ExportDashboardPdfButton from "@/components/owner/ExportDashboardPdfButton";

export const metadata: Metadata = {
  title: "Dashboard — FoodSpot Restaurant Panel",
  description: "Revenue, orders and sales analytics for your restaurant.",
};

const RANGE = ["Day", "Week", "Month", "Year"];

export default function OwnerDashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#fafafb] font-[family-name:var(--font-cambay)] text-[#242424]">
      <PanelHeader active="home" />

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-6 py-10 sm:px-8 lg:px-12">
        <h1 className="text-center text-[28px] font-bold text-[#1a1c1c] lg:text-[34px]">
          Welcome EM SHERIF !
        </h1>

        {/* ---------- Stat cards ---------- */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <StatCard
            icon={<Receipt className="h-5 w-5 text-[#d97a3a]" />}
            delta="+12.5%"
            label="Total Revenue"
            value="$1,284,530"
          />
          <StatCard
            icon={<ShoppingBag className="h-5 w-5 text-[#d97a3a]" />}
            delta="+8.2%"
            label="Total Orders"
            value="45,102"
          />
        </div>

        {/* ---------- Product highlights ---------- */}
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <ProductCard
            tag="Best Seller"
            tagClass="bg-[#d97a3a] text-white"
            img="/home/menu-plate.jpg"
            title="Signature Hummus Platter"
            desc="Traditional recipe with toasted pine nuts and house-pressed olive oil."
            orders="12,450"
          />
          <ProductCard
            tag="Low Volume"
            tagClass="bg-black/60 text-white"
            dark
            title="Saffron Rice Sphere"
            desc="A complex experimental dessert with gold leaf and pistachio infusion."
            orders="142"
            icon={<ArrowDownLeft className="h-4 w-4 text-[#d97a3a]" />}
          />
        </div>

        {/* ---------- Payment received (line) ---------- */}
        <div className="mt-6 rounded-xl bg-white p-6 shadow-[0_6px_24px_rgba(17,17,17,0.05)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[13px] text-[#8a8a8a]">Statistics</p>
              <h2 className="text-[20px] font-bold text-[#1a1c1c]">Payment received.</h2>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-[13px] text-[#5f5e5e]">
                <span className="h-2 w-2 rounded-full bg-[#d97a3a]" /> In Store
              </span>
              <div className="flex items-center rounded-full bg-[#f1efee] p-1 font-[family-name:var(--font-inter)] text-[13px]">
                {RANGE.map((r) => (
                  <span
                    key={r}
                    className={
                      r === "Month"
                        ? "rounded-full bg-[#1f2430] px-4 py-1.5 font-medium text-white"
                        : "px-4 py-1.5 text-[#636262]"
                    }
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <LineChart />
        </div>

        {/* ---------- Sales + Sales goal ---------- */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-[0_6px_24px_rgba(17,17,17,0.05)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[13px] text-[#8a8a8a]">Statistics</p>
                <h2 className="text-[20px] font-bold text-[#1a1c1c]">Sales</h2>
              </div>
              <div className="flex items-center gap-3 text-[12px] text-[#5f5e5e]">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#d97a3a]" /> In Store
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#f0c9ac]" /> Delivery
                </span>
              </div>
            </div>
            <BarChart />
          </div>

          <div className="rounded-xl bg-white p-6 shadow-[0_6px_24px_rgba(17,17,17,0.05)]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[13px] text-[#8a8a8a]">Statistics</p>
                <h2 className="text-[20px] font-bold text-[#1a1c1c]">Sales goal</h2>
              </div>
              <span className="rounded-lg border border-[#e2e2e2] px-3 py-1.5 text-[13px] text-[#636262]">
                Month ▾
              </span>
            </div>
            <p className="mt-4 text-[36px] font-bold text-[#1a1c1c]">75%</p>
            <AreaChart />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <ExportDashboardPdfButton />
        </div>
      </main>

      <footer className="border-t border-[#eef0f3] bg-white">
        <div className="mx-auto flex w-full max-w-[1200px] items-center justify-center gap-3 px-6 py-5 text-[13px] text-[#8a8a8a]">
          <img src="/home/logo.png" alt="FoodSpot" className="h-6 w-auto" />
          <span>© 2026 Food Spot — Restaurant Admin Panel. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

function StatCard({
  icon,
  delta,
  label,
  value,
}: {
  icon: React.ReactNode;
  delta: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[#f0dccb] bg-white p-6 shadow-[0_6px_24px_rgba(17,17,17,0.04)]">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#f8ddc9]">
          {icon}
        </div>
        <span className="rounded-md bg-[#fbe7d8] px-2 py-1 text-[12px] font-semibold text-[#d97a3a]">
          {delta}
        </span>
      </div>
      <p className="mt-4 text-[14px] text-[#8a8a8a]">{label}</p>
      <p className="mt-1 text-[28px] font-bold text-[#1a1c1c]">{value}</p>
    </div>
  );
}

function ProductCard({
  tag,
  tagClass,
  img,
  dark,
  title,
  desc,
  orders,
  icon,
}: {
  tag: string;
  tagClass: string;
  img?: string;
  dark?: boolean;
  title: string;
  desc: string;
  orders: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 overflow-hidden rounded-xl bg-white p-4 shadow-[0_6px_24px_rgba(17,17,17,0.05)]">
      <div className="relative h-[130px] w-[150px] shrink-0 overflow-hidden rounded-lg">
        {img ? (
          <img src={img} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#3a3a3a] to-[#1a1a1a]" />
        )}
        <span className={`absolute left-2 top-2 rounded-md px-2 py-0.5 text-[11px] font-semibold ${tagClass}`}>
          {tag}
        </span>
      </div>
      <div className="flex flex-col">
        <h3 className="text-[18px] font-bold leading-tight text-[#1a1c1c]">{title}</h3>
        <p className="mt-1 text-[13px] leading-5 text-[#666]">{desc}</p>
        <div className="mt-auto flex items-center gap-2 pt-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f8ddc9]">
            {icon ?? <ShoppingCart className="h-4 w-4 text-[#d97a3a]" />}
          </span>
          <span className="text-[16px] font-bold text-[#1a1c1c]">{orders}</span>
          <span className="text-[13px] text-[#8a8a8a]">Orders</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Charts (static SVG) ---------------- */

function LineChart() {
  const data = [0.2, 1.1, 1.4, 0.6, 2.7, 3.7, 2.7, 3.6, 2.0];
  const labels = ["1 Oct", "3 Oct", "7 Oct", "10 Oct", "14 Oct", "20 Oct", "23 Oct", "27 Oct", "30 Oct"];
  const W = 820, H = 250, L = 40, R = 20, T = 15, B = 35;
  const x = (i: number) => L + (i * (W - L - R)) / (data.length - 1);
  const y = (v: number) => T + (1 - v / 4) * (H - T - B);
  const pts = data.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const ti = 6; // tooltip point index

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full">
      {[0, 1, 2, 3, 4].map((g) => (
        <g key={g}>
          <line x1={L} x2={W - R} y1={y(g)} y2={y(g)} stroke="#f0f0f0" />
          <text x={L - 8} y={y(g) + 4} textAnchor="end" fontSize="11" fill="#9a9a9a">{g}k</text>
        </g>
      ))}
      <polyline points={pts} fill="none" stroke="#d97a3a" strokeWidth="2.5" strokeLinejoin="round" />
      {data.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r="4" fill="#fff" stroke="#d97a3a" strokeWidth="2.5" />
      ))}
      {labels.map((lb, i) => (
        <text key={lb} x={x(i)} y={H - 12} textAnchor="middle" fontSize="11" fill="#9a9a9a">{lb}</text>
      ))}
      {/* tooltip */}
      <g>
        <rect x={x(ti) - 30} y={y(data[ti]) - 40} width="60" height="26" rx="6" fill="#1f2430" />
        <text x={x(ti)} y={y(data[ti]) - 22} textAnchor="middle" fontSize="12" fill="#fff" fontWeight="600">$2,714</text>
      </g>
    </svg>
  );
}

function BarChart() {
  const data: [number, number][] = [
    [1.0, 0.9], [0.8, 0.5], [0.6, 0.4], [1.5, 0.9], [2.2, 0.8], [0.7, 0.5], [1.0, 0.6],
  ];
  const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const W = 400, H = 220, L = 28, R = 10, T = 10, B = 28, bw = 26;
  const y = (v: number) => T + (1 - v / 3) * (H - T - B);
  const x = (i: number) => L + i * ((W - L - R) / data.length) + ((W - L - R) / data.length - bw) / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full">
      {[0, 1, 2, 3].map((g) => (
        <g key={g}>
          <line x1={L} x2={W - R} y1={y(g)} y2={y(g)} stroke="#f0f0f0" strokeDasharray="3 3" />
          <text x={L - 6} y={y(g) + 4} textAnchor="end" fontSize="10" fill="#9a9a9a">{g}k</text>
        </g>
      ))}
      {data.map(([instore, delivery], i) => {
        const total = instore + delivery;
        return (
          <g key={i}>
            <rect x={x(i)} y={y(total)} width={bw} height={y(0) - y(total)} rx="4" fill="#f0c9ac" />
            <rect x={x(i)} y={y(instore)} width={bw} height={y(0) - y(instore)} rx="4" fill="#d97a3a" />
            <text x={x(i) + bw / 2} y={H - 10} textAnchor="middle" fontSize="10" fill="#9a9a9a">{days[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

function AreaChart() {
  const W = 400, H = 170, L = 24, R = 8, T = 10, B = 26;
  const outer = [0.1, 0.25, 0.55, 1.0];
  const inner = [0.05, 0.14, 0.32, 0.62];
  const labels = ["1 – 10 Aug", "11 – 20 Aug", "21 – 30 Aug", "1 – 10 Nov"];
  const x = (i: number) => L + (i * (W - L - R)) / (outer.length - 1);
  const y = (v: number) => T + (1 - v) * (H - T - B);
  const areaPath = (arr: number[]) =>
    `M ${x(0)} ${y(0)} ` + arr.map((v, i) => `L ${x(i)} ${y(v)}`).join(" ") + ` L ${x(arr.length - 1)} ${y(0)} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full">
      {[0, 0.5, 1].map((g) => (
        <g key={g}>
          <line x1={L} x2={W - R} y1={y(g)} y2={y(g)} stroke="#f0f0f0" />
          <text x={L - 6} y={y(g) + 3} textAnchor="end" fontSize="9" fill="#9a9a9a">{g * 100}</text>
        </g>
      ))}
      <path d={areaPath(outer)} fill="#f4c9a6" opacity="0.7" />
      <path d={areaPath(inner)} fill="#d97a3a" opacity="0.85" />
      {labels.map((lb, i) => (
        <text key={lb} x={x(i)} y={H - 8} textAnchor="middle" fontSize="9" fill={i === 2 ? "#1a1c1c" : "#9a9a9a"} fontWeight={i === 2 ? "700" : "400"}>
          {lb}
        </text>
      ))}
      <g>
        <rect x={x(2) - 32} y={y(inner[2]) - 34} width="64" height="24" rx="6" fill="#1f2430" />
        <text x={x(2)} y={y(inner[2]) - 18} textAnchor="middle" fontSize="11" fill="#fff" fontWeight="600">$23,849</text>
      </g>
    </svg>
  );
}
