"use client"

import * as React from "react"
import Link from "next/link"
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { logout } from '@/lib/slices/authSlice';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
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
import { User, LogOut, Settings, Briefcase, GraduationCap, MessageSquare, Bell, Lightbulb, Sun } from "lucide-react"
import { fetchConversations } from '@/lib/slices/messagesSlice';

export function Navbar() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { conversations, messages } = useAppSelector((state) => state.messages);
  // Debug: print auth state
  if (typeof window !== 'undefined') {
    console.log('[Navbar] user:', user, 'isAuthenticated:', isAuthenticated);
  }
  const { student } = useAppSelector((state) => state.students);
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const pathname = usePathname();
  
  // Client-side only pathname to prevent hydration errors
  const [clientPathname, setClientPathname] = useState<string>('');
  const [dashboardLink, setDashboardLink] = useState('/dashboard');

  // Check for unread messages
  const hasUnreadMessages = useMemo(() => {
    if (!user?.id || !Array.isArray(conversations)) return false;
    
    return conversations.some(conversation => {
      const conversationMessages = messages[conversation.id] || [];
      // Check if there are messages from other participants
      const hasMessagesFromOthers = conversationMessages.some(message => 
        message.senderId !== user.id
      );
      return hasMessagesFromOthers;
    });
  }, [conversations, messages, user?.id]);

  // Fetch conversations when user is authenticated
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchConversations(user.id));
    }
  }, [user?.id, dispatch]);

  useEffect(() => {
    setClientPathname(pathname)
  }, [pathname])

  useEffect(() => {
    // Set dashboard link client-side only
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = async () => {
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

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90  backdrop-blur shadow ">
      <div className="flex h-16 items-center justify-between w-full px-4 md:px-8">
        <div className="flex items-center mr-6">
          <Link href="/" className="flex items-center space-x-2">
            <Image src={Logo} alt="Logo" width={45} height={45} className="rounded-full shadow-lg" />
            <span className="hidden md:inline-block font-extrabold text-2xl tracking-tight text-[#8F1A27]">CMU Talent<span className="text-[#FFC540]">Hub</span></span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex flex-wrap items-center gap-4 md:gap-6 text-sm font-medium">
            <Link href="/" className={clientPathname === '/' ? 'font-bold text-[#8F1A27] underline underline-offset-4' : 'transition-colors hover:text-[#8F1A27] text-gray-500'}>Home</Link>
            {user && clientPathname && (
              <Link href={dashboardLink} className={clientPathname === '/dashboard' || clientPathname === '/business-dashboard' ? 'font-bold text-[#8F1A27] underline underline-offset-4' : 'transition-colors hover:text-[#8F1A27] text-gray-500'}>Dashboard</Link>
            )}
            {isAuthenticated && (
              <>
                <Link href="/students" className={clientPathname === '/students' ? 'font-bold text-[#8F1A27] underline underline-offset-4' : 'transition-colors hover:text-[#8F1A27] text-gray-500'}>Students</Link>
                {user && (
                  <Link href="/services" className={clientPathname.startsWith('/services') ? 'font-bold text-[#8F1A27] underline underline-offset-4' : 'transition-colors hover:text-[#8F1A27] text-gray-500'}>Talents</Link>
                )}
                                <Link href="/jobs" className={clientPathname === '/jobs' ? 'font-bold text-[#8F1A27] underline underline-offset-4' : 'transition-colors hover:text-[#8F1A27] text-gray-500'}>Campus Jobs</Link>
              </>
            )}
            <Link href="/how-it-works" className={clientPathname === '/how-it-works' ? 'font-bold text-[#8F1A27] underline underline-offset-4' : 'transition-colors hover:text-[#8F1A27] text-gray-500'}>How It Works</Link>
            <Link href="/products" className={clientPathname === '/products' ? 'font-bold text-[#8F1A27] underline underline-offset-4' : 'transition-colors hover:text-[#8F1A27] text-gray-500'}>Products</Link>
            
          </nav>
          <div className="flex items-center space-x-2">
            <ModeToggle />
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-2">
                <Link href="/messages" className="relative p-2 text-gray-500 hover:text-[#8F1A27] transition-colors">
                  <MessageSquare className="h-5 w-5" />
                  {hasUnreadMessages && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                </Link>
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
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
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild className="text-[#8F1A27] font-bold">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild className="bg-[#8F1A27] text-white hover:bg-[#8F1A27]/90 rounded-lg shadow font-bold">
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}




