"use client"

import { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchJobs, applyForJob } from '@/lib/slices/jobsSlice';
import { updateStudent, fetchStudentProfile } from '@/lib/slices/studentsSlice';
import { fetchConversations } from '@/lib/slices/messagesSlice';
import ProtectedRoute from '@/components/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Search, Briefcase, User, MessageSquare, Award, MapPin, Building, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { AddProjectForm, AddAchievementForm } from '@/components/portfolio-forms';
import EditableSkills from '@/components/EditableSkills';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { Project, Achievement } from '@/lib/slices/studentsSlice';
import { ProjectEditForm, AchievementEditForm } from '@/components/portfolio-forms';
import Image from "next/image";
import apiClient from '@/lib/apiClient';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { jobs, isLoading: jobsLoading, error: jobsError } = useAppSelector((state) => state.jobs);
  const { student, error: profileError } = useAppSelector((state) => state.students);
  const { conversations } = useAppSelector((state) => state.messages);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobType, setSelectedJobType] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('jobs');
  const [viewJob, setViewJob] = useState<{ id: string; title: string; description: string; type: string; experienceLevel?: string; location?: string; salary?: string; business?: { businessName: string; location?: string }; applications?: Array<{ student?: { id: string } }> } | null>(null);
  const [isViewJobOpen, setIsViewJobOpen] = useState(false);
  const [talents, setTalents] = useState<Array<{ id: string; title: string; category?: string; description?: string }>>([]);
  const [talentForm, setTalentForm] = useState({ title: '', category: '', description: '' });
  const [editingTalent, setEditingTalent] = useState<{ id: string; title: string; category?: string; description?: string } | null>(null);
  const [talentLoading, setTalentLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'applications') {
      dispatch(fetchJobs());
    }
  }, [activeTab, dispatch]);

  const [aboutForm, setAboutForm] = useState({
    major: student?.major || '',
    year: student?.year || '',
    about: (student as { about?: string })?.about || '',
  });
  useEffect(() => {
    if (student) {
      setAboutForm({
        major: student.major || '',
        year: student.year || '',
        about: (student as { about?: string }).about || '',
      });
    }
  }, [student]);
  const [savingAbout, setSavingAbout] = useState(false);
  const handleAboutChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAboutForm({ ...aboutForm, [e.target.name]: e.target.value });
  };
  const handleAboutSave = async () => {
    if (!student) return;
    setSavingAbout(true);
    await dispatch(updateStudent({ id: student.id, data: aboutForm }));
    setSavingAbout(false);
    toast.success('Profile updated!');
    dispatch(fetchStudentProfile(student.id));
  };

  useEffect(() => {
    dispatch(fetchJobs());
    if (user?.studentId) {
      dispatch(fetchStudentProfile(user.studentId));
    }
  }, [dispatch, user?.studentId]);

  useEffect(() => {
    if (jobsError) {
      toast.error(jobsError);
    }
  }, [jobsError]);

  useEffect(() => {
    if (profileError) {
      toast.error(profileError);
    }
  }, [profileError]);

  const handleApplyForJob = (jobId: string) => {
    if (user?.studentId) {
      setApplyingJobId(jobId);
      dispatch(applyForJob({ jobId, studentId: user.studentId }))
        .unwrap()
        .then(() => {
          toast.success('Application submitted!');
          dispatch(fetchJobs()); // Refresh jobs/applications after applying
        })
        .catch((err) => {
          toast.error(typeof err === 'string' ? err : 'Failed to apply for job');
        })
        .finally(() => setApplyingJobId(null));
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.business?.businessName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedJobType === 'all' || job.type === selectedJobType;
    const matchesExperience = selectedExperience === 'all' || job.experienceLevel === selectedExperience;
    
    return matchesSearch && matchesType && matchesExperience;
  });

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'FULL_TIME': return 'bg-green-100 text-green-800';
      case 'PART_TIME': return 'bg-blue-100 text-blue-800';
      case 'INTERNSHIP': return 'bg-purple-100 text-purple-800';
      case 'CONTRACT': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getExperienceColor = (level: string) => {
    switch (level) {
      case 'ENTRY_LEVEL': return 'bg-green-100 text-green-800';
      case 'INTERMEDIATE': return 'bg-yellow-100 text-yellow-800';
      case 'SENIOR': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState(false);

  // Helper: isOwner
  const isOwner = user && student && user.studentId === student.id;

  // Helper to get full file URL (copied from student profile page)
  const getFileUrl = (filePath: string) => {
    if (!filePath) return '';
    if (filePath.startsWith('http')) return filePath;
    return `${process.env.NEXT_PUBLIC_API_URL || ''}${filePath}`;
  };

  // Helper to check if a job has been applied by the current student
  const hasAppliedToJob = (job: { applications?: Array<{ student?: { id: string } }> }) => {
    if (!user?.studentId || !job.applications) return false;
    return job.applications.some((app: { student?: { id: string } }) => app.student?.id === user.studentId);
  };

  // Calculate unique conversations count
  const totalConversations = useMemo(() => {
    if (!user?.id || !Array.isArray(conversations)) return 0;
    
    const uniqueParticipantIds = new Set<string>();
    conversations.forEach(conversation => {
      const otherParticipant = conversation.participants?.find((p: { id: string }) => p.id !== user.id);
      if (otherParticipant) {
        uniqueParticipantIds.add(otherParticipant.id);
      }
    });
    
    return uniqueParticipantIds.size;
  }, [conversations, user?.id]);

  // Fetch conversations when component mounts
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchConversations(user.id));
    }
  }, [user?.id, dispatch]);

  // Real data for dashboard cards
  const availableJobs = jobs.length;
  // Count total applications for the current student
  const totalApplications = jobs
    .flatMap(job => (job.applications || []))
    .filter(app => app.student && app.student.id === user?.studentId)
    .length;
  const profileViews = student && typeof (student as unknown as { profileViews?: number }).profileViews === 'number' ? (student as unknown as { profileViews: number }).profileViews : 0;

  // Fetch talents for the logged-in student
  useEffect(() => {
    if (student?.id) {
      apiClient.get(`/students/${student.id}/talents`).then(res => setTalents(Array.isArray(res.data.data) ? res.data.data : [])).catch(() => setTalents([]));
    }
  }, [student?.id]);

  const handleTalentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTalentForm({ ...talentForm, [e.target.name]: e.target.value });
  };

  const handleAddTalent = async () => {
    if (!student?.id) return;
    setTalentLoading(true);
    try {
      await apiClient.post(`/students/${student.id}/talents`, talentForm);
      const res = await apiClient.get(`/students/${student.id}/talents`);
      setTalents(Array.isArray(res.data.data) ? res.data.data : []);
      setTalentForm({ title: '', category: '', description: '' });
      toast.success('Talent added!');
    } catch {
      toast.error('Failed to add talent');
    }
    setTalentLoading(false);
  };

  const handleEditTalent = (talent: { id: string; title: string; category?: string; description?: string }) => {
    setEditingTalent(talent);
    setTalentForm({ title: talent.title, category: talent.category || '', description: talent.description || '' });
  };

  const handleUpdateTalent = async () => {
    if (!student?.id || !editingTalent) return;
    setTalentLoading(true);
    try {
      await apiClient.put(`/students/${student.id}/talents/${editingTalent.id}`, talentForm);
      const res = await apiClient.get(`/students/${student.id}/talents`);
      setTalents(Array.isArray(res.data.data) ? res.data.data : []);
      setEditingTalent(null);
      setTalentForm({ title: '', category: '', description: '' });
      toast.success('Talent updated!');
    } catch {
      toast.error('Failed to update talent');
    }
    setTalentLoading(false);
  };

  const handleDeleteTalent = async (talentId: string) => {
    if (!student?.id) return;
    setTalentLoading(true);
    try {
      await apiClient.delete(`/students/${student.id}/talents/${talentId}`);
      setTalents(talents.filter(t => t.id !== talentId));
      toast.success('Talent deleted!');
    } catch {
      toast.error('Failed to delete talent');
    }
    setTalentLoading(false);
  };

  return (
    <ProtectedRoute allowedRoles={['student']}>
      {/* Header Section */}
      <section className="bg-[#F9FAFB] py-6 px-4 md:px-8 border-b border-gray-100">
        <div className="mx-auto max-w-8xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#8F1A27] leading-tight">
                 Welcome, {student?.firstName || user?.firstName || user?.email} 👋
              </h1>
              <p className="text-xl text-gray-600 font-medium">
                Your network is your net worth
              </p>
             
            </div>
            <Button className="bg-[#6D0432] text-white hover:bg-[#8F1A27] rounded-xl shadow-lg font-semibold px-8 py-3 text-base transition-all duration-200 hover:shadow-xl hover:scale-105">
              Download App
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <div className="mx-auto max-w-8xl px-4 md:px-8 py-8 bg-[#F9FAFB]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border-1 shadow rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-8">
              <div className="flex items-center">
                <div className="bg-[#8F1A27]/10 rounded-2xl p-4 mr-4">
                  <Briefcase className="h-7 w-7 text-[#8F1A27]" />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-600 mb-1">Campus Jobs</p>
                  <p className="text-3xl font-bold text-gray-800">{availableJobs}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-1 shadow rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-8">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-4 mr-4">
                  <User className="h-7 w-7 text-green-600" />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-600 mb-1">Profile Views</p>
                  <p className="text-3xl font-bold text-gray-800">{profileViews}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-1 shadow rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-8">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-4 mr-4">
                  <MessageSquare className="h-7 w-7 text-purple-600" />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-600 mb-1">Total Conversations</p>
                  <p className="text-3xl font-bold text-gray-800">{totalConversations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white border-1 shadow rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-8">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl p-4 mr-4">
                  <Award className="h-7 w-7 text-orange-600" />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-600 mb-1">Applications</p>
                  <p className="text-3xl font-bold text-gray-800">{totalApplications}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="min-h-screen bg-[#F9FAFB] transition-colors duration-700 ease-in-out">
        <div className="mx-auto max-w-8xl px-4 md:px-8 py-6">
          {/* Tabs Section */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8 ">
            <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm p-2 rounded-3xl shadow border border-gray-200/50 pb-9">
              <TabsTrigger value="jobs" className="text-sm font-medium text-gray-600 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8F1A27] data-[state=active]:to-[#6D0432] data-[state=active]:text-white data-[state=active]:shadow-md rounded-3xl py-2 px-4 data-[state=active]:font-semibold hover:bg-gray-100 -mt-1">Campus Jobs</TabsTrigger>
              <TabsTrigger value="skills" className="text-sm font-medium text-gray-600 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8F1A27] data-[state=active]:to-[#6D0432] data-[state=active]:text-white data-[state=active]:shadow-md rounded-3xl py-2 px-4 data-[state=active]:font-semibold hover:bg-gray-100 -mt-1">Skills</TabsTrigger>
              <TabsTrigger value="portfolio" className="text-sm font-medium text-gray-600 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8F1A27] data-[state=active]:to-[#6D0432] data-[state=active]:text-white data-[state=active]:shadow-md rounded-3xl py-2 px-4 data-[state=active]:font-semibold hover:bg-gray-100 -mt-1">Portfolio</TabsTrigger>
              <TabsTrigger value="applications" className="text-sm font-medium text-gray-600 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8F1A27] data-[state=active]:to-[#6D0432] data-[state=active]:text-white data-[state=active]:shadow-md rounded-3xl py-2 px-4 data-[state=active]:font-semibold hover:bg-gray-100 -mt-1">My Applications</TabsTrigger>
            </TabsList>

            <TabsContent value="jobs" className="space-y-8 ">
              {/* Search and Filters */}
              <Card className="border-0 shadow rounded-2xl bg-white/90 backdrop-blur-sm">
                <CardContent className="px-8">
                  <div className="space-y-6">
                    {/* Search Bar and Filter Toggle */}
                    <div className="flex items-center justify-between">
                      <div className="relative flex-1 max-w-lg">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                          placeholder="Search jobs..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-12 py-3 text-base rounded-xl border-gray-200 focus:border-[#8F1A27] focus:ring-[#8F1A27]"
                        />
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-3 ml-6 px-6 py-3 rounded-xl border-gray-200 hover:border-[#8F1A27] hover:bg-[#8F1A27]/5 transition-all duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
                        </svg>
                        Filters
                      </Button>
                    </div>
                    
                    {/* Filter Options */}
                    {showFilters && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-gray-200">
                        <Select value={selectedJobType} onValueChange={setSelectedJobType}>
                          <SelectTrigger className="w-full rounded-xl border-gray-200 focus:border-[#8F1A27] focus:ring-[#8F1A27]">
                            <SelectValue placeholder="Job Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="FULL_TIME">Full Time</SelectItem>
                            <SelectItem value="PART_TIME">Part Time</SelectItem>
                            <SelectItem value="INTERNSHIP">Internship</SelectItem>
                            <SelectItem value="CONTRACT">Contract</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                          <SelectTrigger className="w-full rounded-xl border-gray-200 focus:border-[#8F1A27] focus:ring-[#8F1A27]">
                            <SelectValue placeholder="Experience Level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Levels</SelectItem>
                            <SelectItem value="ENTRY_LEVEL">Entry Level</SelectItem>
                            <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                            <SelectItem value="SENIOR">Senior</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setSearchTerm('');
                            setSelectedJobType('all');
                            setSelectedExperience('all');
                          }}
                          className="w-full rounded-xl border-gray-200 hover:border-[#8F1A27] hover:bg-[#8F1A27]/5 transition-all duration-200"
                        >
                          Clear Filters
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Job Listings */}
              {jobsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : jobsError ? (
                <Alert variant="destructive">
                  <AlertDescription>{jobsError}</AlertDescription>
                </Alert>
              ) : filteredJobs.length === 0 ? (
                <div className="text-center text-gray-500 py-12">No jobs found.</div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {filteredJobs.map((job) => (
                    <Card key={job.id} className="hover:shadow-2xl transition-all duration-300 rounded-2xl border-0 bg-white/90 backdrop-blur-sm py-8 px-0 flex flex-col justify-between min-h-[280px] hover:-translate-y-1">
                      <CardHeader className="pb-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <CardTitle className="text-lg font-bold text-gray-900">{job.title}</CardTitle>
                            <CardDescription className="flex items-center text-gray-600 font-medium">
                              <Building className="h-5 w-5 mr-2 text-[#8F1A27]" />
                              {job.business?.businessName}
                            </CardDescription>
                          </div>
                          <div className="flex flex-col gap-2 items-end">
                            <Badge className={`${getJobTypeColor(job.type)} rounded-full px-3 py-1 font-semibold`}>{job.type.replace('_', ' ')}</Badge>
                            <Badge className={`${getExperienceColor(job.experienceLevel)} rounded-full px-3 py-1 font-semibold`}>{job.experienceLevel.replace('_', ' ')}</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-between">
                        <p className="text-base text-gray-600 leading-relaxed mb-6 line-clamp-3">{job.description}</p>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6 text-sm text-gray-600">
                              <span className="flex items-center font-medium">
                                <MapPin className="h-5 w-5 mr-2 text-[#8F1A27]" />
                                {job.business?.location || 'Remote'}
                              </span>
                              {job.salary && (
                                <span className="flex items-center font-semibold text-green-700">
                                  <span className="">${job.salary.replace(/[^.,-]/g, '')}</span>
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-3 justify-end">
                            {user?.role === 'student' && (
                              <Button
                                onClick={() => handleApplyForJob(job.id)}
                                disabled={applyingJobId === job.id || hasAppliedToJob(job)}
                                className={` py-3 rounded-xl shadow-lg transition-all duration-200 font-semibold px-6 ${
                                  hasAppliedToJob(job) 
                                    ? 'bg-green-600 text-white border-0 cursor-not-allowed px-8' 
                                    : 'bg-[#8F1A27] text-white hover:bg-[#6D0432] hover:shadow-xl'
                                }`}
                              >
                                {applyingJobId === job.id ? (
                                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Applying...</>
                                ) : hasAppliedToJob(job) ? (
                                  'Applied'
                                ) : (
                                  'Apply'
                                )}
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => { setViewJob(job); setIsViewJobOpen(true); }}
                              className="py-3 px-6 rounded-xl border-gray-200 hover:border-[#8F1A27] hover:bg-[#8F1A27]/5 text-gray-600 font-semibold transition-all duration-200"
                            >
                              View More
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              {/* View Job Modal */}
              <Dialog open={isViewJobOpen} onOpenChange={setIsViewJobOpen}>
                <DialogContent className="max-w-lg w-full">
                  <DialogHeader>
                    <DialogTitle>{viewJob?.title}</DialogTitle>
                    <DialogDescription>
                      <span className="text-gray-500">{viewJob?.business?.businessName}</span>
                    </DialogDescription>
                  </DialogHeader>
                  {viewJob && (
                    <div className="space-y-4">
                      <div>
                        <span className="block text-xs text-gray-400 mb-1">Description</span>
                        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">{viewJob.description}</p>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" />{viewJob.location || (viewJob.business as { location?: string })?.location || 'Remote'}</span>
                        {viewJob.salary && <span className="flex items-center text-green-700 dark:text-green-400"><span className="font-semibold ml-1">${viewJob.salary.replace(/[^.,-]/g, '')}</span></span>}
                        <Badge className={getJobTypeColor(viewJob.type)}>{viewJob.type.replace('_', ' ')}</Badge>
                        {viewJob.experienceLevel && <Badge className={getExperienceColor(viewJob.experienceLevel)}>{viewJob.experienceLevel.replace('_', ' ')}</Badge>}
                      </div>
                      {user?.role === 'student' && (
                        <Button 
                          className={`w-full ${
                            hasAppliedToJob(viewJob) 
                              ? 'bg-green-600 text-white cursor-not-allowed' 
                              : 'bg-primary text-white'
                          }`} 
                          onClick={() => handleApplyForJob(viewJob.id)} 
                          disabled={applyingJobId === viewJob.id || hasAppliedToJob(viewJob)}
                        >
                          {applyingJobId === viewJob.id ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Applying...</>
                          ) : hasAppliedToJob(viewJob) ? (
                            'Applied'
                          ) : (
                            'Apply'
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="about" className="space-y-6">
              <Card className="w-full">
                <CardContent className="py-8 px-6 md:px-12">
                  <div className="space-y-6 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                      <Input name="firstName" value={student?.firstName || ''} disabled className="bg-gray-100 w-full" />
                      <Input name="lastName" value={student?.lastName || ''} disabled className="bg-gray-100 w-full" />
                      <Input name="major" value={aboutForm.major} onChange={handleAboutChange} placeholder="Major" disabled={!isOwner} className="w-full" />
                      <Input name="year" value={aboutForm.year} onChange={handleAboutChange} placeholder="Year" disabled={!isOwner} className="w-full" />
                    </div>
                    <Textarea name="about" value={aboutForm.about} onChange={handleAboutChange} placeholder="About you" disabled={!isOwner} rows={4} className="w-full" />
                    {isOwner && (
                      <Button onClick={handleAboutSave} disabled={savingAbout} className="w-full md:w-auto">{savingAbout ? 'Saving...' : 'Save'}</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <Card className="w-full">
                <CardContent className="py-8 px-6 md:px-12">
                  <div className="w-full space-y-6">
                    <EditableSkills
                      studentId={student?.id || ''}
                      skills={student?.skills || []}
                      disabled={!isOwner}
                      onSkillAdded={() => student?.id && dispatch(fetchStudentProfile(student.id))}
                      onSkillUpdated={() => student?.id && dispatch(fetchStudentProfile(student.id))}
                    />
                    <div>
                      <h3 className="font-semibold mb-2 text-lg">Skills</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                        {(student?.skills || []).map(skill => (
                          <div key={skill.id} className="bg-white border rounded-lg p-3 flex flex-col items-start shadow-sm w-full">
                            <span className="font-medium text-base">{skill.name}</span>
                            <span className="text-xs text-gray-500 mt-1">{skill.proficiency}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-10">
              <Card className="w-full">
                <CardContent className="py-8 px-6 md:px-12">
                  <div className="space-y-10 w-full">
                    <div>
                      <h3 className="font-semibold mb-4 text-lg border-b pb-2">Projects</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                        {(student?.projects || []).map(project => (
                          <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer w-full">
                            <CardHeader className="flex flex-row justify-between items-center pb-2">
                              <CardTitle className="truncate max-w-xs">{project.title}</CardTitle>
                              {isOwner && (
                                <Button size="sm" variant="outline" onClick={() => { setSelectedProject(project); setShowProjectModal(true); }}>Edit</Button>
                              )}
                            </CardHeader>
                            <CardContent className="text-gray-700 line-clamp-3 pb-4">{project.description}</CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-4 text-lg border-b pb-2">Achievements</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                        {(student?.achievements || []).map(achievement => (
                          <Card key={achievement.id} className="hover:shadow-lg transition-shadow cursor-pointer w-full">
                            <CardHeader className="flex flex-row justify-between items-center pb-2">
                              <CardTitle className="truncate max-w-xs">{achievement.title}</CardTitle>
                              {isOwner && (
                                <Button size="sm" variant="outline" onClick={() => { setSelectedAchievement(achievement); setShowAchievementModal(true); }}>Edit</Button>
                              )}
                            </CardHeader>
                            <CardContent className="text-gray-700 line-clamp-3 pb-4">{achievement.description}</CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                    {isOwner && (
                      <div className="space-y-6 pt-8 border-t w-full">
                        <AddProjectForm studentId={student?.id || ''} onSuccess={() => student?.id && dispatch(fetchStudentProfile(student.id))} />
                        <AddAchievementForm studentId={student?.id || ''} onSuccess={() => student?.id && dispatch(fetchStudentProfile(student.id))} />
                      </div>
                    )}
                    {/* Project Edit Modal with file display */}
                    <Dialog open={showProjectModal} onOpenChange={setShowProjectModal}>
                      <DialogContent className="max-w-6xl w-full">
                        <DialogHeader>
                          <DialogTitle>Edit Project</DialogTitle>
                        </DialogHeader>
                        {selectedProject && (
                          <>
                            <ProjectEditForm
                              project={selectedProject}
                              studentId={student?.id || ''}
                              onSuccess={() => { setShowProjectModal(false); if (student?.id) { dispatch(fetchStudentProfile(student.id)); } }}
                            />
                            {/* Display images and files as in student profile page */}
                            {selectedProject.images && Array.isArray(selectedProject.images) && selectedProject.images.length > 0 && (
                              <>
                                {/* Images Grid */}
                                {selectedProject.images.some(img => img.match(/\.(jpg|jpeg|png|webp|gif)$/i)) && (
                                  <div className="w-full">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                                      {selectedProject.images
                                        .filter(img => img.match(/\.(jpg|jpeg|png|webp|gif)$/i))
                                        .map((img, i) => (
                                          <a
                                            key={i}
                                            href={getFileUrl(img)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block"
                                          >
                                            <Image
                                              src={getFileUrl(img)}
                                              alt={`Project File ${i + 1}`}
                                              className="w-72 h-56 object-cover rounded shadow hover:opacity-80 transition bg-white"
                                              width={288}
                                              height={224}
                                            />
                                          </a>
                                        ))}
                                    </div>
                                  </div>
                                )}
                                {/* Download Links */}
                                {selectedProject.images.some(img => !img.match(/\.(jpg|jpeg|png|webp|gif)$/i)) && (
                                  <div className="w-full">
                                    <h4 className="font-semibold mb-2">Other Files</h4>
                                    <ul className="space-y-2">
                                      {selectedProject.images
                                        .map((img: string, i: number) =>
                                          !img.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                                            <li key={i}>
                                              <a
                                                href={getFileUrl(img)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary underline"
                                              >
                                                Download File {i + 1}
                                              </a>
                                            </li>
                                          ) : null
                                        )}
                                    </ul>
                                  </div>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </DialogContent>
                    </Dialog>
                    {/* Achievement Edit Modal with file display */}
                    <Dialog open={showAchievementModal} onOpenChange={setShowAchievementModal}>
                      <DialogContent className="max-w-4xl w-full">
                        <DialogHeader>
                          <DialogTitle>Edit Achievement</DialogTitle>
                        </DialogHeader>
                        {selectedAchievement && (
                          <>
                            <AchievementEditForm
                              achievement={selectedAchievement}
                              studentId={student?.id || ''}
                              onSuccess={() => { setShowAchievementModal(false); if (student?.id) { dispatch(fetchStudentProfile(student.id)); } }}
                            />
                            {/* Display images and files as in student profile page */}
                            {selectedAchievement.files && Array.isArray(selectedAchievement.files) && selectedAchievement.files.length > 0 && (
                              <>
                                {/* Images Grid */}
                                {selectedAchievement.files.some(f => f.match(/\.(jpg|jpeg|png|webp|gif)$/i)) && (
                                  <div className="w-full">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
                                      {selectedAchievement.files
                                        .filter(f => f.match(/\.(jpg|jpeg|png|webp|gif)$/i))
                                        .map((f, i) => (
                                          <a
                                            key={i}
                                            href={getFileUrl(f)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block"
                                          >
                                            <Image
                                              src={getFileUrl(f)}
                                              alt={`Achievement File ${i + 1}`}
                                              className="w-72 h-56 object-cover rounded shadow hover:opacity-80 transition bg-white"
                                              width={288}
                                              height={224}
                                            />
                                          </a>
                                        ))}
                                    </div>
                                  </div>
                                )}
                                {/* Download Links */}
                                {selectedAchievement.files.some(f => !f.match(/\.(jpg|jpeg|png|webp|gif)$/i)) && (
                                  <div className="w-full">
                                    <h4 className="font-semibold mb-2">Other Files</h4>
                                    <ul className="space-y-2">
                                      {selectedAchievement.files
                                        .map((f, i) =>
                                          !f.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                                            <li key={i}>
                                              <a
                                                href={getFileUrl(f)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary underline"
                                              >
                                                Download File {i + 1}
                                              </a>
                                            </li>
                                          ) : null
                                        )}
                                    </ul>
                                  </div>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="applications" className="space-y-6">
              <Card className="w-full">
                <CardContent className="py-8 px-6 md:px-12">
                  <Card>
                    <CardHeader>
                      <CardTitle>My Applications</CardTitle>
                      <CardDescription>
                        Track the status of your job applications
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {jobs
                          .flatMap(job => (job.applications || []).map(app => ({ ...app, job })))
                          .filter(app => app.student && app.student.id === user?.studentId)
                          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .length === 0 ? (
                          <div className="text-center text-gray-500 py-8">No applications yet.</div>
                        ) : (
                          jobs
                            .flatMap(job => (job.applications || []).map(app => ({ ...app, job })))
                            .filter(app => app.student && app.student.id === user?.studentId)
                            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .map(app => (
                              <div key={app.id} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="font-medium">{app.job.title}</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{app.job.business?.businessName}</p>
                                  </div>
                                  <Badge className="bg-yellow-100 text-yellow-800">{app.status.replace('_', ' ')}</Badge>
                                </div>
                                <div className="flex items-center text-sm text-gray-500 mt-2">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  Applied on {new Date(app.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="talents" className="space-y-6">
              <Card className="w-full">
                <CardContent className="py-8 px-6 md:px-12">
                  <div className="space-y-6 w-full">
                    <div className="font-semibold text-lg mb-2">Talents</div>
                    {(!Array.isArray(talents) || talents.length === 0) && <p className="text-muted-foreground">No talents added yet.</p>}
                    <div className="grid gap-4">
                      {Array.isArray(talents) && talents.map((talent) => (
                        <div key={talent.id} className="flex flex-col md:flex-row md:items-center md:justify-between border rounded-lg p-4">
                          <div>
                            <div className="font-semibold text-lg">{talent.title}</div>
                            <div className="text-xs text-muted-foreground mb-1">{talent.category}</div>
                            <div className="text-sm">{talent.description}</div>
                          </div>
                          <div className="flex gap-2 mt-2 md:mt-0">
                            <Button size="sm" variant="outline" onClick={() => handleEditTalent(talent)}>Edit</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeleteTalent(talent.id)}>Delete</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 space-y-2">
                      <div className="font-semibold mb-2">{editingTalent ? 'Edit Talent' : 'Add Talent'}</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <Input name="title" placeholder="Title" value={talentForm.title} onChange={handleTalentChange} />
                        <Input name="category" placeholder="Category" value={talentForm.category} onChange={handleTalentChange} />
                        <Input name="description" placeholder="Description" value={talentForm.description} onChange={handleTalentChange} />
                      </div>
                      <div className="flex gap-2 mt-2">
                        {editingTalent ? (
                          <>
                            <Button size="sm" onClick={handleUpdateTalent} disabled={talentLoading}>{talentLoading ? 'Saving...' : 'Update'}</Button>
                            <Button size="sm" variant="outline" onClick={() => { setEditingTalent(null); setTalentForm({ title: '', category: '', description: '' }); }}>Cancel</Button>
                          </>
                        ) : (
                          <Button size="sm" onClick={handleAddTalent} disabled={talentLoading}>{talentLoading ? 'Adding...' : 'Add Talent'}</Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  );
}
