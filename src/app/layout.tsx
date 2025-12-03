import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "../components/navbar"
import Footer from "@/components/footer"
import { Toaster } from "sonner"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Student Talent Hub - Connect Students with Opportunities",
  description: "A platform connecting talented students with businesses for internships, jobs, and projects.",
  keywords: "student talent, internships, jobs, projects, business opportunities",
  authors: [{ name: 'Student Talent Hub Team' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Toaster richColors position="top-right" duration={3000} />
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}

