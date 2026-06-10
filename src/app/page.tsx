"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Briefcase, MessageSquare, Star, Users, ShieldCheck, type LucideIcon } from "lucide-react"
import { FadeIn } from "@/components/animations/fade-in"
import Banner from '../assets/banner.png'
import { HeroTalentFlow } from '@/components/hero-talent-flow'
import { MobileAppShowcase } from '@/components/mobile-app-showcase'
import { motion } from "framer-motion"
import Image from "next/image"
import { useAppSelector } from '@/lib/hooks';
import apiClient from '@/lib/apiClient';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import profileImg from '../assets/profile.jpg';
import userImg from '../assets/user.jpg';
import userWebp from '../assets/user.webp';
import logoImg from '../assets/logo.png';

// Utility function to get file URL
const getFileUrl = (filePath: string) => {
  if (!filePath) return '';
  if (filePath.startsWith('http')) return filePath;
  
  // Clean the file path - remove any leading slashes or uploads/ prefix
  let cleanPath = filePath;
  if (cleanPath.startsWith('/')) cleanPath = cleanPath.substring(1);
  if (cleanPath.startsWith('uploads/')) cleanPath = cleanPath.substring(8);
  if (cleanPath.startsWith('talents/')) cleanPath = cleanPath.substring(8);
  
  // Check if NEXT_PUBLIC_API_URL is available
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const fullUrl = `${apiUrl}/uploads/talents/${cleanPath}`;
  console.log(`getFileUrl: ${filePath} -> ${fullUrl}`);
  return fullUrl;
};

function TotalTalentsCounter() {
  const [totalTalents, setTotalTalents] = useState<number>(0);
  useEffect(() => {
    apiClient
      .get('/students/talents/all')
      .then((res) => {
        const list = res.data?.data ?? res.data ?? [];
        setTotalTalents(Array.isArray(list) ? list.length : 0);
      })
      .catch(() => setTotalTalents(0));
  }, []);

  const displayCount = totalTalents > 0 ? totalTalents : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="vt-talent-stat inline-flex items-center gap-3 rounded-xl border bg-white/[0.08] px-3.5 py-2 backdrop-blur-sm"
    >
      <motion.span
        key={displayCount}
        initial={{ scale: 0.92, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        className="vt-gold-badge flex min-w-[3rem] items-center justify-center rounded-lg px-2.5 py-1.5 text-2xl font-black tabular-nums leading-none sm:min-w-[3.25rem] sm:text-3xl"
      >
        {displayCount.toLocaleString()}+
      </motion.span>
      <span className="flex flex-col leading-tight">
        <span className="text-sm font-semibold uppercase tracking-widest text-white sm:text-base">
          Talents
        </span>
        <span className="text-xs text-white/60">live on VeriTalent</span>
      </span>
    </motion.div>
  );
}

const WHY_FEATURES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Users,
    title: "Showcase your talent",
    description: "Build a strong profile and portfolio that makes you instantly discoverable.",
  },
  {
    icon: Briefcase,
    title: "Work with confidence",
    description: "Clear expectations, real profiles, and a smoother hiring experience.",
  },
  {
    icon: MessageSquare,
    title: "Fast communication",
    description: "Message securely and keep projects moving with less friction.",
  },
  {
    icon: Star,
    title: "Build reputation",
    description: "Reviews, verification, and repeat work—designed for long-term growth.",
  },
];

function WhyFeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="flex h-full flex-col gap-3 rounded-xl border border-border/30 bg-white p-6 md:p-7 lg:p-8">
      <div className="flex items-center gap-3">
        <Icon className="h-6 w-6 shrink-0 text-[color:var(--vt-teal-700)]" strokeWidth={1.75} />
        <h3 className="text-lg font-semibold text-foreground md:text-xl">{title}</h3>
      </div>
      <p className="text-base leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}

export default function Home() {
  const { user } = useAppSelector((state) => state.auth);
  // Debug: print auth state
  if (typeof window !== 'undefined') {
    console.log('[Home] user:', user, 'isAuthenticated:', !!user);
  }
  const [talents, setTalents] = useState<any[]>([]);
  const [mediaStates, setMediaStates] = useState<{[key: string]: {currentIndex: number, autoPlay: boolean}}>({});
  
  useEffect(() => {
    if (user) {
      apiClient.get('/students/talents/all').then(res => {
        const allTalents = Array.isArray(res.data.data) ? res.data.data : [];
        console.log('Raw API response:', res.data);
        console.log('All talents from API:', allTalents);
        
        // Exclude own talents and limit to 4 unique talents for slideshow
        const filteredTalents = allTalents.filter((t: any) => t.student && t.student.id !== user.studentId);
        console.log('After filtering own talents:', filteredTalents);
        
        // Remove duplicates based on talent ID and limit to 4
        const seenIds = new Set();
        const uniqueTalents = filteredTalents.filter((talent: any) => {
          if (seenIds.has(talent.id)) {
            return false;
          }
          seenIds.add(talent.id);
          return true;
        }).slice(0, 4);
        
        console.log('Final unique talents:', uniqueTalents);
        console.log('Talent IDs:', uniqueTalents.map((t: any) => t.id));
        
        setTalents(uniqueTalents);
      }).catch(error => {
        console.error('Error fetching talents:', error);
      });
    }
  }, [user]);

  // Auto-rotate media for talents with multiple files
  useEffect(() => {
    const intervals: {[key: string]: ReturnType<typeof setInterval>} = {};
    
    talents.forEach(talent => {
      if (talent.files && Array.isArray(talent.files) && talent.files.length > 1) {
        const talentId = talent.id;
        intervals[talentId] = setInterval(() => {
          setMediaStates(prev => {
            const current = prev[talentId] || { currentIndex: 0, autoPlay: true };
            const files = Array.isArray(talent.files) ? talent.files : [talent.files];
            const mediaFiles = files.filter((file: any) => 
              file.match(/\.(jpg|jpeg|png|gif|webp|mp4|webm|ogg|mov)$/i)
            );
            
            if (mediaFiles.length > 1) {
              return {
                ...prev,
                [talentId]: {
                  ...current,
                  currentIndex: (current.currentIndex + 1) % mediaFiles.length
                }
              };
            }
            return prev;
          });
        }, 3000); // Change every 3 seconds
      }
    });

    return () => {
      Object.values(intervals).forEach(interval => clearInterval(interval));
    };
  }, [talents]);

  const handleMediaNavigation = (talentId: string, direction: 'next' | 'prev') => {
    setMediaStates(prev => {
      const current = prev[talentId] || { currentIndex: 0, autoPlay: true };
      const talent = talents.find(t => t.id === talentId);
      if (!talent) return prev;
      
      const files = Array.isArray(talent.files) ? talent.files : [talent.files];
      const mediaFiles = files.filter((file: any) => 
        file.match(/\.(jpg|jpeg|png|gif|webp|mp4|webm|ogg|mov)$/i)
      );
      
      if (mediaFiles.length <= 1) return prev;
      
      let newIndex;
      if (direction === 'next') {
        newIndex = (current.currentIndex + 1) % mediaFiles.length;
      } else {
        newIndex = current.currentIndex === 0 ? mediaFiles.length - 1 : current.currentIndex - 1;
      }
      
      return {
        ...prev,
        [talentId]: {
          ...current,
          currentIndex: newIndex,
          autoPlay: false // Pause auto-play when manually navigating
        }
      };
    });
  };

  const toggleAutoPlay = (talentId: string) => {
    setMediaStates(prev => ({
      ...prev,
      [talentId]: {
        ...(prev[talentId] || { currentIndex: 0, autoPlay: true }),
        autoPlay: !(prev[talentId]?.autoPlay ?? true)
      }
    }));
  };
  return (
    <div className="flex flex-col ">
      {/* Hero Section */}
      <section className="vt-hero relative overflow-hidden text-white">
        <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[color:var(--vt-teal-600)]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[color:var(--vt-purple-600)]/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:py-14 md:px-6 lg:py-24">
          <div className="grid items-stretch gap-8 sm:gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
            <div className="flex flex-col justify-center space-y-8 py-2">
              {/* <FadeIn direction="up" duration={0.6}>
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur-sm">
                  <ShieldCheck className="h-4 w-4 text-[color:var(--vt-teal-600)]" />
                  Trusted student talent marketplace
                </span>
              </FadeIn> */}

              <div className="space-y-5">
                <h1 className="vt-hero-headline text-[1.75rem] font-extrabold leading-[1.1] tracking-tight min-[400px]:text-4xl sm:text-5xl xl:text-6xl">
                  <span className="vt-hero-headline-light">Discover </span>
                  <span className="vt-hero-gold">Verified Talent</span>
                  <span className="vt-hero-headline-light">  In Minutes</span>
                </h1>
                <p className="max-w-xl text-base text-white/80 sm:text-lg md:text-xl">
                  VeriTalent connects students and businesses through trusted profiles, clear pricing, and fast communication.
                  Find the right person for the job—without the noise.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {["Verified profiles", "Clear pricing", "Direct messaging"].map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 sm:text-sm"
                  >
                    {label}
                  </span>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link href="/services">
                  <Button size="lg" className="w-full bg-[color:var(--vt-teal-600)] text-white hover:bg-[color:var(--vt-teal-600)]/90 sm:w-auto">
                    Explore Talents
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full border-white/30 bg-transparent text-white hover:bg-white/10 sm:w-auto"
                  >
                    Start Networking
                  </Button>
                </Link>
              </div>

              <div className="flex flex-col gap-4 border-t border-white/15 pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
                <motion.div
                  className="flex flex-wrap items-center gap-4"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.7 }}
                >
                  {/* <div className="flex -space-x-2">
                    {[profileImg, userImg, userWebp, logoImg].map((src, i) => (
                      <motion.div
                        key={i}
                        className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-[color:var(--vt-teal-600)] bg-white shadow-md ring-2 ring-white/20"
                        initial={{ y: 0 }}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 2.2 + i * 0.15, delay: i * 0.15 }}
                      >
                        <Image src={src} alt={`Student ${i + 1}`} fill className="object-cover" sizes="40px" />
                      </motion.div>
                    ))}
                  </div> */}
                  <TotalTalentsCounter />
                </motion.div>

                <div className="flex flex-wrap items-center gap-2 text-sm text-white/90">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-4 w-4 fill-[color:var(--vt-teal-600)] text-[color:var(--vt-teal-600)]" />
                    ))}
                  </div>
                  <span className="font-semibold text-white">4.9</span>
                  <span className="text-white/70">(1.2k+ reviews)</span>
                </div>
              </div>
            </div>

            <FadeIn direction="right" duration={0.8} className="flex h-full min-h-[18rem] w-full sm:min-h-[24rem] md:min-h-[28rem] lg:min-h-0">
              <HeroTalentFlow />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-[color:var(--vt-mint-50)]/40 py-14 md:py-20">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="mb-10 md:mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl">
              Why VeriTalent?
            </h2>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Build meaningful connections that open doors to opportunities and lasting growth.
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-6">
            {WHY_FEATURES.map((feature) => (
              <WhyFeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      <MobileAppShowcase />

      {/* Featured Talents (formerly Featured Services) */}
      {user && talents.length > 0 && (
        <section className="bg-[color:var(--vt-mint-50)] py-12 dark:bg-slate-900 md:py-24">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-foreground">Featured Talents</h2>
                <p className="max-w-[900px] text-slate-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-slate-400">
                  Discover top talent across popular categories.
                </p>
              </div>
            </div>
            <div className="relative overflow-hidden mt-8">
              {/* Continuous scrolling container */}
              <motion.div 
                className="flex gap-6"
                animate={{ 
                  x: [0, -100, 0]
                }}
                transition={{ 
                  duration: 30,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                {/* First set of cards */}
                {talents.map((talent, index) => (
                  <motion.div
                    key={`first-${talent.id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    whileHover={{ 
                      scale: 1.05,
                      y: -5,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <Card className="flex flex-col justify-between h-full min-w-[300px] sm:min-w-[350px] cursor-pointer hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                      {/* Media Section */}
                      <div className="relative">
                        {talent.files && (Array.isArray(talent.files) ? talent.files.length > 0 : talent.files) ? (
                          <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                            {(() => {
                              const files = Array.isArray(talent.files) ? talent.files : [talent.files];
                              const mediaFiles = files.filter((file: any) => 
                                file.match(/\.(jpg|jpeg|png|gif|webp|mp4|webm|ogg|mov)$/i)
                              );
                              const images = files.filter((file: any) => file.match(/\.(jpg|jpeg|png|gif|webp)$/i));
                              const videos = files.filter((file: any) => file.match(/\.(mp4|webm|ogg|mov)$/i));
                              
                              if (mediaFiles.length === 0) {
                                return (
                                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                );
                              }
                              
                              const currentState = mediaStates[talent.id] || { currentIndex: 0, autoPlay: true };
                              const currentFile = mediaFiles[currentState.currentIndex];
                              const isVideo = currentFile.match(/\.(mp4|webm|ogg|mov)$/i);
                              
                              if (isVideo) {
                                const fileUrl = getFileUrl(currentFile);
                                return (
                                  <video
                                    src={fileUrl}
                                    controls
                                    preload="metadata"
                                    controlsList="nodownload"
                                    className="w-full h-full object-cover"
                                    crossOrigin="anonymous"
                                    muted
                                  >
                                    <source src={fileUrl} type="video/mp4" />
                                    <source src={fileUrl} type="video/webm" />
                                    <source src={fileUrl} type="video/ogg" />
                                    Your browser does not support the video tag.
                                  </video>
                                );
                              } else {
                                const fileUrl = getFileUrl(currentFile);
                                return (
                                  <Image
                                    src={fileUrl}
                                    alt={`${talent.title} preview`}
                                    width={400}
                                    height={300}
                                    className="w-full h-full object-cover"
                                  />
                                );
                              }
                            })()}
                            
                            {/* Navigation Controls */}
                            {(() => {
                              const files = Array.isArray(talent.files) ? talent.files : [talent.files];
                              const mediaFiles = files.filter((file: any) => 
                                file.match(/\.(jpg|jpeg|png|gif|webp|mp4|webm|ogg|mov)$/i)
                              );
                              
                              if (mediaFiles.length > 1) {
                                const currentState = mediaStates[talent.id] || { currentIndex: 0, autoPlay: true };
                                return (
                                  <>
                                    {/* Previous Button */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleMediaNavigation(talent.id, 'prev');
                                      }}
                                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
                                    >
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                                      </svg>
                                    </button>
                                    
                                    {/* Next Button */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleMediaNavigation(talent.id, 'next');
                                      }}
                                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
                                    >
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
                                      </svg>
                                    </button>
                                    
                                    {/* Auto-play Toggle */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleAutoPlay(talent.id);
                                      }}
                                      className="absolute top-2 left-2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full backdrop-blur-sm transition-all duration-200"
                                    >
                                      {currentState.autoPlay ? (
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                                        </svg>
                                      ) : (
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M8 5v14l11-7z"/>
                                        </svg>
                                      )}
                                    </button>
                                    
                                    {/* Slide Indicators */}
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                      {mediaFiles.map((_: any, index: number) => (
                                        <div
                                          key={index}
                                          className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                            index === currentState.currentIndex 
                                              ? 'bg-white' 
                                              : 'bg-white/50'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  </>
                                );
                              }
                              return null;
                            })()}
                            
                            {/* File count badge */}
                            <div className="absolute bottom-2 right-2 bg-white/90 text-gray-700 text-xs px-2 py-1 rounded-full shadow-sm">
                              {(Array.isArray(talent.files) ? talent.files : [talent.files]).length} files
                            </div>
                          </div>
                        ) : (
                          <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <div className="text-center">
                              <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-xs text-gray-500">No media</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Content Section */}
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="mb-3">
                          <CardTitle className="text-lg font-bold text-foreground mb-2">{talent.title}</CardTitle>
                    <Badge className="mb-2" variant="secondary">{talent.category}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">{talent.description}</p>
                    {talent.student && (
                          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback className="text-xs">{talent.student.firstName?.[0]}{talent.student.lastName?.[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-700 font-medium">{talent.student.firstName} {talent.student.lastName}</span>
                            </div>
                            <Link href={`/students/${talent.student.id}`}>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-xs px-2 py-1 h-6 bg-primary text-primary-foreground hover:bg-primary/90 border-primary"
                                onClick={(e) => e.stopPropagation()}
                              >
                                View Profile
                              </Button>
                            </Link>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
                
                {/* Duplicate set for seamless loop */}
                {talents.map((talent, index) => (
                  <motion.div
                    key={`second-${talent.id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    whileHover={{ 
                      scale: 1.05,
                      y: -5,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <Card className="flex flex-col justify-between h-full min-w-[300px] sm:min-w-[350px] cursor-pointer hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                      {/* Media Section */}
                      <div className="relative">
                        {talent.files && (Array.isArray(talent.files) ? talent.files.length > 0 : talent.files) ? (
                          <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                            {(() => {
                              const files = Array.isArray(talent.files) ? talent.files : [talent.files];
                              const mediaFiles = files.filter((file: any) => 
                                file.match(/\.(jpg|jpeg|png|gif|webp|mp4|webm|ogg|mov)$/i)
                              );
                              const images = files.filter((file: any) => file.match(/\.(jpg|jpeg|png|gif|webp)$/i));
                              const videos = files.filter((file: any) => file.match(/\.(mp4|webm|ogg|mov)$/i));
                              
                              if (mediaFiles.length === 0) {
                                return (
                                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                );
                              }
                              
                              const currentState = mediaStates[talent.id] || { currentIndex: 0, autoPlay: true };
                              const currentFile = mediaFiles[currentState.currentIndex];
                              const isVideo = currentFile.match(/\.(mp4|webm|ogg|mov)$/i);
                              
                              if (isVideo) {
                                const fileUrl = getFileUrl(currentFile);
                                return (
                                  <video
                                    src={fileUrl}
                                    controls
                                    preload="metadata"
                                    controlsList="nodownload"
                                    className="w-full h-full object-cover"
                                    crossOrigin="anonymous"
                                    muted
                                  >
                                    <source src={fileUrl} type="video/mp4" />
                                    <source src={fileUrl} type="video/webm" />
                                    <source src={fileUrl} type="video/ogg" />
                                    Your browser does not support the video tag.
                                  </video>
                                );
                              } else {
                                const fileUrl = getFileUrl(currentFile);
                                return (
                                  <Image
                                    src={fileUrl}
                                    alt={`${talent.title} preview`}
                                    width={400}
                                    height={300}
                                    className="w-full h-full object-cover"
                                  />
                                );
                              }
                            })()}
                            
                            {/* Navigation Controls */}
                            {(() => {
                              const files = Array.isArray(talent.files) ? talent.files : [talent.files];
                              const mediaFiles = files.filter((file: any) => 
                                file.match(/\.(jpg|jpeg|png|gif|webp|mp4|webm|ogg|mov)$/i)
                              );
                              
                              if (mediaFiles.length > 1) {
                                const currentState = mediaStates[talent.id] || { currentIndex: 0, autoPlay: true };
                                return (
                                  <>
                                    {/* Previous Button */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleMediaNavigation(talent.id, 'prev');
                                      }}
                                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
                                    >
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
                                      </svg>
                                    </button>
                                    
                                    {/* Next Button */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleMediaNavigation(talent.id, 'next');
                                      }}
                                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
                                    >
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
                                      </svg>
                                    </button>
                                    
                                    {/* Auto-play Toggle */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleAutoPlay(talent.id);
                                      }}
                                      className="absolute top-2 left-2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full backdrop-blur-sm transition-all duration-200"
                                    >
                                      {currentState.autoPlay ? (
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                                        </svg>
                                      ) : (
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M8 5v14l11-7z"/>
                                        </svg>
                                      )}
                                    </button>
                                    
                                    {/* Slide Indicators */}
                                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                      {mediaFiles.map((_: any, index: number) => (
                                        <div
                                          key={index}
                                          className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                            index === currentState.currentIndex 
                                              ? 'bg-white' 
                                              : 'bg-white/50'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  </>
                                );
                              }
                              return null;
                            })()}
                            
                            {/* File count badge */}
                            <div className="absolute bottom-2 right-2 bg-white/90 text-gray-700 text-xs px-2 py-1 rounded-full shadow-sm">
                              {(Array.isArray(talent.files) ? talent.files : [talent.files]).length} files
                            </div>
                          </div>
                        ) : (
                          <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <div className="text-center">
                              <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-xs text-gray-500">No media</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Content Section */}
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="mb-3">
                          <CardTitle className="text-lg font-bold text-foreground mb-2">{talent.title}</CardTitle>
                          <Badge className="mb-2" variant="secondary">{talent.category}</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-3">{talent.description}</p>
                        {talent.student && (
                          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback className="text-xs">{talent.student.firstName?.[0]}{talent.student.lastName?.[0]}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-gray-700 font-medium">{talent.student.firstName} {talent.student.lastName}</span>
                            </div>
                            <Link href={`/students/${talent.student.id}`}>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-xs px-2 py-1 h-6 bg-primary text-primary-foreground hover:bg-primary/90 border-primary"
                                onClick={(e) => e.stopPropagation()}
                              >
                                View Profile
                              </Button>
                            </Link>
                      </div>
                    )}
                      </div>
                </Card>
                  </motion.div>
              ))}
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="px-4 py-10 sm:px-6 sm:py-12 md:px-8 md:py-16">
      <div className="vt-hero rounded-xl px-4 py-12 text-center text-white sm:px-6 sm:py-16 md:py-20">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl ">Ready to Get Started?</h2>
        <p className="mx-auto mb-8 max-w-2xl text-white/80">
          Join VeriTalent today to connect with verified talent or offer your skills to the community.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
          <Link href="/register">
            <Button size="lg" className="w-full bg-white text-[color:var(--vt-teal-950)] hover:bg-white/90 sm:w-auto">
              Explore Talents
            </Button>
          </Link>
          <Link href="/services" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full border-white/30 bg-white/5 text-white hover:bg-white/10 sm:w-auto">
              Start Networking
            </Button>
          </Link>
        </div>
      </div>
      </section>
    </div>
  )
}

