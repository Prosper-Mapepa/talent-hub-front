"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Briefcase, MessageSquare, Star, Users,CheckCircle, Award } from "lucide-react"
import { FadeIn } from "@/components/animations/fade-in"
import { BsStarFill } from "react-icons/bs";
import Banner from '../assets/banner.png'
import Brand from "../assets/landdd.webp"
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

function TotalSkillsCounter() {
const [totalSkills, setTotalSkills] = useState<number>(0);
  useEffect(() => {
    apiClient.get('/students')
      .then(res => {
        const students = res.data.data || [];
        const count = students.reduce(
          (sum: number, student: any) => sum + (student.skills?.length || 0),
          0
        );
        setTotalSkills(count);
      })
      .catch(() => setTotalSkills(0));
  }, []);
  return (
    <motion.span
      initial={{ scale: 0.8 }}
      animate={{ scale: [0.6, 0.8,0.8, 0.8] }}
      transition={{ repeat: Infinity, duration: 2, repeatType: 'reverse' }}
      className="  font-extrabold text-[#FFC540] ml-4"
    >
      {totalSkills.toLocaleString()}+ Talents
    </motion.span>

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
      <section className="gradient-bg py-20 text-white bg-gradient-to-br from-[#8F1A27] via-[#6A0032] to-[#8F1A27]">
        <div className=" px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
                   Discover Student <span className="gradient-text text-[#FEC72D]">Talent</span> at CMU
                </h1>
                <p className="max-w-[600px] text-white/80 md:text-xl py-5">
                
                  Unlock a world of Networking: connect, collaborate, and grow with the brightest student minds at CMU. Showcase your unique skills, build your portfolio, and expand your network with meaningful connections.
                </p>
              </div>
              {/* Animated Floating Avatars and Talent Counter */}
              <motion.div
                className="flex gap-2 mt-6 items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
              >
                {[profileImg, userImg, userWebp, logoImg].map((src, i) => (
                  <motion.div
                    key={i}
                    className="rounded-full border-2 border-white shadow-lg bg-white"
                    initial={{ y: 0 }}
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 + i * 0.2, delay: i * 0.2 }}
                  >
                    <Image src={src} alt={`Talent ${i + 1}`} width={48} height={48} />
                  </motion.div>
                ))}
                <span className="ml-4 text-lg font-bold text-[#FFC540] flex items-center">
                  <TotalSkillsCounter />
                </span>
              </motion.div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/services">
                  <Button size="lg" className="bg-[#6A0032] text-white border hover:bg-orange-500">
                    Explore Talents
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="lg" variant="outline" className="text-[#6A0032]">
                    Start Networking
                  </Button>
                </Link>
              </div>

              <FadeIn direction="up" delay={0.5} duration={0.7}>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="inline-block h-8 w-8 overflow-hidden rounded-full border-2 border-white ">
                        <BsStarFill size={20} className="text-[#FFC72C] "/>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center text-sm text-white">
                    <Star className="mr-1 h-4 w-4 fill-cmu-gold text-cmu-gold" />
                    <span className="font-medium text-[#FFC72C]">4.9</span>
                    <span className="ml-1">(1.2k+ reviews)</span>
                  </div>
                </div>
              </FadeIn>
            </div>
            <div className="flex items-center justify-center">
            <FadeIn direction="right" duration={0.8}>
              <div className="relative flex items-center justify-center">
                <div className="absolute -right-4 -top-4 h-24 w-24 rounded-lg bg-cmu-gold/30 blur-2xl" />
                <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-lg bg-cmu-maroon/30 blur-2xl" />
                <div className="relative overflow-hidden rounded-xl border bg-card shadow-xl">
                  <Image
                    alt="CMU Students collaborating"
                    className="aspect-video w-full object-cover object-center"
                    height="550"
                    src={Brand}
                    width="750"
                  />
                  {/* <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cmu-maroon via-cmu-light to-cmu-gold"
                  /> */}
                </div>

                <div className="absolute -bottom-5 -left-5 rounded-lg bg-white p-4 shadow-lg dark:bg-slate-900 sm:left-5">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" /> 
                    </div>
                    <span className="text-sm font-medium text-green-600">Verified Students</span>
                  </div>
                </div>

                <div className="absolute -right-5 -top-5 rounded-lg bg-white p-4 shadow-lg dark:bg-slate-900 sm:right-5">
                  <div className="flex items-center gap-2">
                    <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900">
                      <Award className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    </div>
                    <span className="text-sm font-medium text-amber-600">Top CMU Talent</span>
                  </div>
                </div>
              </div>
            </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-white to-[#FFF7ED] mt-5">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-[#8F1A27] mb-2">
            Why Join CMU Talent Hub?
          </h2>
          <div className="mx-auto h-1 w-24 bg-[#FFC540] rounded mb-8"></div>
          <p className="text-center text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
          Your network is your net worth, build meaningful connections that open doors to opportunities, mentorship, and lasting growth
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-8 transition-transform hover:-translate-y-2 hover:shadow-2xl group">
              <Users className="h-14 w-14 text-[#8F1A27] mb-4 group-hover:text-[#FFC540] transition-colors" />
              <h3 className="text-xl font-bold mb-2 text-center">Showcase Your Talent</h3>
              <p className="text-center text-gray-500">
                Build a stunning profile and portfolio to highlight your unique Talents and Achievements.
              </p>
            </div>
            <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-8 transition-transform hover:-translate-y-2 hover:shadow-2xl group">
              <Briefcase className="h-14 w-14 text-[#8F1A27] mb-4 group-hover:text-[#FFC540] transition-colors" />
              <h3 className="text-xl font-bold mb-2 text-center">Network &amp; Collaborate</h3>
              <p className="text-center text-gray-500">
                Connect with peers, join projects, and grow your network for future opportunities.
              </p>
            </div>
            <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-8 transition-transform hover:-translate-y-2 hover:shadow-2xl group">
              <MessageSquare className="h-14 w-14 text-[#8F1A27] mb-4 group-hover:text-[#FFC540] transition-colors" />
              <h3 className="text-xl font-bold mb-2 text-center">Get Discovered</h3>
              <p className="text-center text-gray-500">
                Be visible to other students, campus resources, and unlock academic and career opportunities.
              </p>
            </div>
            <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-8 transition-transform hover:-translate-y-2 hover:shadow-2xl group">
              <Star className="h-14 w-14 text-[#8F1A27] mb-4 group-hover:text-[#FFC540] transition-colors" />
              <h3 className="text-xl font-bold mb-2 text-center">Grow Your Network</h3>
              <p className="text-center text-gray-500">
                Gain experience, earn recognition, and unlock new opportunities for your future career.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Talents (formerly Featured Services) */}
      {user && talents.length > 0 && (
        <section className="bg-[#FFF7ED] py-12 dark:bg-slate-900 md:py-24">
          <div className="px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#6A0032]">Featured Talents</h2>
                <p className="max-w-[900px] text-slate-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-slate-400">
                  Discover top talents offered by CMU students.
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
                          <CardTitle className="text-lg font-bold text-[#6A0032] mb-2">{talent.title}</CardTitle>
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
                                className="text-xs px-2 py-1 h-6 bg-[#6A0032] text-white hover:bg-[#8F1A27] border-[#6A0032]"
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
                          <CardTitle className="text-lg font-bold text-[#6A0032] mb-2">{talent.title}</CardTitle>
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
                                className="text-xs px-2 py-1 h-6 bg-[#6A0032] text-white hover:bg-[#8F1A27] border-[#6A0032]"
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
      <section className="py-12 md:py-16 px-10">
      <div className="gradient-bg py-20 text-white bg-gradient-to-br from-[#8F1A27] via-[#6A0032] to-[#8F1A27] text-center rounded-xl">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl ">Ready to Get Started?</h2>
        <p className="mx-auto mb-8 max-w-2xl text-white/80">
          Join CMUTalentHub today to connect with talented students or offer your Talents to the community.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="bg-white text-[#6A0032] hover:bg-gray-100">
              Explore Talents
            </Button>
          </Link>
          <Link href="/services">
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-[#6A0032]/10">
              Start Networking
            </Button>
          </Link>
        </div>
      </div>
      </section>
    </div>
  )
}

