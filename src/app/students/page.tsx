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
import { toast, Toaster } from 'react-hot-toast';

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
    <div className="min-h-screen bg-[#F9FAFB] transition-colors duration-700 ease-in-out">
      <Toaster position="top-right" />
      <div className=" mx-auto px-10 py-8">
        {/* Header */}
        <div className="mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#8F1A27] mb-2 pt-2">Discover Students</h1>
          {/* <p className="text-muted-foreground">Connect, collaborate, and grow with other talented students.</p> */}
        </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Connect, collaborate, and grow with other talented students.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
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
              className="flex items-center gap-2"
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <Card key={student.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 p-5 flex flex-col items-center text-center group overflow-hidden">
                {/* Enhanced Profile Picture */}
                <div className="relative mb-1 mt-3">
                  <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-[#8F1A27]/10 to-[#6D0432]/10 border-4 border-[#8F1A27]/20 shadow-lg group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                    {(student.profileImage || student.user?.profileImage) ? (
                      <Image
                        src={getFileUrl(student.profileImage || student.user?.profileImage || "")}
                        alt={`${student.firstName} ${student.lastName}`}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Hide the image and show fallback when it fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.parentElement?.querySelector('[data-fallback]') as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                        onLoad={(e) => {
                          // Hide fallback when image loads successfully
                          const target = e.target as HTMLImageElement;
                          const fallback = target.parentElement?.querySelector('[data-fallback]') as HTMLElement;
                          if (fallback) fallback.style.display = 'none';
                        }}
                      />
                    ) : null}
                    {/* Fallback initials - shown when no image or image fails to load */}
                    <div 
                      className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-[#8F1A27] bg-gradient-to-br from-[#8F1A27]/10 to-[#6D0432]/10"
                      data-fallback
                      style={{ display: (student.profileImage || student.user?.profileImage) ? 'none' : 'flex' }}
                    >
                      {getUserInitials(student.firstName, student.lastName)}
                    </div>
                  </div>
                  
                  {/* Status indicator - using year as availability indicator */}
                  {student.year && (
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-white shadow-sm ${
                      student.year === 'GRADUATE' ? 'bg-green-500' :
                      student.year === 'SENIOR' ? 'bg-blue-500' :
                      student.year === 'JUNIOR' ? 'bg-yellow-500' :
                      student.year === 'SOPHOMORE' ? 'bg-orange-500' :
                      'bg-gray-400'
                    }`}>
                      <div className={`w-2 h-2 rounded-full bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
                        student.year === 'GRADUATE' ? 'bg-green-500' :
                        student.year === 'SENIOR' ? 'bg-blue-500' :
                        student.year === 'JUNIOR' ? 'bg-yellow-500' :
                        student.year === 'SOPHOMORE' ? 'bg-orange-500' :
                        'bg-gray-400'
                      }`} />
                    </div>
                  )}
                </div>
                
                <div className="w-full">
                  <div className="font-bold text-xl text-gray-900 mb-2">{student.firstName} {student.lastName}</div>
                  
                  {student.year && (
                    <div className="mb-5">
                      <Badge className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 rounded-full px-3 py-1 text-xs font-semibold border border-orange-200">
                        {student.year.replace('_', ' ')}
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-4">
                    <GraduationCap className="h-4 w-4 text-[#8F1A27]" />
                    <span className="font-medium">{(student.major || 'Undeclared').replace('_', ' ')}</span>
                  </div>
                  
                  {/* Brief Bio */}
                  {student.about && (
                    <div className="mb-4 px-2">
                      <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 font-normal text-left">
                        {student.about.length > 120 ? `${student.about.substring(0, 120)}...` : student.about}
                      </p>
                    </div>
                  )}
                
                  {student.skills && student.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 justify-start mb-4 ">
                      {student.skills.slice(0, 5).map(skill => (
                        <Badge key={skill.id} className={`rounded-full px-2.5 py-1 text-xs font-medium border ${getProficiencyColor(skill.proficiency)}`}>{skill.name}</Badge>
                      ))}
                      {student.skills.length > 5 && (
                        <Badge className="bg-gray-100 text-gray-600 rounded-full px-2.5 py-1 text-xs font-medium border border-gray-200">+{student.skills.length - 5}</Badge>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Divider and Button Row */}
                <div className="w-full border-t border-gray-200 mt-auto pt-4">
                  <div className="flex justify-between w-full gap-3">
                    <Button variant="outline" size="sm" asChild className="rounded-lg px-6 py-2 text-xs font-medium border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors">
                      <Link href={`/students/${student.id}`}>View Profile</Link>
                    </Button>
                    <Button size="sm" className="rounded-lg px-10 py-2 text-xs font-medium bg-[#8F1A27] text-white hover:bg-[#6D0432] transition-colors shadow-sm" onClick={() => handleContact(student)}>
                      Contact
                    </Button>
                  </div>
                </div>
              </Card>
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
      </div>
    </div>
  );
}

