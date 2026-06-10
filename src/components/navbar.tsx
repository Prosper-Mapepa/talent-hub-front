"use client"

import * as React from "react"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { logout } from '@/lib/slices/authSlice';
import { Button } from "@/components/ui/button"
import { useState, useEffect, useMemo } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Logo from "../assets/ss.png"
import { ModeToggle } from "@/components/mode-toggle"
import Image from "next/image"
import { User, LogOut, MessageSquare, Menu, X } from "lucide-react"
import { fetchConversations } from '@/lib/slices/messagesSlice';
import { cn } from "@/lib/utils"

type NavItem = { href: string; label: string; match: (path: string) => boolean }

export function Navbar() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { conversations, messages } = useAppSelector((state) => state.messages);
  const { student } = useAppSelector((state) => state.students);
  const router = useRouter()
  const pathname = usePathname();

  const [clientPathname, setClientPathname] = useState<string>('');
  const [dashboardLink, setDashboardLink] = useState('/dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  const hasUnreadMessages = useMemo(() => {
    if (!user?.id || !Array.isArray(conversations)) return false;

    return conversations.some(conversation => {
      const conversationMessages = messages[conversation.id] || [];
      return conversationMessages.some(message => message.senderId !== user.id);
    });
  }, [conversations, messages, user?.id]);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchConversations(user.id));
    }
  }, [user?.id, dispatch]);

  useEffect(() => {
    setClientPathname(pathname)
  }, [pathname])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  useEffect(() => {
    if (user?.role === 'student') {
      setDashboardLink('/dashboard');
    } else if (user?.role === 'business') {
      setDashboardLink('/business-dashboard');
    } else if (user?.role === 'admin') {
      setDashboardLink('/admin-dashboard');
    } else {
      setDashboardLink('/dashboard');
    }
  }, [user?.role])

  const handleLogout = async () => {
    setMobileOpen(false)
    await dispatch(logout());
    router.push('/login');
  };

  const getUserInitials = (firstName?: string, lastName?: string, email?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return 'U';
  };

  const displayFirstName = user?.firstName || student?.firstName || '';
  const displayLastName = user?.lastName || student?.lastName || '';

  const navItems = useMemo<NavItem[]>(() => {
    const items: NavItem[] = [
      { href: "/", label: "Home", match: (p) => p === "/" },
    ]
    if (user && clientPathname) {
      items.push({
        href: dashboardLink,
        label: "Dashboard",
        match: (p) => p === "/dashboard" || p === "/business-dashboard" || p === "/admin-dashboard",
      })
    }
    if (isAuthenticated) {
      items.push(
        { href: "/students", label: "Students", match: (p) => p === "/students" },
        { href: "/services", label: "Talents", match: (p) => p.startsWith("/services") },
        { href: "/jobs", label: "Campus Jobs", match: (p) => p === "/jobs" },
      )
    }
    items.push({
      href: "/how-it-works",
      label: "How It Works",
      match: (p) => p === "/how-it-works",
    })
    return items
  }, [user, clientPathname, dashboardLink, isAuthenticated])

  const linkClass = (active: boolean, mobile = false) =>
    cn(
      "transition-colors",
      mobile
        ? "block rounded-lg px-3 py-2.5 text-base font-medium"
        : "text-sm font-medium",
      active
        ? "font-semibold text-primary underline underline-offset-4"
        : mobile
          ? "text-foreground hover:bg-muted"
          : "text-muted-foreground hover:text-[color:var(--vt-gold-500)]"
    )

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map(({ href, label, match }) => (
        <Link
          key={href + label}
          href={href}
          className={linkClass(match(clientPathname), mobile)}
          onClick={() => mobile && setMobileOpen(false)}
        >
          {label}
        </Link>
      ))}
    </>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-white shadow-sm">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:h-[4.5rem] md:px-8">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src={Logo}
            alt="VeriTalent logo"
            width={160}
            height={115}
            className="h-12 w-auto rounded-b-2xl object-contain sm:h-14 md:h-16"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-5 lg:flex xl:gap-6">
          <NavLinks />
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <div className="hidden lg:block">
            <ModeToggle />
          </div>

          {isAuthenticated && user ? (
            <div className="hidden items-center gap-1 sm:flex">
              <Link
                href="/messages"
                className="relative rounded-md p-2 text-muted-foreground transition-colors hover:text-[color:var(--vt-gold-500)]"
              >
                <MessageSquare className="h-5 w-5" />
                {hasUnreadMessages && (
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" />
                )}
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/avatars/01.png" alt={user.email} />
                      <AvatarFallback>
                        {getUserInitials(displayFirstName, displayLastName, user.email)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push(`/students/${user?.studentId}`)}>
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/messages')}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>Messages</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="ghost" asChild size="sm" className="font-semibold text-foreground hover:text-[color:var(--vt-gold-500)]">
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="rounded-lg bg-primary font-semibold text-primary-foreground shadow-sm hover:bg-primary/90">
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0 lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 z-50 flex w-[min(100vw-3rem,20rem)] flex-col border-l bg-background shadow-xl lg:hidden">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <span className="text-sm font-semibold text-foreground">Menu</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
              <NavLinks mobile />
            </nav>

            <div className="space-y-3 border-t px-4 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Theme</span>
                <ModeToggle />
              </div>

              {isAuthenticated && user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>
                        {getUserInitials(displayFirstName, displayLastName, user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{displayFirstName} {displayLastName}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/messages" onClick={() => setMobileOpen(false)}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Messages
                      {hasUnreadMessages && (
                        <span className="ml-auto h-2 w-2 rounded-full bg-red-500" />
                      )}
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/login" onClick={() => setMobileOpen(false)}>Sign In</Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link href="/register" onClick={() => setMobileOpen(false)}>Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  )
}
