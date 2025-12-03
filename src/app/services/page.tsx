"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Search, Filter } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import Service from '../../assets/landdd.webp'
import Image from "next/image"
import { useState, useEffect } from "react"
import { toast, Toaster } from "react-hot-toast"
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchServices } from '@/lib/slices/servicesSlice';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import apiClient from '@/lib/apiClient';
import { useRouter } from 'next/navigation';

// Talent titles for filtering - these are the actual talent titles from the data
const talentTitles = ["Music", "Research", "Design", "Writing", "Development", "Art", "Photography", "Video", "Media", "Marketing", "Consulting", "Tutoring"]

export default function ServicesPage() {
  const { user } = useAppSelector((state) => state.auth);

  const [talents, setTalents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [viewTalent, setViewTalent] = useState<any>(null);
  const [isViewTalentOpen, setIsViewTalentOpen] = useState(false);
  const [availableTitles, setAvailableTitles] = useState<string[]>(talentTitles);
  const [slideshowOpen, setSlideshowOpen] = useState(false);
  const [slideshowFiles, setSlideshowFiles] = useState<string[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const router = useRouter();

  // Function to get file URL
  const getFileUrl = (filePath: string) => {
    if (!filePath) return '';
    if (filePath.startsWith('http')) return filePath;
    return `${process.env.NEXT_PUBLIC_API_URL || ''}${filePath}`;
  };

  useEffect(() => {
    setIsLoading(true);
    // Try to fetch from API, but handle authentication issues gracefully
    apiClient.get('/students/talents/all')
      .then(res => {
        const data = res.data.data || res.data || [];
        setTalents(data);
        console.log('Loaded talents:', data);
        
        // Extract unique titles from the data
        const uniqueTitles = [...new Set(data.map((talent: any) => talent.title).filter(Boolean))] as string[];
        if (uniqueTitles.length > 0) {
          setAvailableTitles(uniqueTitles);
        }
      })
      .catch((error) => {
        console.error('Failed to load talents:', error);
        setError('Failed to load talents from server');
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Handle category checkbox
  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories(prev =>
      checked ? [...prev, category] : prev.filter(c => c !== category)
    );
  };

  // Handle slideshow
  const openSlideshow = (files: string[], startIndex: number = 0) => {
    setSlideshowFiles(files);
    setCurrentSlideIndex(startIndex);
    setSlideshowOpen(true);
  };

  const closeSlideshow = () => {
    setSlideshowOpen(false);
    setSlideshowFiles([]);
    setCurrentSlideIndex(0);
    setProgress(0);
    setIsTransitioning(false);
    setAutoPlay(true); // Reset auto-play to ON when closing
  };

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slideshowFiles.length);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slideshowFiles.length) % slideshowFiles.length);
  };

  // Auto-rotation effect with progress
  useEffect(() => {
    if (!slideshowOpen || !autoPlay || slideshowFiles.length <= 1) {
      setProgress(0);
      setIsTransitioning(false);
      return;
    }

    const duration = 3000; // 3 seconds
    const interval = 50; // Update progress every 50ms
    const steps = duration / interval;
    let currentStep = 0;

    const progressInterval = setInterval(() => {
      currentStep++;
      setProgress((currentStep / steps) * 100);
      
      if (currentStep >= steps) {
        setIsTransitioning(true);
        setCurrentSlideIndex((prev) => (prev + 1) % slideshowFiles.length);
        setProgress(0);
        currentStep = 0;
        // Reset transition flag after a short delay
        setTimeout(() => setIsTransitioning(false), 100);
      }
    }, interval);

    return () => {
      clearInterval(progressInterval);
      setProgress(0);
      setIsTransitioning(false);
    };
  }, [slideshowOpen, autoPlay, slideshowFiles.length, currentSlideIndex]);

  // Pause auto-play when user interacts with navigation
  const handleManualNavigation = (newIndex: number) => {
    setIsTransitioning(true);
    setProgress(0); // Reset progress
    
    // Show transition progress for manual navigation
    const transitionDuration = 500; // 0.5 seconds for manual transitions
    const interval = 25; // Update every 25ms for smoother animation
    const steps = transitionDuration / interval;
    let currentStep = 0;

    const transitionInterval = setInterval(() => {
      currentStep++;
      setProgress((currentStep / steps) * 100);
      
      if (currentStep >= steps) {
        setCurrentSlideIndex(newIndex);
        setProgress(0);
        setIsTransitioning(false);
        clearInterval(transitionInterval);
      }
    }, interval);

    // Temporarily pause auto-play for 5 seconds after manual navigation
    setAutoPlay(false);
    setTimeout(() => setAutoPlay(true), 5000);
  };

  // Filter talents based on search and title
  const filteredTalents = talents.filter(talent => {
    const matchesSearch =
      talent.title?.toLowerCase().includes(search.toLowerCase()) ||
      (talent.description && talent.description.toLowerCase().includes(search.toLowerCase()));
    const matchesTitle =
      selectedCategories.length === 0 || 
      (talent.title && selectedCategories.includes(talent.title));
    return matchesSearch && matchesTitle;
  });

  return (
    <div className="min-h-screen bg-[#F9FAFB] transition-colors duration-700 ease-in-out">
      <div className="px-4 py-6 md:px-8 md:py-8">
        <Toaster position="top-right" />
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="md:text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#8F1A27] mb-2">Explore Talents</h1>
            <p className="text-lg text-gray-600">Browse talents offered by CMU students</p>
          </div>
          <div className="flex w-full items-center gap-3 md:w-auto">
            <div className="relative flex-1 md:w-[400px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                type="search" 
                placeholder="Search talents..." 
                className="pl-10 pr-4 h-12 border-2 border-gray-200 focus:border-[#6A0032] focus:ring-[#6A0032]/20 transition-all duration-200 bg-white shadow-sm" 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
              />
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="hidden lg:block border border-gray-200 rounded-xl p-5 bg-white shadow-sm w-64 flex-shrink-0">
            <div className="space-y-5">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-[#6A0032]">Categories</h3>
                  {selectedCategories.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCategories([])}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  {availableTitles.map((title) => (
                    <div key={title} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <Checkbox 
                        id={`title-${title}`}
                        checked={selectedCategories.includes(title)}
                        onCheckedChange={checked => handleCategoryChange(title, !!checked)}
                        className="data-[state=checked]:bg-[#6A0032] data-[state=checked]:border-[#6A0032]"
                      />
                      <label
                        htmlFor={`title-${title}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                      >
                        {title}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
          {/* Mobile Filters */}
            <div className="lg:hidden mb-6">
              <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="filters">
                <AccordionTrigger>Filters</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-6">
                    <div>
                        <h3 className="mb-2 text-lg font-semibold">Talent Types</h3>
                      <div className="space-y-2">
                          {availableTitles.map((title) => (
                            <div key={title} className="flex items-center space-x-2">
                              <Checkbox id={`mobile-title-${title}`}
                                checked={selectedCategories.includes(title)}
                                onCheckedChange={checked => handleCategoryChange(title, !!checked)}
                            />
                            <label
                                htmlFor={`mobile-title-${title}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {title}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
            {/* Results count */}
            {!isLoading && (
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-semibold text-[#8F1A27]">{filteredTalents.length}</span> of <span className="font-semibold">{talents.length}</span> talents
                    {selectedCategories.length > 0 && (
                      <span className="ml-2 text-[#8F1A27]">
                        in {selectedCategories.join(', ')}
                      </span>
                    )}
                  </div>
                  {(search || selectedCategories.length > 0) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearch('');
                        setSelectedCategories([]);
                      }}
                      className="text-xs"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Talents Grid - 3 Cards Per Row */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {isLoading ? (
              <div className="col-span-full flex justify-center items-center py-24">
                <svg className="animate-spin h-8 w-8 text-[#6A0032]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
              </div>
            ) : error ? (
              <div className="col-span-full flex flex-col items-center py-24">
                <p className="text-red-500">{error}</p>
              </div>
            ) : filteredTalents.length === 0 ? (
              <div className="col-span-full flex flex-col items-center py-24">
                <p className="text-gray-500 mb-4">No talents found matching your criteria.</p>
                {(search || selectedCategories.length > 0) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearch('');
                      setSelectedCategories([]);
                    }}
                    className="text-sm"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              filteredTalents.map(talent => (
                <Card key={talent.id} className="group flex flex-col cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden bg-white border-0 shadow-md hover:shadow-2xl" onClick={() => { setViewTalent(talent); setIsViewTalentOpen(true); }}>
                  {/* Large Media Section */} <div className="flex justify-between px-6 ">
                      
                        <div className="">
                        <CardTitle className="text-xl font-bold text-[#6A0032]  group-hover:text-[#8F1A27] transition-colors">{talent.title}</CardTitle>
                        </div>
                        <div className="">
                        <Badge className=" bg-[#FFC540] hover:bg-[#8F1A27] font-medium " variant="secondary">{talent.category}</Badge>
                        </div>
                      
                    </div>
                  <div className="relative">
                    {talent.files && (Array.isArray(talent.files) ? talent.files.length > 0 : talent.files) ? (
                      <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                        {(() => {
                          const files = Array.isArray(talent.files) ? talent.files : [talent.files];
                          const images = files.filter((file: any) => file.match(/\.(jpg|jpeg|png|gif|webp)$/i));
                          const videos = files.filter((file: any) => file.match(/\.(mp4|webm|ogg|mov)$/i));
                          
                          // Show first video if available, otherwise show first image
                          if (videos.length > 0) {
                            const fileUrl = getFileUrl(videos[0]);
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
                          } else if (images.length > 0) {
                            const fileUrl = getFileUrl(images[0]);
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
                          return (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          );
                        })()}
                        
                        {/* Overlay with file count */}
                        {(Array.isArray(talent.files) ? talent.files : [talent.files])
                          .filter((file: any) => file.match(/\.(jpg|jpeg|png|gif|webp)$/i)).length > 1 && (
                          <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                            +{(Array.isArray(talent.files) ? talent.files : [talent.files])
                              .filter((file: any) => file.match(/\.(jpg|jpeg|png|gif|webp)$/i)).length - 1} more
                          </div>
                        )}
                        
                        {/* Play button for videos (only show if not already displaying a video) */}
                        {(() => {
                          const files = Array.isArray(talent.files) ? talent.files : [talent.files];
                          const videos = files.filter((file: any) => file.match(/\.(mp4|webm|ogg|mov)$/i));
                          const images = files.filter((file: any) => file.match(/\.(jpg|jpeg|png|gif|webp)$/i));
                          
                          // Only show play button if there are videos but we're showing an image
                          if (videos.length > 0 && images.length > 0) {
                            return (
                              <div className="absolute top-3 left-3 bg-black/70 text-white p-2 rounded-full backdrop-blur-sm">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z"/>
                                </svg>
                              </div>
                            );
                          }
                          return null;
                        })()}
                        
                        {/* Document indicator */}
                        {(Array.isArray(talent.files) ? talent.files : [talent.files])
                          .some((file: any) => file.match(/\.(pdf|doc|docx)$/i)) && (
                          <div className="absolute bottom-3 left-3 bg-blue-600 text-white p-2 rounded-full backdrop-blur-sm">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                            </svg>
                          </div>
                        )}
                        
                        {/* File count badge */}
                        <div className="absolute bottom-3 right-3 bg-white/90 text-gray-700 text-xs px-2 py-1 rounded-full shadow-sm">
                          {(Array.isArray(talent.files) ? talent.files : [talent.files]).length} files
                        </div>
                        
                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white/90 text-gray-800 px-4 py-2 rounded-full text-sm font-medium">
                              Click to view all files
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <div className="text-center">
                          <svg className="w-16 h-16 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-xs text-gray-500">No media</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Content Section */}
                  <div className="px-6 flex-1 flex flex-col">
                   
                    
                    {/* Truncated Description */}
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2 flex-1">
                      {talent.description?.length > 80 
                        ? `${talent.description.substring(0, 80)}...` 
                        : talent.description}
                    </p>
                    
                    {/* Student info at the bottom */}
                    {talent.student && (
                      <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800 mt-auto">
                        <Avatar className="h-8 w-8 ring-2 ring-[#6A0032]/20">
                          <AvatarFallback className="bg-[#6A0032] text-white text-sm font-semibold">{talent.student.firstName?.[0]}{talent.student.lastName?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <span className="text-sm text-gray-700 dark:text-gray-200 font-semibold">{talent.student.firstName} {talent.student.lastName}</span>
                          <p className="text-xs text-gray-500">CMU Student</p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button size="sm" variant="outline" className="text-xs">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))
            )}
            </div>
          </div>
        </div>

        {/* Talent Details Modal */}
        <Dialog open={isViewTalentOpen} onOpenChange={setIsViewTalentOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <CardTitle className="text-2xl font-bold text-[#6A0032] mb-2">{viewTalent?.title}</CardTitle>
              <DialogDescription className="mb-4 text-sm text-gray-700 dark:text-gray-200 line-clamp-3">
                {viewTalent?.description?.length > 200 
                  ? `${viewTalent.description.substring(0, 200)}...` 
                  : viewTalent?.description}
              </DialogDescription>
            </DialogHeader>
            {viewTalent && (
              <div className="flex flex-col gap-4 mt-4 overflow-y-auto flex-1">
                <div className="flex items-center justify-between">
                <Badge className="w-fit" variant="secondary">{viewTalent.category}</Badge>
                  {viewTalent.files && (() => {
                    let files: string[] = [];
                    if (viewTalent.files) {
                      if (Array.isArray(viewTalent.files)) {
                        files = viewTalent.files;
                      } else if (typeof viewTalent.files === 'string') {
                        files = [viewTalent.files];
                      } else if (typeof viewTalent.files === 'object' && viewTalent.files !== null) {
                        files = Object.values(viewTalent.files).filter((file: any) => typeof file === 'string');
                      }
                    }
                    const validFiles = files.filter((file: string) => file && file.trim() !== '');
                    
                    if (validFiles.length > 0) {
                      return (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[#6A0032] border-[#6A0032] hover:bg-[#6A0032] hover:text-white"
                          onClick={() => openSlideshow(validFiles, 0)}
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          View Slideshow
                        </Button>
                      );
                    }
                    return null;
                  })()}
                </div>
                
                {/* Files Section */}
                {viewTalent.files && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Attached Files</h3>
                    
                    {(() => {
                      // Handle different possible file storage formats
                      let files: string[] = [];
                      
                      if (viewTalent.files) {
                        if (Array.isArray(viewTalent.files)) {
                          files = viewTalent.files;
                        } else if (typeof viewTalent.files === 'string') {
                          files = [viewTalent.files];
                        } else if (typeof viewTalent.files === 'object' && viewTalent.files !== null) {
                          // Handle case where files might be stored as an object
                          files = Object.values(viewTalent.files).filter((file: any) => typeof file === 'string');
                        }
                      }
                      
                      const validFiles = files.filter((file: string) => file && file.trim() !== '');
                      
                      if (validFiles.length === 0) {
                        return (
                          <div className="text-center py-8 text-gray-500">
                            <svg className="w-12 h-12 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-sm">No files attached to this talent</p>
                          </div>
                        );
                      }
                      
                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                          {validFiles.map((file: string, fileIndex: number) => {
                            const fileUrl = getFileUrl(file);
                            const isImage = file.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                            const isVideo = file.match(/\.(mp4|webm|ogg|mov)$/i);
                            const isDocument = file.match(/\.(pdf|doc|docx)$/i);
                            
                            return (
                              <div key={fileIndex} className="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group" 
                                   onClick={() => openSlideshow(validFiles, fileIndex)}>
                                {isImage ? (
                                  <div className="space-y-2">
                                    <Image
                                      src={fileUrl}
                                      alt={`${viewTalent.title} file ${fileIndex + 1}`}
                                      width={200}
                                      height={150}
                                      className="w-full h-40 object-cover rounded-md group-hover:scale-105 transition-transform duration-200"
                                    />
                                  </div>
                                ) : isVideo ? (
                                  <div className="space-y-2 relative">
                                    <video
                                      src={fileUrl}
                                      controls
                                      preload="metadata"
                                      controlsList="nodownload"
                                      className="w-full h-40 object-cover rounded-md group-hover:scale-105 transition-transform duration-200"
                                      crossOrigin="anonymous"
                                      muted
                                    >
                                      <source src={fileUrl} type="video/mp4" />
                                      <source src={fileUrl} type="video/webm" />
                                      <source src={fileUrl} type="video/ogg" />
                                      Your browser does not support the video tag.
                                    </video>
                                  </div>
                                ) : (
                                  <div className="space-y-2 relative">
                                    <div className="w-full h-40 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-md flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                                      <div className="text-center">
                                        <svg className="w-8 h-8 mx-auto text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="text-xs text-blue-600 font-medium">
                                          {isDocument ? 'Document' : 'File'}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                <div className="flex justify-between items-center mt-2 border-t border-gray-200 pt-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openSlideshow(validFiles, fileIndex);
                                    }}
                                    className="text-xs text-[#8F1A27] hover:text-[#6D0432] font-medium"
                                  >
                                    View Slideshow
                                  </button>
                                  <span className="text-xs text-gray-500">
                                    {file.split('/').pop()?.split('.').pop()?.toUpperCase()}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                )}
                
                {/* Student info at the bottom */}
                {viewTalent.student && (
                  <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-gray-800 justify-between flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{viewTalent.student.firstName?.[0]}{viewTalent.student.lastName?.[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-base text-gray-700 dark:text-gray-200 font-semibold">{viewTalent.student.firstName} {viewTalent.student.lastName}</span>
                    </div>
                    <Button size="sm" className="ml-2" onClick={() => router.push(`/students/${viewTalent.student.id}`)}>View Profile</Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Slideshow Modal */}
        <Dialog open={slideshowOpen} onOpenChange={setSlideshowOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-bold text-[#6A0032]">
                  Media Slideshow
                </DialogTitle>
                <div className="flex items-center gap-2">
                  {/* Auto-play toggle */}
                  {slideshowFiles.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setAutoPlay(!autoPlay)}
                      className={`text-sm ${autoPlay ? 'text-[#6A0032]' : 'text-gray-500'}`}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {autoPlay ? 'Auto-play ON' : 'Auto-play OFF'}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeSlideshow}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>
              </div>
            </DialogHeader>
            
            <div className="flex-1 overflow-hidden relative">
              {slideshowFiles.length > 0 && (
                <div className="relative h-full">
                  {/* Main Media Display */}
                  <div className="relative h-full flex items-center justify-center bg-black">
                    {(() => {
                      const currentFile = slideshowFiles[currentSlideIndex];
                      const fileUrl = getFileUrl(currentFile);
                      const isImage = currentFile.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                      const isVideo = currentFile.match(/\.(mp4|webm|ogg|mov)$/i);
                      
                      if (isImage) {
                        return (
                          <Image
                            src={fileUrl}
                            alt={`Slide ${currentSlideIndex + 1}`}
                            width={800}
                            height={600}
                            className="max-w-full max-h-full object-contain"
                          />
                        );
                      } else if (isVideo) {
                        return (
                          <video
                            src={fileUrl}
                            controls
                            autoPlay
                            className="max-w-full max-h-full object-contain"
                            crossOrigin="anonymous"
                          >
                            <source src={fileUrl} type="video/mp4" />
                            <source src={fileUrl} type="video/webm" />
                            <source src={fileUrl} type="video/ogg" />
                            Your browser does not support the video tag.
                          </video>
                        );
                      } else {
                        return (
                          <div className="text-center text-white">
                            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-lg">Document Preview</p>
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#6A0032] hover:text-[#8F1A27] font-medium mt-2 inline-block"
                            >
                              Open Document
                            </a>
                          </div>
                        );
                      }
                    })()}
                  </div>

                  {/* Navigation Buttons */}
                  {slideshowFiles.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleManualNavigation((currentSlideIndex - 1 + slideshowFiles.length) % slideshowFiles.length)}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleManualNavigation((currentSlideIndex + 1) % slideshowFiles.length)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Button>
                    </>
                  )}

                  {/* Slide Counter */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {currentSlideIndex + 1} / {slideshowFiles.length}
                  </div>

                  {/* Progress Bar */}
                  {slideshowFiles.length > 1 && (autoPlay || isTransitioning) && (
                    <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-black/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white transition-all duration-25 ease-linear"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  )}

                  {/* Thumbnail Navigation */}
                  {slideshowFiles.length > 1 && (
                    <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {slideshowFiles.map((file, index) => {
                        const fileUrl = getFileUrl(file);
                        const isImage = file.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                        
                        return (
                          <button
                            key={index}
                            onClick={() => handleManualNavigation(index)}
                            className={`w-12 h-12 rounded-md overflow-hidden border-2 transition-all ${
                              index === currentSlideIndex 
                                ? 'border-white scale-110' 
                                : 'border-gray-400 hover:border-gray-300'
                            }`}
                          >
                            {isImage ? (
                              <Image
                                src={fileUrl}
                                alt={`Thumbnail ${index + 1}`}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

