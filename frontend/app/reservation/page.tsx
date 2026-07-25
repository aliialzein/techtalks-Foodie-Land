"use client";
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import {
  Briefcase,
  Cake,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  Info,
  PartyPopper,
  Sofa,
  Star,
  Timer,
  Umbrella,
  Users,
} from "lucide-react";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";

const DAYS = [
  { dow: "Sun", d: 13 },
  { dow: "Mon", d: 14 },
  { dow: "Tue", d: 15 },
  { dow: "Wed", d: 16 },
  { dow: "Thu", d: 17, disabled: true },
  { dow: "Fri", d: 18 },
  { dow: "Sat", d: 19 },
];

const TIMES = [
  { label: "07:00 - 07:30" },
  { label: "10:00 - 10:45", disabled: true },
  { label: "11:00 - 12:30" },
  { label: "13:00 - 13:30" },
];

const SEATS = [
  { label: "2 Seats", note: "3 left", seats: 2 },
  { label: "4 Seats", note: "1 left", seats: 4 },
  { label: "6+ Seats", note: "Full", full: true },
  { label: "VIP Private", vip: true },
];

const OCCASIONS = [
  { label: "Birthday", Icon: Cake },
  { label: "Anniversary", Icon: Heart },
  { label: "Business", Icon: Briefcase },
  { label: "Other", Icon: PartyPopper },
];

const SEATING = [
  { label: "Indoor Dining", Icon: Sofa },
  { label: "Outdoor Terrace", Icon: Umbrella },
];

const cardClass = "rounded-2xl border border-[#f0dccb] bg-white p-6 shadow-[0_6px_24px_rgba(17,17,17,0.04)]";

export default function ReservationPage() {
  const [day, setDay] = useState(0);
  const [time, setTime] = useState(3);
  const [seat, setSeat] = useState<number | null>(null);
  const [occasion, setOccasion] = useState<number | null>(null);
  const [seating, setSeating] = useState(0);
  const [requests, setRequests] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const inputClass =
    "w-full rounded-lg border border-[#e0c3b2] bg-white px-3.5 py-2.5 text-[14px] text-[#242424] outline-none placeholder:text-[#98a2b3] focus:border-[#d97a3a] focus:ring-[3px] focus:ring-[#d97a3a]/15";

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafb] font-[family-name:var(--font-cambay)] text-[#242424]">
      <SiteHeader active="restaurants" />

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-6 py-8 sm:px-8 lg:px-12">
        <a href="/menu" className="text-[14px] font-medium text-[#d97a3a] hover:underline">
          ← Menu
        </a>

        {/* ---------- Restaurant header ---------- */}
        <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
          <div className={cardClass}>
            <p className="flex items-center gap-1.5 text-[18px] font-bold text-[#181818]">
              <Star className="h-5 w-5 fill-[#f5a623] text-[#f5a623]" /> 4.8
            </p>
            <h1 className="mt-3 text-[26px] font-bold leading-tight text-[#181818]">
              EM SHERIF RESTAURANT
            </h1>
            <div className="mt-4 space-y-2.5 border-t border-[#eef0f3] pt-4 text-[14px] text-[#5f5e5e]">
              <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-[#8a8a8a]" /> 12:00 PM - 11:30 PM</p>
              <p className="flex items-center gap-2"><Timer className="h-4 w-4 text-[#8a8a8a]" /> Avg. dining time: 1.5h</p>
              <p className="flex items-center gap-2"><Info className="h-4 w-4 text-[#8a8a8a]" /> Cancellation: 24h notice required</p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl">
            <img src="/home/cafe.jpg" alt="Restaurant interior" className="h-full min-h-[220px] w-full object-cover" />
            <div className="absolute inset-0 bg-black/30" />
            <h2 className="absolute bottom-6 left-6 max-w-[420px] text-[34px] font-bold leading-tight text-white lg:text-[40px]">
              Reserve your perfect dining experience.
            </h2>
          </div>
        </div>

        {/* ---------- Main grid ---------- */}
        <div className="mt-8 grid items-start gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Schedule */}
            <div className={cardClass}>
              <h3 className="text-[24px] font-bold text-[#1b3a57]">Schedule a Meeting</h3>
              <p className="mt-1 text-[15px] text-[#5f5e5e]">
                Choose a day and time slot that works best for your schedule. All
                times are shown in your local timezone.
              </p>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-[22px] font-bold text-[#1b3a57]">November</p>
                <div className="flex gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fbe7d8] text-[#d97a3a]">
                    <ChevronLeft className="h-4 w-4" />
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fbe7d8] text-[#d97a3a]">
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-7">
                {DAYS.map((dd, i) => {
                  const selected = day === i;
                  return (
                    <button
                      key={dd.dow}
                      type="button"
                      disabled={dd.disabled}
                      onClick={() => setDay(i)}
                      className={`flex flex-col items-center rounded-2xl py-3 transition-colors ${
                        selected
                          ? "bg-[#e8703a] text-white"
                          : dd.disabled
                            ? "bg-[#f4f3f2] text-[#c8c8c8]"
                            : "bg-[#f1f0ef] text-[#3c3c43] hover:bg-[#eadfd7]"
                      }`}
                    >
                      <span className="text-[13px]">{dd.dow}</span>
                      <span className="text-[22px] font-bold">{dd.d}</span>
                    </button>
                  );
                })}
              </div>

              <p className="mt-6 text-[20px] font-bold text-[#1b3a57]">Time</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {TIMES.map((t, i) => {
                  const selected = time === i;
                  return (
                    <button
                      key={t.label}
                      type="button"
                      disabled={t.disabled}
                      onClick={() => setTime(i)}
                      className={`rounded-lg px-4 py-2 text-[15px] font-medium transition-colors ${
                        selected
                          ? "border-2 border-[#d97a3a] bg-white text-[#d97a3a]"
                          : t.disabled
                            ? "bg-[#f4f3f2] text-[#c8c8c8]"
                            : "bg-[#f1f0ef] text-[#3c3c43] hover:bg-[#eadfd7]"
                      }`}
                    >
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live table availability */}
            <div className={cardClass}>
              <h3 className="text-[22px] font-bold text-[#181818]">Live Table Availability</h3>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {SEATS.map((s, i) => {
                  const selected = seat === i;
                  return (
                    <button
                      key={s.label}
                      type="button"
                      disabled={s.full}
                      onClick={() => setSeat(i)}
                      className={`flex flex-col items-center gap-2 rounded-xl px-3 py-4 text-center transition-colors ${
                        s.full
                          ? "bg-[#fbe7d8] text-[#d97a3a]"
                          : selected
                            ? "border-2 border-[#d97a3a] bg-white"
                            : "bg-[#f1f0ef] hover:bg-[#eadfd7]"
                      }`}
                    >
                      <span className="flex items-center gap-0.5 text-[#d97a3a]">
                        {s.vip ? (
                          <Star className="h-5 w-5 fill-[#d97a3a]" />
                        ) : s.full ? (
                          <Users className="h-5 w-5" />
                        ) : (
                          Array.from({ length: Math.min(s.seats ?? 0, 4) }).map((_, k) => (
                            <Sofa key={k} className="h-4 w-4" />
                          ))
                        )}
                      </span>
                      <span className="text-[13px] font-medium text-[#3c3c43]">
                        {s.label}
                        {s.note ? ` (${s.note})` : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Occasion + Seating */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className={cardClass}>
                <h3 className="text-[22px] font-bold text-[#181818]">Occasion</h3>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {OCCASIONS.map((o, i) => {
                    const selected = occasion === i;
                    const Icon = o.Icon;
                    return (
                      <button
                        key={o.label}
                        type="button"
                        onClick={() => setOccasion(i)}
                        className={`flex flex-col items-center gap-2 rounded-xl border py-4 transition-colors ${
                          selected
                            ? "border-[#d97a3a] bg-[#fbe7d8]"
                            : "border-[#e0c3b2] hover:bg-[#fbf6f2]"
                        }`}
                      >
                        <Icon className="h-5 w-5 text-[#d97a3a]" />
                        <span className="text-[14px] text-[#3c3c43]">{o.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className={cardClass}>
                <h3 className="text-[22px] font-bold text-[#181818]">Seating Type</h3>
                <div className="mt-4 space-y-3">
                  {SEATING.map((s, i) => {
                    const selected = seating === i;
                    const Icon = s.Icon;
                    return (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => setSeating(i)}
                        className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                          selected
                            ? "border-[#d97a3a] bg-[#fbe7d8]"
                            : "border-[#e0c3b2] hover:bg-[#fbf6f2]"
                        }`}
                      >
                        <Icon className="h-5 w-5 text-[#d97a3a]" />
                        <span className="flex-1 text-left text-[15px] text-[#3c3c43]">{s.label}</span>
                        {selected && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#d97a3a]">
                            <Check className="h-3 w-3 text-white" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ---------- Sidebar ---------- */}
          <div className="space-y-6">
            <div className={cardClass}>
              <h3 className="text-[22px] font-bold text-[#181818]">Reservation Summary</h3>
              <div className="mt-4 space-y-4 text-[14px]">
                <div className="flex items-start gap-2.5">
                  <Calendar className="mt-0.5 h-5 w-5 text-[#d97a3a]" />
                  <div>
                    <p className="font-semibold text-[#242424]">
                      {DAYS[day].dow}, November {DAYS[day].d}, 2024
                    </p>
                    <p className="text-[#8a8a8a]">{TIMES[time].label.split(" - ")[0]}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Users className="mt-0.5 h-5 w-5 text-[#d97a3a]" />
                  <div>
                    <p className="font-semibold text-[#242424]">2 Guests</p>
                    <p className="text-[#8a8a8a]">2 Adults • {SEATING[seating].label}</p>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2 border-t border-[#eef0f3] pt-4 text-[14px]">
                <div className="flex justify-between text-[#5f5e5e]">
                  <span>Reservation Fee</span><span className="font-semibold text-[#242424]">$0.00</span>
                </div>
                <div className="flex justify-between text-[#5f5e5e]">
                  <span>Minimum Spend</span><span className="font-semibold text-[#242424]">$150.00</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-[16px] font-bold text-[#242424]">Total Cost</span>
                  <span className="text-[16px] font-bold text-[#d97a3a]">$150.00</span>
                </div>
              </div>

              {confirmed ? (
                <div className="mt-5 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-[14px] font-medium text-green-700">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  Reservation confirmed for {DAYS[day].dow} Nov {DAYS[day].d}!
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmed(true)}
                  className="mt-5 w-full rounded-lg bg-[#d97a3a] py-3.5 font-[family-name:var(--font-inter)] text-[16px] font-bold text-white transition-colors hover:bg-[#cc6d2f]"
                >
                  Confirm Reservation
                </button>
              )}
              <p className="mt-3 text-center text-[12px] text-[#8a8a8a]">
                By clicking, you agree to our Terms of Service.
              </p>
            </div>

            <div className={cardClass}>
              <h3 className="text-[22px] font-bold text-[#181818]">Special Requests</h3>
              <div className="relative mt-4">
                <textarea
                  value={requests}
                  onChange={(e) => setRequests(e.target.value.slice(0, 250))}
                  maxLength={250}
                  rows={3}
                  placeholder="Allergies, preferred table, or surprise arrangements..."
                  className="w-full rounded-lg border border-[#e0c3b2] bg-white px-3.5 py-2.5 text-[14px] outline-none placeholder:text-[#98a2b3] focus:border-[#d97a3a] focus:ring-[3px] focus:ring-[#d97a3a]/15"
                />
                <span className="absolute bottom-2 right-3 text-[12px] text-[#b0b0b0]">
                  {requests.length} / 250
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-[#242424]">Full Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className={inputClass} />
                </div>
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-[#242424]">Phone Number</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+961 01 234 567" className={inputClass} />
                </div>
              </div>
              <div className="mt-4">
                <label className="mb-1.5 block text-[13px] font-medium text-[#242424]">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className={inputClass} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
