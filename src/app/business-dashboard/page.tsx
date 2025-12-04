"use client"

import { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchBusinessJobs, createJob, updateJob, deleteJob } from '@/lib/slices/jobsSlice';
import { fetchBusinessProfile, updateBusiness } from '@/lib/slices/businessesSlice';
import { fetchConversations } from '@/lib/slices/messagesSlice';
import { fetchStudents } from '@/lib/slices/studentsSlice';
import ProtectedRoute from '@/components/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus, Briefcase, Users, MessageSquare, Building, MapPin, Edit, Trash2, User, Clock, DollarSign, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const MessagesPage = dynamic(() => import('../messages/page'), { ssr: false });

export default function BusinessDashboardPage() {
  // All hooks at the top
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const { jobs, isLoading: jobsLoading, error: jobsError } = useAppSelector((state) => state.jobs);
  const { business, isLoading: profileLoading, error: profileError } = useAppSelector((state) => state.businesses);
  const { conversations } = useAppSelector((state) => state.messages);
  const { students } = useAppSelector((state) => state.students);
  const [isCreateJobOpen, setIsCreateJobOpen] = useState(false);
  const [isEditJobOpen, setIsEditJobOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<{ id: string; title: string; description: string; type: string; experienceLevel: string; location?: string; salary?: string; status?: string; createdAt?: string } | null>(null);
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    type: '',
    experienceLevel: '',
    location: '',
    salary: '',
  });
  const [creatingJob, setCreatingJob] = useState(false);
  const [editingJob, setEditingJob] = useState(false);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const [profileForm, setProfileForm] = useState({
    businessName: '',
    businessType: '',
    location: '',
    description: '',
    website: '',
  });
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [allApplications, setAllApplications] = useState<Array<{ id: string; student?: { id: string; firstName?: string; lastName?: string }; job?: { id: string; title: string }; status: string; createdAt: string }>>([]);
  const [activeTab, setActiveTab] = useState('jobs');
  const router = useRouter();
  const [selectedStudent, setSelectedStudent] = useState<{ id: string; firstName?: string; lastName?: string; email?: string; profileImage?: string; major?: string; year?: string; graduationYear?: string; gpa?: string; bio?: string; skills?: Array<{ id: string; name: string; proficiency?: string }>; achievements?: Array<{ id: string; title: string; description?: string; date?: string; issuer?: string }>; projects?: Array<{ id: string; title: string; description?: string; technologies?: string[]; url?: string }>; talents?: Array<{ id: string; title: string; description?: string; category?: string }>; createdAt?: string; profileViews?: number } | null>(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showMessages] = useState(false);
  const [viewJob, setViewJob] = useState<{ id: string; title: string; description: string; type: string; experienceLevel?: string; location?: string; salary?: string; status?: string } | null>(null);
  const [isViewJobOpen, setIsViewJobOpen] = useState(false);

  useEffect(() => {
    if (activeTab === 'applications' && typeof user?.businessId === 'string') {
      dispatch(fetchBusinessJobs(user.businessId));
    } else if ((activeTab === 'jobs' || activeTab === 'profile') && typeof user?.businessId === 'string') {
      dispatch(fetchBusinessJobs(user.businessId));
      dispatch(fetchBusinessProfile(user.businessId));
    }
  }, [activeTab, dispatch, user?.businessId]);

  useEffect(() => {
    if (typeof user?.businessId === 'string' && user.businessId) {
      const businessId = user.businessId;
      dispatch(fetchBusinessJobs(businessId));
      dispatch(fetchBusinessProfile(businessId));
      const interval = setInterval(() => {
        dispatch(fetchBusinessJobs(businessId));
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [dispatch, user?.businessId]);

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

  // Initialize form state from Redux business
  useEffect(() => {
    if (business) {
      setProfileForm({
        businessName: business.businessName || '',
        businessType: business.businessType || '',
        location: business.location || '',
        description: business.description || '',
        website: business.website || '',
      });
    }
  }, [business]);

  // Aggregate all applications from jobs
  useEffect(() => {
    // Only run on client
    const apps = jobs
      .flatMap(job => (job.applications || []).map(app => ({ ...app, job })))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setAllApplications(apps);
  }, [jobs]);

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

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

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchConversations(user.id));
    }
  }, [user?.id, dispatch]);

  const handleCreateJob = () => {
    if (business?.id) {
      setCreatingJob(true);
      dispatch(createJob({ ...newJob, businessId: business.id }))
        .unwrap()
        .then(() => {
          toast.success('Job posted!');
          setIsCreateJobOpen(false);
          setNewJob({
            title: '',
            description: '',
            type: '',
            experienceLevel: '',
            location: '',
            salary: '',
          });
        })
        .catch((err) => {
          toast.error(typeof err === 'string' ? err : 'Failed to post job');
        })
        .finally(() => setCreatingJob(false));
    }
  };

  const handleEditJob = () => {
    if (selectedJob) {
      setEditingJob(true);
      dispatch(updateJob({ id: selectedJob.id, data: newJob }))
        .unwrap()
        .then(() => {
          toast.success('Job updated!');
          setIsEditJobOpen(false);
          setSelectedJob(null);
          setNewJob({
            title: '',
            description: '',
            type: '',
            experienceLevel: '',
            location: '',
            salary: '',
          });
        })
        .catch((err) => {
          toast.error(typeof err === 'string' ? err : 'Failed to update job');
        })
        .finally(() => setEditingJob(false));
    }
  };

  const handleDeleteJob = (jobId: string) => {
    if (confirm('Are you sure you want to delete this job?')) {
      setDeletingJobId(jobId);
      dispatch(deleteJob(jobId))
        .unwrap()
        .then(() => {
          toast.success('Job deleted!');
        })
        .catch((err) => {
          toast.error(typeof err === 'string' ? err : 'Failed to delete job');
        })
        .finally(() => setDeletingJobId(null));
    }
  };

  console.log('profileForm',profileForm);
  

  const openEditJob = (job: { id: string; title: string; description: string; type: string; experienceLevel: string; location?: string; salary?: string }) => {
    setSelectedJob(job as { id: string; title: string; description: string; type: string; experienceLevel: string; location?: string; salary?: string; status?: string; createdAt?: string });
    setNewJob({
      title: job.title,
      description: job.description,
      type: job.type,
      experienceLevel: job.experienceLevel,
      location: job.location || '',
      salary: job.salary || '',
    });
    setIsEditJobOpen(true);
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'FULL_TIME': return 'bg-green-100 text-green-800';
      case 'PART_TIME': return 'bg-blue-100 text-blue-800';
      case 'INTERNSHIP': return 'bg-purple-100 text-purple-800';
      case 'CONTRACT': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PAUSED': return 'bg-yellow-100 text-yellow-800';
      case 'CLOSED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  };

  // Handle profile form changes
  const handleProfileChange = (field: string, value: string) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  // Handle update profile
  const handleUpdateProfile = () => {
    if (!business) return;
    setUpdatingProfile(true);
    dispatch(updateBusiness({ id: business.id, data: profileForm }))
      .unwrap()
      .then(() => {
        toast.success('Profile updated!');
      })
      .catch((err) => {
        toast.error(typeof err === 'string' ? err : 'Failed to update profile');
      })
      .finally(() => setUpdatingProfile(false));
  };

  // Update the stats array to show total jobs instead of just active ones
  const stats = [
    {
      title: "Total Jobs",
      value: jobs.length, // Changed from jobs.filter(job => job.status === 'ACTIVE').length
      icon: Briefcase,
      color: "text-[#8F1A27]",
      bgColor: "bg-[#8F1A27]/10"
    },
    {
      title: "Total Applications",
      value: allApplications.length,
      icon: Users,
      color: "text-[#8F1A27]",
      bgColor: "bg-[#8F1A27]/10"
    },
    {
      title: "New Conversations",
      value: totalConversations,
      icon: MessageSquare,
      color: "text-[#8F1A27]",
      bgColor: "bg-[#8F1A27]/10"
    },
    {
      title: "Total Students",
      value: students.length,
      icon: GraduationCap,
      color: "text-[#8F1A27]",
      bgColor: "bg-[#8F1A27]/10"
    }
  ];

  // Only after all hooks, do the conditional return
  if (!user || !user.businessId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
        <ProtectedRoute allowedRoles={['business']}>
      <div className="min-h-screen bg-gray-50 transition-colors duration-700 ease-in-out">
        {/* Header Section */}
        <section className="bg-white py-6 px-4 md:px-8 border-b border-gray-100">
          <div className="mx-auto max-w-8xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl font-extrabold text-[#8F1A27] leading-tight">
                  Welcome, {business?.businessName || user?.email} 👋
                </h1>
                <p className="text-xl text-gray-600 font-medium">
                  Manage your job postings and connect with talented students
                </p>
               
              </div>
            </div>
          </div>
        </section>

        {/* Always render both, toggle with display */}
        <div style={{ display: showMessages ? 'block' : 'none' }}>
          <MessagesPage />
        </div>
        <div style={{ display: showMessages ? 'none' : 'block' }} className=''>
          {/* Stats Cards */}
          <div className="mx-auto max-w-8xl px-4 md:px-8 py-8 bg-white w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-white border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-8">
                    <div className="flex items-center">
                      <div className={`bg-gradient-to-br from-${stat.bgColor} to-${stat.bgColor.replace('50', '100')} rounded-2xl p-4 mr-4`}>
                        <stat.icon className={`h-7 w-7 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

            {/* Main Content Section */}
            <div className="mx-auto max-w-8xl px-4 md:px-8 py-12">
              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm p-2 rounded-3xl shadow-lg border border-gray-200/50 pb-9">
                  <TabsTrigger value="jobs" className="text-sm font-medium text-gray-600 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8F1A27] data-[state=active]:to-[#6D0432] data-[state=active]:text-white data-[state=active]:shadow-md rounded-3xl py-2 px-4 data-[state=active]:font-semibold hover:bg-gray-100 -mt-1">Job Management</TabsTrigger>
                  <TabsTrigger value="applications" className="text-sm font-medium text-gray-600 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8F1A27] data-[state=active]:to-[#6D0432] data-[state=active]:text-white data-[state=active]:shadow-md rounded-3xl py-2 px-4 data-[state=active]:font-semibold hover:bg-gray-100 -mt-1">Applications</TabsTrigger>
                  <TabsTrigger value="profile" className="text-sm font-medium text-gray-600 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8F1A27] data-[state=active]:to-[#6D0432] data-[state=active]:text-white data-[state=active]:shadow-md rounded-3xl py-2 px-4 data-[state=active]:font-semibold hover:bg-gray-100 -mt-1">Business Profile</TabsTrigger>
                </TabsList>

              <TabsContent value="jobs" className="space-y-6">
                {/* Create Job Button */}
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold text-gray-900">Job Postings</h2>
                  <Dialog open={isCreateJobOpen} onOpenChange={setIsCreateJobOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#8F1A27] text-white hover:bg-[#6D0432] rounded-xl shadow-lg font-semibold px-8 py-3 transition-all duration-200 hover:shadow-xl">
                        <Plus className="mr-2 h-5 w-5" />
                        Post New Job
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Create New Job Posting</DialogTitle>
                        <DialogDescription>
                          Fill in the details below to create a new job posting
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Job Title</Label>
                          <Input
                            id="title"
                            value={newJob.title}
                            onChange={(e) => setNewJob(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="e.g., Frontend Developer Intern"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Job Description</Label>
                          <Textarea
                            id="description"
                            value={newJob.description}
                            onChange={(e) => setNewJob(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Describe the role, responsibilities, and requirements..."
                            rows={4}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="type">Job Type</Label>
                            <Select value={newJob.type} onValueChange={(value) => setNewJob(prev => ({ ...prev, type: value }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select job type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="FULL_TIME">Full Time</SelectItem>
                                <SelectItem value="PART_TIME">Part Time</SelectItem>
                                <SelectItem value="INTERNSHIP">Internship</SelectItem>
                                <SelectItem value="CONTRACT">Contract</SelectItem>
                                <SelectItem value="FREELANCE">Freelance</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="experienceLevel">Experience Level</Label>
                            <Select value={newJob.experienceLevel} onValueChange={(value) => setNewJob(prev => ({ ...prev, experienceLevel: value }))}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select experience level" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="ENTRY_LEVEL">Entry Level</SelectItem>
                                <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                                <SelectItem value="SENIOR">Senior</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              value={newJob.location}
                              onChange={(e) => setNewJob(prev => ({ ...prev, location: e.target.value }))}
                              placeholder="e.g., New York, NY or Remote"
                            />
                          </div>
                          <div>
                            <Label htmlFor="salary">Salary (Optional)</Label>
                            <Input
                              id="salary"
                              value={newJob.salary}
                              onChange={(e) => setNewJob(prev => ({ ...prev, salary: e.target.value }))}
                              placeholder="e.g., $50,000 - $70,000"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsCreateJobOpen(false)} className="border-gray-200 text-gray-700 hover:bg-gray-50">
                            Cancel
                          </Button>
                          <Button onClick={handleCreateJob} disabled={creatingJob} className="bg-[#8F1A27] text-white hover:bg-[#6D0432] rounded-lg shadow-sm font-medium">
                            {creatingJob ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting...</> : 'Post Job'}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                {/* Job Listings */}
                {jobsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : jobsError ? (
                  <Alert variant="destructive">
                    <AlertDescription>{jobsError}</AlertDescription>
                  </Alert>
                ) : jobs.length === 0 ? (
                  <div className="text-center text-gray-500 py-12">No jobs posted yet.</div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {jobs.map((job) => (
                      <Card key={job.id} className="hover:shadow-2xl transition-all duration-300 rounded-2xl border-0 bg-white/90 backdrop-blur-sm py-8 px-0 flex flex-col justify-between min-h-[280px] hover:-translate-y-1">
                        <CardHeader className="pb-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <CardTitle className="text-lg font-bold text-gray-900">{job.title}</CardTitle>
                              <CardDescription className="flex items-center text-gray-600 font-medium">
                                <Building className="h-5 w-5 mr-2 text-[#8F1A27]" />
                                {business?.businessName}
                              </CardDescription>
                            </div>
                            <div className="flex flex-col gap-2 items-end">
                              <Badge className={`${getJobTypeColor(job.type)} rounded-full px-3 py-1 font-semibold`}>{job.type.replace('_', ' ')}</Badge>
                              <Badge className={`${getStatusColor(job.status || 'ACTIVE')} rounded-full px-3 py-1 font-semibold`}>{job.status || 'ACTIVE'}</Badge>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-between">
                          <p className=" text-gray-700 leading-relaxed mb-6 line-clamp-3">{job.description}</p>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-6 text-sm text-gray-600">
                                <span className="flex items-center font-medium">
                                  <MapPin className="h-5 w-5 mr-2 text-[#8F1A27]" />
                                  {job.location || "Remote"}
                                </span>
                                <span className="flex items-center font-medium">
                                  <Clock className="h-5 w-5 mr-2 text-[#8F1A27]" />
                                  {job.createdAt && !isNaN(new Date(job.createdAt).getTime()) ? formatDate(job.createdAt) : 'N/A'}
                                </span>
                              </div>
                            </div>
                            {job.salary && (
                              <div className="flex items-center text-sm text-green-700 font-semibold">
                                <DollarSign className="h-5 w-5 mr-2" />
                                <span className="">{job.salary}</span>
                              </div>
                            )}
                            <div className="flex justify-end gap-3">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openEditJob(job)}
                                className=" py-3 rounded-xl border-gray-200 hover:border-[#8F1A27] hover:bg-[#8F1A27]/5 text-[#8F1A27] font-semibold transition-all duration-200"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteJob(job.id)}
                                disabled={deletingJobId === job.id}
                                className="py-3 px-6 rounded-xl border-red-200 hover:border-red-300 hover:bg-red-50 text-red-700 font-semibold transition-all duration-200"
                              >
                                {deletingJobId === job.id ? (
                                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</>
                                ) : (
                                  <><Trash2 className="h-4 w-4 mr-2" /> Delete</>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => { setViewJob(job); setIsViewJobOpen(true); }}
                                className="py-3 px-6 rounded-xl bg-[#8F1A27] text-white hover:bg-[#6D0432] hover:shadow-xl font-semibold transition-all duration-200"
                              >
                                View
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {jobs.length === 0 && !jobsLoading && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No job postings yet
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Create your first job posting to start attracting talented students.
                      </p>
                      <Button onClick={() => setIsCreateJobOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Post Your First Job
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="applications" className="space-y-8">
                <Card className="border-0 shadow-xl rounded-2xl bg-white/90 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-2xl font-bold text-gray-900">Recent Applications</CardTitle>
                    <CardDescription className="text-gray-600 text-base">
                      Review and manage applications for your job postings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {jobsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                      </div>
                    ) : allApplications.length === 0 ? (
                      <div className="text-center text-gray-500 py-12">
                        <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <div className="text-lg font-medium mb-2">No applications yet</div>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {allApplications.map(app => (
                          <div key={app.id} className="mb-6">
                            <div className="font-semibold mb-2 text-lg ">{app.job?.title}</div>
                            <div className="border rounded-lg p-4 mb-2 flex flex-col md:flex-row md:items-center md:justify-between">
                              <div>
                                <h4 className="font-medium">{app.student?.firstName} {app.student?.lastName}</h4>
                                <p className="text-xs text-gray-500">Applied {new Date(app.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                              </div>
                              <div className="flex flex-col md:flex-row md:items-center gap-2 mt-2 md:mt-0 md:ml-auto justify-end">
                                <Badge className={
                                  app.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                  app.status === 'REVIEWED' ? 'bg-blue-100 text-blue-800' :
                                  app.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                                  app.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }>
                                  {app.status.charAt(0).toUpperCase() + app.status.slice(1).toLowerCase()}
                                </Badge>
                                <Button size="sm" variant="outline" onClick={() => { if (app.student) { setSelectedStudent(app.student as { id: string; firstName?: string; lastName?: string; email?: string; profileImage?: string; major?: string; year?: string; graduationYear?: string; gpa?: string; bio?: string; skills?: Array<{ id: string; name: string; proficiency?: string }>; achievements?: Array<{ id: string; title: string; description?: string; date?: string; issuer?: string }>; projects?: Array<{ id: string; title: string; description?: string; technologies?: string[]; url?: string }>; talents?: Array<{ id: string; title: string; description?: string; category?: string }>; createdAt?: string; profileViews?: number }); setShowStudentModal(true); } }}>
                                  View Profile
                                </Button>
                                <Button size="sm" variant="secondary" onClick={() => router.push(`/messages?studentId=${app.student?.id}`)}>
                                  Message
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                {/* Enhanced Student Profile Modal */}
                <Dialog open={showStudentModal} onOpenChange={setShowStudentModal}>
                  <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold text-[#8F1A27]">Student Profile</DialogTitle>
                    </DialogHeader>
                    {selectedStudent && (
                      <div className="p-4">
                        {/* Enhanced Header with Profile Image */}
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between border-b pb-6 mb-6">
                          <div className="flex items-start space-x-4">
                            {/* Profile Image */}
                            <div className="relative h-24 w-24 rounded-full border-4 border-[#8F1A27]/20 overflow-hidden bg-[#8F1A27] flex items-center justify-center">
                              {selectedStudent.profileImage ? (
                                <img
                                  src={(() => {
                                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
                                    let imagePath = selectedStudent.profileImage;
                                    
                                    // Clean the path - remove any leading slashes
                                    if (imagePath.startsWith('/')) {
                                      imagePath = imagePath.substring(1);
                                    }
                                    
                                    // If the path already includes uploads/profiles/, use it as is
                                    if (imagePath.startsWith('uploads/profiles/')) {
                                      return `${apiUrl}/${imagePath}`;
                                    }
                                    
                                    // If it's just a filename, add the profiles directory
                                    return `${apiUrl}/uploads/profiles/${imagePath}`;
                                  })()}
                                  alt={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                  }}
                                />
                              ) : null}
                              <div className={`${selectedStudent.profileImage ? 'hidden' : ''} text-white font-bold text-2xl`}>
                                {selectedStudent.firstName?.[0]}{selectedStudent.lastName?.[0]}
                              </div>
                            </div>
                            
                            {/* Student Info */}
                            <div className="flex-1">
                              <div className="text-3xl font-bold text-gray-900 mb-2">
                                {selectedStudent.firstName} {selectedStudent.lastName}
                              </div>
                              {selectedStudent.email && (
                                <div className="text-gray-600 text-lg mb-2">{selectedStudent.email}</div>
                              )}
                              <div className="flex flex-wrap gap-2 mb-3">
                                {selectedStudent.major && (
                                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                    {selectedStudent.major}
                                  </Badge>
                                )}
                                {selectedStudent.year && (
                                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                                    {selectedStudent.year}
                                  </Badge>
                                )}
                                {selectedStudent.graduationYear && (
                                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                                    Class of {selectedStudent.graduationYear}
                                  </Badge>
                                )}
                                {selectedStudent.gpa && (
                                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                                    GPA: {selectedStudent.gpa}
                                  </Badge>
                                )}
                              </div>
                              {selectedStudent.bio && (
                                <p className="text-gray-700 text-sm leading-relaxed">{selectedStudent.bio}</p>
                              )}
                            </div>
                          </div>
                          
                          {/* Action Buttons */}
                          <div className="mt-4 md:mt-0 flex flex-col gap-2">
                            <Button 
                              size="sm" 
                              className="bg-[#8F1A27] text-white hover:bg-[#6D0432]"
                              onClick={() => { 
                                setShowStudentModal(false); 
                                router.push(`/messages?studentId=${selectedStudent.id}`); 
                              }}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Message
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setShowStudentModal(false)}
                            >
                              Close
                            </Button>
                          </div>
                        </div>

                        {/* Enhanced Tabs */}
                        <Tabs defaultValue="about" className="space-y-6">
                          <TabsList className="grid grid-cols-5 w-full">
                            <TabsTrigger value="about">About</TabsTrigger>
                            <TabsTrigger value="skills">Skills</TabsTrigger>
                            <TabsTrigger value="achievements">Achievements</TabsTrigger>
                            <TabsTrigger value="projects">Projects</TabsTrigger>
                            <TabsTrigger value="talents">Talents</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="about" className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-6">
                              <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Full Name</label>
                                  <p className="text-gray-900">{selectedStudent.firstName} {selectedStudent.lastName}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Email</label>
                                  <p className="text-gray-900">{selectedStudent.email}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Major</label>
                                  <p className="text-gray-900">{selectedStudent.major || 'Not specified'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Academic Year</label>
                                  <p className="text-gray-900">{selectedStudent.year || 'Not specified'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Graduation Year</label>
                                  <p className="text-gray-900">{selectedStudent.graduationYear || 'Not specified'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">GPA</label>
                                  <p className="text-gray-900">{selectedStudent.gpa || 'Not specified'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Profile Views</label>
                                  <p className="text-gray-900">{selectedStudent.profileViews || 0}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-500">Member Since</label>
                                  <p className="text-gray-900">
                                    {selectedStudent.createdAt ? new Date(selectedStudent.createdAt).toLocaleDateString() : 'Not available'}
                                  </p>
                                </div>
                              </div>
                              {selectedStudent.bio && (
                                <div className="mt-6">
                                  <label className="text-sm font-medium text-gray-500">Bio</label>
                                  <p className="text-gray-900 mt-1 leading-relaxed">{selectedStudent.bio}</p>
                                </div>
                              )}
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="skills" className="space-y-4">
                            {selectedStudent.skills && selectedStudent.skills.length > 0 ? (
                              <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Technical Skills</h3>
                                <div className="flex flex-wrap gap-3">
                                  {selectedStudent.skills.map((skill: { id: string; name: string; proficiency?: string }) => (
                                    <div key={skill.id} className="bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
                                      <div className="font-medium text-gray-900">{skill.name}</div>
                                      {skill.proficiency && (
                                        <div className="text-sm text-gray-600">Proficiency: {skill.proficiency}</div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="text-center text-gray-500 py-8">
                                <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                <p>No skills listed yet.</p>
                              </div>
                            )}
                          </TabsContent>
                          
                          <TabsContent value="achievements" className="space-y-4">
                            {selectedStudent.achievements && selectedStudent.achievements.length > 0 ? (
                              <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Achievements & Awards</h3>
                                <div className="space-y-4">
                                  {selectedStudent.achievements.map((ach: { id: string; title: string; description?: string; date?: string; issuer?: string }) => (
                                    <div key={ach.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                      <div className="font-semibold text-gray-900 text-lg">{ach.title}</div>
                                      {ach.description && (
                                        <p className="text-gray-700 mt-2">{ach.description}</p>
                                      )}
                                      {ach.date && (
                                        <p className="text-sm text-gray-500 mt-2">Date: {new Date(ach.date).toLocaleDateString()}</p>
                                      )}
                                      {ach.issuer && (
                                        <p className="text-sm text-gray-500">Issuer: {ach.issuer}</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="text-center text-gray-500 py-8">
                                <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                <p>No achievements listed yet.</p>
                              </div>
                            )}
                          </TabsContent>
                          
                          <TabsContent value="projects" className="space-y-4">
                            {selectedStudent.projects && selectedStudent.projects.length > 0 ? (
                              <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Projects</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {selectedStudent.projects.map((proj: { id: string; title: string; description?: string; technologies?: string[]; url?: string }) => (
                                    <div key={proj.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                      <div className="font-semibold text-gray-900 text-lg mb-2">{proj.title}</div>
                                      {proj.description && (
                                        <p className="text-gray-700 text-sm mb-3">{proj.description}</p>
                                      )}
                                      {proj.technologies && proj.technologies.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-3">
                                          {proj.technologies.map((tech: string, index: number) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                              {tech}
                                            </Badge>
                                          ))}
                                        </div>
                                      )}
                                      {proj.url && (
                                        <a 
                                          href={proj.url} 
                                          target="_blank" 
                                          rel="noopener noreferrer" 
                                          className="text-[#8F1A27] hover:text-[#6D0432] text-sm font-medium"
                                        >
                                          View Project →
                                        </a>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="text-center text-gray-500 py-8">
                                <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                <p>No projects listed yet.</p>
                              </div>
                            )}
                          </TabsContent>
                          
                          <TabsContent value="talents" className="space-y-4">
                            {selectedStudent.talents && selectedStudent.talents.length > 0 ? (
                              <div className="bg-gray-50 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Special Talents</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {selectedStudent.talents.map((talent: { id: string; title: string; description?: string; category?: string }) => (
                                    <div key={talent.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                      <div className="font-semibold text-gray-900 text-lg mb-2">{talent.title}</div>
                                      {talent.description && (
                                        <p className="text-gray-700 text-sm mb-3">{talent.description}</p>
                                      )}
                                      {talent.category && (
                                        <Badge variant="secondary" className="text-xs">
                                          {talent.category}
                                        </Badge>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="text-center text-gray-500 py-8">
                                <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                <p>No special talents listed yet.</p>
                              </div>
                            )}
                          </TabsContent>
                        </Tabs>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </TabsContent>

              <TabsContent value="profile" className="space-y-8">
                <Card className="border-0 shadow-xl rounded-2xl bg-white/90 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-2xl font-bold text-gray-900">Business Profile</CardTitle>
                    <CardDescription className="text-gray-600 text-base">
                      Update your business information to attract better candidates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profileLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin" />
                      </div>
                    ) : (
                      <form
                        onSubmit={e => {
                          e.preventDefault();
                          handleUpdateProfile();
                        }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="businessName">Business Name</Label>
                            <Input
                              id="businessName"
                              value={profileForm.businessName}
                              onChange={e => handleProfileChange('businessName', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor="businessType">Business Type</Label>
                            <Select
                              value={profileForm.businessType}
                              onValueChange={value => handleProfileChange('businessType', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select business type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="TECHNOLOGY">Technology</SelectItem>
                                <SelectItem value="CONSULTING">Consulting</SelectItem>
                                <SelectItem value="HEALTHCARE">Healthcare</SelectItem>
                                <SelectItem value="FINANCE">Finance</SelectItem>
                                <SelectItem value="EDUCATION">Education</SelectItem>
                                <SelectItem value="RETAIL">Retail</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" value={business?.email || ''} disabled />
                          </div>
                          <div>
                            <Label htmlFor="location">Location</Label>
                            <Input
                              id="location"
                              value={profileForm.location}
                              onChange={e => handleProfileChange('location', e.target.value)}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor="description">Business Description</Label>
                            <Textarea
                              id="description"
                              value={profileForm.description}
                              onChange={e => handleProfileChange('description', e.target.value)}
                              placeholder="Tell students about your company..."
                              rows={4}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                              id="website"
                              value={profileForm.website}
                              onChange={e => handleProfileChange('website', e.target.value)}
                              placeholder="https://yourcompany.com"
                            />
                          </div>
                        </div>
                        <Button className="w-full mt-6 bg-[#8F1A27] text-white hover:bg-[#6D0432] rounded-lg shadow-sm font-medium" type="submit" disabled={updatingProfile}>
                          {updatingProfile ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</>
                          ) : (
                            'Update Profile'
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Edit Job Dialog */}
          <Dialog open={isEditJobOpen} onOpenChange={setIsEditJobOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Job Posting</DialogTitle>
                <DialogDescription>
                  Update the details of your job posting
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-title">Job Title</Label>
                  <Input
                    id="edit-title"
                    value={newJob.title}
                    onChange={(e) => setNewJob(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Frontend Developer Intern"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Job Description</Label>
                  <Textarea
                    id="edit-description"
                    value={newJob.description}
                    onChange={(e) => setNewJob(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe the role, responsibilities, and requirements..."
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-type">Job Type</Label>
                    <Select value={newJob.type} onValueChange={(value) => setNewJob(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FULL_TIME">Full Time</SelectItem>
                        <SelectItem value="PART_TIME">Part Time</SelectItem>
                        <SelectItem value="INTERNSHIP">Internship</SelectItem>
                        <SelectItem value="CONTRACT">Contract</SelectItem>
                        <SelectItem value="FREELANCE">Freelance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-experienceLevel">Experience Level</Label>
                    <Select value={newJob.experienceLevel} onValueChange={(value) => setNewJob(prev => ({ ...prev, experienceLevel: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ENTRY_LEVEL">Entry Level</SelectItem>
                        <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                        <SelectItem value="SENIOR">Senior</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-location">Location</Label>
                    <Input
                      id="edit-location"
                      value={newJob.location}
                      onChange={(e) => setNewJob(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g., New York, NY or Remote"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-salary">Salary (Optional)</Label>
                    <Input
                      id="edit-salary"
                      value={newJob.salary}
                      onChange={(e) => setNewJob(prev => ({ ...prev, salary: e.target.value }))}
                      placeholder="e.g., $50,000 - $70,000"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsEditJobOpen(false)} className="border-gray-200 text-gray-700 hover:bg-gray-50">
                    Cancel
                  </Button>
                  <Button onClick={handleEditJob} disabled={editingJob} className="bg-[#8F1A27] text-white hover:bg-[#6D0432] rounded-lg shadow-sm font-medium">
                    {editingJob ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* View Job Modal */}
          <Dialog open={isViewJobOpen} onOpenChange={setIsViewJobOpen}>
            <DialogContent className="max-w-lg w-full">
              <DialogHeader>
                <DialogTitle>{viewJob?.title}</DialogTitle>
                <DialogDescription>
                  <span className="text-gray-500">{business?.businessName}</span>
                </DialogDescription>
              </DialogHeader>
              {viewJob && (
                <div className="space-y-4">
                  <div>
                    <span className="block text-xs text-gray-400 mb-1">Description</span>
                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">{viewJob.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" />{viewJob.location || 'Remote'}</span>
                    {viewJob.salary && <span className="flex items-center text-green-700 dark:text-green-400"><span className="font-semibold ml-1">${viewJob.salary.replace(/[^\d.,-]/g, '')}</span></span>}
                    <Badge className={getJobTypeColor(viewJob.type)}>{viewJob.type.replace('_', ' ')}</Badge>
                    <Badge className={getStatusColor(viewJob.status || 'ACTIVE')}>{viewJob.status || 'ACTIVE'}</Badge>
                    <Badge>{viewJob.experienceLevel?.replace('_', ' ')}</Badge>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ProtectedRoute>
  );
}
