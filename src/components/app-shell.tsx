"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"
import Footer from "@/components/footer"

const AUTH_PATHS = ["/login", "/register"]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuth = AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Navbar />
      <main
        className={
          isAuth
            ? "flex flex-1 flex-col items-center justify-center bg-[color:var(--vt-mint-50)]/50 px-4 py-16 md:py-24"
            : "flex-1"
        }
      >
        {children}
      </main>
      <Footer />
    </div>
  )
}
