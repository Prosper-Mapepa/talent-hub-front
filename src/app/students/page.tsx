"use client"

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchStudents } from '@/lib/slices/studentsSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Search, GraduationCap, MapPin, Star, Filter, X, Mail, Phone, Linkedin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import brandLogo from '@/assets/ss.png';
import { toast, Toaster } from 'react-hot-toast';
import { PageShell, PageHeader } from '@/components/page-shell';

export default function StudentsPage() {
  const dispatch = useAppDispatch();
  const { students, isLoading, error } = useAppSelector((state) => state.students);
  const { user } = useAppSelector((state) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Update the students listing to filter out the current user
  const filteredStudents = students.filter(student => 
    student.user?.id !== user?.id // Hide the current user's profile
  );

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedMajor('all');
    setSelectedYear('all');
    setSelectedAvailability('all');
  };

  const getYearColor = (year: string) => {
    switch (year) {
      case 'FRESHMAN': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'SOPHOMORE': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'JUNIOR': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'SENIOR': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'GRADUATE': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'AVAILABLE': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'PART_TIME': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'UNAVAILABLE': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getProficiencyColor = (proficiency: string) => {
    switch (proficiency) {
      case 'BEGINNER': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'ADVANCED': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'EXPERT': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getUserInitials = (firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    return 'S';
  };

  // Function to get file URL
  const getFileUrl = (filePath: string) => {
    if (!filePath) return '';
    if (filePath.startsWith('http')) return filePath;
    return `${process.env.NEXT_PUBLIC_API_URL || ''}${filePath}`;
  };

  const handleContact = (student: any) => {
    toast('Contact feature coming soon!', { icon: '✉️' });
  };

  return (
    <PageShell>
      <Toaster position="top-right" />
      <PageHeader
        badge="Directory"
        title="Discover Students"
        subtitle="Connect, collaborate, and grow with other talented students."
      />

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="vt-search-panel flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search students by name, major, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="vt-btn-outline flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            {(searchTerm || selectedMajor !== 'all' || selectedYear !== 'all' || selectedAvailability !== 'all') && (
              <Button variant="ghost" onClick={clearFilters} className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>

          {showFilters && (
            <div className="vt-section-card grid grid-cols-1 gap-4 p-5 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Major</label>
                <Select value={selectedMajor} onValueChange={setSelectedMajor}>
                  <SelectTrigger>
                    <SelectValue placeholder="All majors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Majors</SelectItem>
                    <SelectItem value="COMPUTER_SCIENCE">Computer Science</SelectItem>
                    <SelectItem value="BUSINESS_ADMINISTRATION">Business Administration</SelectItem>
                    <SelectItem value="ELECTRICAL_ENGINEERING">Electrical Engineering</SelectItem>
                    <SelectItem value="MECHANICAL_ENGINEERING">Mechanical Engineering</SelectItem>
                    <SelectItem value="MARKETING">Marketing</SelectItem>
                    <SelectItem value="FINANCE">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Year</label>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="All years" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    <SelectItem value="FRESHMAN">Freshman</SelectItem>
                    <SelectItem value="SOPHOMORE">Sophomore</SelectItem>
                    <SelectItem value="JUNIOR">Junior</SelectItem>
                    <SelectItem value="SENIOR">Senior</SelectItem>
                    <SelectItem value="GRADUATE">Graduate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Availability</label>
                <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
                  <SelectTrigger>
                    <SelectValue placeholder="All availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Availability</SelectItem>
                    <SelectItem value="AVAILABLE">Available</SelectItem>
                    <SelectItem value="PART_TIME">Part Time</SelectItem>
                    <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            {isLoading ? 'Loading students...' : `${filteredStudents.length} student${filteredStudents.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Students Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="vt-grid-cards">
            {filteredStudents.map((student) => (
              <article
                key={student.id}
                className="vt-section-card vt-card-hover flex h-full flex-col overflow-hidden"
              >
                <div className="flex items-start gap-3.5 p-4 sm:p-5">
                  <div className="vt-avatar-ring relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
                    {(student.profileImage || (student.user as { profileImage?: string })?.profileImage) ? (
                      <Image
                        src={getFileUrl(student.profileImage || (student.user as { profileImage?: string })?.profileImage || "")}
                        alt={`${student.firstName} ${student.lastName}`}
                        width={56}
                        height={56}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.parentElement?.querySelector('[data-fallback]') as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                        onLoad={(e) => {
                          const target = e.target as HTMLImageElement;
                          const fallback = target.parentElement?.querySelector('[data-fallback]') as HTMLElement;
                          if (fallback) fallback.style.display = 'none';
                        }}
                      />
                    ) : null}
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-[color:var(--vt-mint-50)]"
                      data-fallback
                      style={{ display: (student.profileImage || (student.user as { profileImage?: string })?.profileImage) ? 'none' : 'flex' }}
                    >
                      <Image
                        src={brandLogo}
                        alt="VeriTalent"
                        width={34}
                        height={34}
                        className="h-[58%] w-[58%] object-contain"
                      />
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-foreground">
                      {student.firstName} {student.lastName}
                    </h3>
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      {student.year && (
                        <span className="vt-year-badge">{student.year.replace('_', ' ')}</span>
                      )}
                    </div>
                    <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <GraduationCap className="h-3.5 w-3.5 shrink-0 text-[color:var(--vt-teal-600)]" />
                      <span className="truncate">{(student.major || 'Undeclared').replace(/_/g, ' ')}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-auto flex gap-2 border-t border-border/50 px-4 py-3 sm:px-5">
                  <Button variant="outline" size="sm" asChild className="flex-1 text-xs">
                    <Link href={`/students/${student.id}`}>View Profile</Link>
                  </Button>
                  <Button size="sm" className="vt-btn-primary flex-1 text-xs" onClick={() => handleContact(student)}>
                    Contact
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}

        {filteredStudents.length === 0 && !isLoading && (
          <Card>
            <CardContent className="p-12 text-center">
              <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No students found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try adjusting your search criteria or check back later for new profiles.
              </p>
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Load More Button */}
        {filteredStudents.length > 0 && (
          <div className="mt-8 text-center">
            <Button variant="outline" size="lg" disabled={isLoadMoreLoading} onClick={() => setIsLoadMoreLoading(true)}>
              {isLoadMoreLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2 inline" /> : null}
              Load More Students
            </Button>
          </div>
        )}
    </PageShell>
  );
}

