'use client'
/* eslint-disable @next/next/no-img-element */

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import SiteHeader from '@/components/site/SiteHeader'
import SiteFooter from '@/components/site/SiteFooter'

const CARDS = [
  {
    icon: '/home/contact-phone.png',
    title: 'Hot-line',
    desc: "Talk to our support team anytime, we're available 10-2.",
    value: '+961 1 982 581',
    action: 'Call Now',
    href: 'tel:+9611982581',
  },
  {
    icon: '/home/contact-whatsapp.png',
    title: 'WhatsApp',
    desc: 'Chat with us on WhatsApp for quick and fast answers.',
    value: '+961 1 982 581',
    action: 'Chat Now',
    href: 'https://wa.me/9611982581',
  },
  {
    icon: '/home/contact-email.png',
    title: 'Email',
    desc: "Send us an email and we'll reply as soon as possible.",
    value: 'support@FoodSpot.com.lb',
    action: 'Send Email',
    href: 'mailto:support@FoodSpot.com.lb',
  },
]

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [human, setHuman] = useState(false)
  const [sent, setSent] = useState(false)

  const inputClass =
    'h-11 w-full rounded-full border border-[#d0d5dd] bg-white px-4 text-[14px] text-[#242424] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline-none transition-colors placeholder:text-[#98a2b3] focus:border-[#d97a3a] focus:ring-[3px] focus:ring-[#d97a3a]/15'
  const labelClass = 'mb-1.5 block text-[15px] font-bold text-black'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fafafb] font-[family-name:var(--font-cambay)] text-[#242424]">
      <SiteHeader active="support" />

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-6 py-12 sm:px-8 lg:px-12">
        <h1 className="text-[40px] font-bold leading-tight text-black lg:text-[48px]">
          Contact Us
        </h1>
        <p className="mt-4 max-w-[900px] text-[18px] leading-relaxed text-black lg:text-[22px]">
          If you have any question or need information, feel free to reach us
          through our service center
        </p>

        {/* ---------- Contact form ---------- */}
        <form onSubmit={handleSubmit} className="mt-10 max-w-[900px]">
          {sent ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-[15px] text-green-700">
              Thanks{name ? `, ${name}` : ''}! We&apos;ve received your message
              and will get back to you soon.
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelClass}>Name</label>
                  <input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Phone number</label>
                  <div className="flex h-11 items-center rounded-full border border-[#d0d5dd] bg-white pl-4 pr-3 shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] focus-within:border-[#d97a3a]">
                    <span className="text-[14px] text-black">LB</span>
                    <ChevronDown className="h-4 w-4 text-black/40" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+961 3 123 456"
                      className="ml-2 h-full flex-1 bg-transparent text-[13px] text-[#242424] outline-none placeholder:text-[#667085]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className={labelClass}>Subject</label>
                  <select
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className={`${inputClass} appearance-none`}
                  >
                    <option value="">Select subject</option>
                    <option>General inquiry</option>
                    <option>Order issue</option>
                    <option>Feedback</option>
                    <option>Partnership</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="message" className={labelClass}>Message</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Message"
                  rows={4}
                  className="w-full rounded-2xl border border-[#d0d5dd] bg-white px-4 py-3 text-[14px] text-[#242424] shadow-[0px_1px_2px_0px_rgba(16,24,40,0.05)] outline-none transition-colors placeholder:text-[#98a2b3] focus:border-[#d97a3a] focus:ring-[3px] focus:ring-[#d97a3a]/15"
                />
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-4">
                <label className="flex cursor-pointer items-center gap-3 rounded-full border border-[#e0e0e0] bg-[#fafafa] px-4 py-3 text-[13px] text-[#555]">
                  <input
                    type="checkbox"
                    checked={human}
                    onChange={(e) => setHuman(e.target.checked)}
                    className="h-5 w-5 rounded accent-[#d97a3a]"
                  />
                  I am human
                </label>
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[#d97a3a] px-10 font-[family-name:var(--font-inter)] text-[15px] font-bold text-white shadow-[0_4px_16px_rgba(217,122,58,0.3)] transition-all hover:-translate-y-px hover:bg-[#cc6d2f]"
                >
                  Submit
                </button>
              </div>
            </>
          )}
        </form>

        {/* ---------- Other ways to reach us ---------- */}
        <div className="mt-24 text-center">
          <h2 className="text-[28px] font-bold text-black lg:text-[36px]">
            Other ways to reach us
          </h2>
          <p className="mt-2 text-[18px] text-black/70 lg:text-[22px]">
            Choose the option that works best for you, We&apos;re here to help!
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {CARDS.map((c) => (
            <div
              key={c.title}
              className="rounded-xl bg-white p-6 shadow-[0_6px_24px_rgba(17,17,17,0.05)] font-[family-name:var(--font-inter)]"
            >
              <div className="flex h-[70px] w-[70px] items-center justify-center rounded-full bg-[#f8ddc9]">
                <img src={c.icon} alt="" className="h-11 w-11 object-contain" />
              </div>
              <h3 className="mt-5 text-[20px] font-bold text-black">{c.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[#666]">
                {c.desc}
              </p>
              <p className="mt-3 text-center text-[20px] font-bold text-[#d97a3a]">
                {c.value}
              </p>
              <a
                href={c.href}
                className="mt-5 block rounded-full border border-[#d97a3a]/50 py-2.5 text-center text-[15px] font-bold text-[#d97a3a] transition-colors hover:bg-[#d97a3a] hover:text-white"
              >
                {c.action}
              </a>
            </div>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
