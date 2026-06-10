"use client"

import { motion } from "framer-motion"
import { Smartphone, Star, MessageSquare, Briefcase } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const DEMOS = [
  {
    src: "/mobile/v1.mp4",
    label: "Get started",
    caption: "Welcome flow & onboarding",
  },
  {
    src: "/mobile/v2.mp4",
    label: "Your profile",
    caption: "Portfolio, stats & showcase",
  },
] as const

const HIGHLIGHTS = [
  {
    icon: Briefcase,
    title: "Jobs & gigs",
    description: "Browse campus opportunities in one feed",
  },
  {
    icon: MessageSquare,
    title: "Secure messaging",
    description: "Connect with students and businesses in-app",
  },
  {
    icon: Star,
    title: "Showcase talent",
    description: "Profiles, portfolios, skills & reviews",
  },
] as const

function PhoneFrame({
  src,
  label,
  caption,
  delay = 0,
}: {
  src: string
  label: string
  caption: string
  delay?: number
}) {
  return (
    <motion.figure
      className="flex w-full max-w-[280px] flex-col items-center sm:max-w-[300px] lg:w-[300px]"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      <div className="relative w-full rounded-[2.35rem] bg-[color:var(--vt-teal-950)] p-2 shadow-[0_28px_56px_-14px_color-mix(in_srgb,var(--vt-teal-950)_45%,transparent)] ring-1 ring-black/5 sm:rounded-[2.5rem] sm:p-2.5">
        <div className="relative overflow-hidden rounded-[1.9rem] bg-black sm:rounded-[2rem]">
          <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex justify-center pt-2.5">
            <div className="h-5 w-[72px] rounded-full bg-black/85 sm:h-[22px] sm:w-[80px]" />
          </div>

          <div className="aspect-[9/19.5] w-full min-w-[168px] max-w-[320px]">
            <video
              src={src}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      </div>

      <figcaption className="mt-4 text-center sm:mt-5">
        <p className="text-base font-semibold text-[color:var(--vt-teal-950)] sm:text-[17px]">{label}</p>
        <p className="mt-1 text-sm text-muted-foreground">{caption}</p>
      </figcaption>
    </motion.figure>
  )
}

export function MobileAppShowcase() {
  return (
    <section className="relative overflow-hidden border-t border-[color:var(--vt-teal-600)]/8 bg-white py-14 sm:py-20 md:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,color-mix(in_srgb,var(--vt-mint-50)_80%,transparent),transparent)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,440px)_1fr] lg:gap-14 xl:gap-20">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="flex flex-col justify-center lg:max-w-[440px] lg:py-6"
          >
            <span className="mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-[color:var(--vt-mint-50)] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[color:var(--vt-teal-700)] ring-1 ring-[color:var(--vt-teal-600)]/12">
              <Smartphone className="h-3.5 w-3.5" strokeWidth={2.25} />
              Mobile app
            </span>

            <header className="space-y-5">
              <h2 className="text-[2rem] font-bold leading-[1.12] tracking-tight text-[color:var(--vt-teal-950)] sm:text-[2.35rem] md:text-4xl lg:text-5xl">
                <span className="block">VeriTalent in</span>
                <span className="vt-gradient-text block">your pocket</span>
              </h2>
              {/* <p className="max-w-[34ch] text-[15px] leading-[1.7] text-muted-foreground sm:text-base">
                Discover talent, apply to campus jobs, and manage conversations — a
                mobile experience designed for students.
              </p> */}
            </header>

            <div
              aria-hidden
              className="my-8 h-px w-14 bg-gradient-to-r from-[color:var(--vt-teal-600)]/50 to-transparent"
            />

            <ul className="space-y-3">
              {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
                <li
                  key={title}
                  className="flex items-start gap-3.5 rounded-2xl border border-[color:var(--vt-teal-600)]/10 bg-gradient-to-br from-[color:var(--vt-mint-50)]/50 to-white px-4 py-3.5 shadow-[0_1px_2px_rgba(4,52,44,0.04)]"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[color:var(--vt-teal-700)] text-white shadow-sm">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.85} />
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="text-sm font-semibold leading-tight text-[color:var(--vt-teal-950)]">
                      {title}
                    </p>
                    <p className="mt-1 text-[13px] leading-snug text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-30 space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--vt-teal-700)]/70">
                Available on iOS & Android
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/register" className="sm:flex-1 sm:max-w-[200px]">
                  <Button size="lg" className="vt-btn-primary h-12 w-full rounded-xl text-sm font-semibold">
                    Get the app
                  </Button>
                </Link>
                <Link href="/how-it-works" className="sm:flex-1 sm:max-w-[200px]">
                  <Button
                    size="lg"
                    variant="outline"
                    className="vt-btn-outline h-12 w-full rounded-xl text-sm font-semibold"
                  >
                    See how it works
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Two demo phones */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative flex w-full justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[720px] rounded-[2rem] bg-gradient-to-b from-[color:var(--vt-mint-50)]/80 to-white px-4 py-6 ring-1 ring-[color:var(--vt-teal-600)]/10 sm:px-6 sm:py-8 lg:max-w-[780px] lg:px-8 lg:py-10">
              <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:justify-center sm:gap-6 md:gap-8 lg:gap-10">
                <PhoneFrame {...DEMOS[0]} delay={0.15} />
                <PhoneFrame {...DEMOS[1]} delay={0.25} />
              </div>

              {/* Subtle platform reflection */}
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-px left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-[color:var(--vt-teal-600)]/20 to-transparent"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
