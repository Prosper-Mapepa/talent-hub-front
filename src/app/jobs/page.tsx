"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { fetchJobs, applyForJob } from "@/lib/slices/jobsSlice"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Search, Briefcase, Building, MapPin, Clock, DollarSign, Filter, X } from "lucide-react"
import Link from "next/link"
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';
import { PageShell, PageHeader } from '@/components/page-shell';

export default function JobsPage() {
  const dispatch = useAppDispatch()
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const { jobs, isLoading, error } = useAppSelector((state) => state.jobs)
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null)
  
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedJobType, setSelectedJobType] = useState("all")
  const [selectedExperience, setSelectedExperience] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [viewJob] = useState<{ id: string; title: string; description: string; type: string; experienceLevel?: string; location?: string; salary?: string; business?: { businessName: string }; applications?: Array<{ student?: { id: string } }> } | null>(null);
  const [isViewJobOpen, setIsViewJobOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchJobs())
  }, [dispatch])

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleApplyForJob = (jobId: string) => {
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      router.push('/login');
      return
    }
    
    if (user?.role === "student" && user.studentId) {
      setApplyingJobId(jobId);
      dispatch(applyForJob({ jobId, studentId: user.studentId }))
        .unwrap()
        .then(() => {
          toast.success('Application submitted!');
        })
        .catch((err) => {
          toast.error(typeof err === 'string' ? err : 'Failed to apply for job');
        })
        .finally(() => setApplyingJobId(null));
    } else if (user?.role === "student") {
      alert("Student profile not found. Please complete your student registration.");
    }
  }

  // Helper to check if a job has been applied by the current student
  const hasAppliedToJob = (job: { applications?: Array<{ student?: { id: string } }> }) => {
    if (!user?.studentId || !job.applications) return false;
    return job.applications.some((app: { student?: { id: string } }) => app.student?.id === user.studentId);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.business?.businessName.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = selectedJobType === "all" || job.type === selectedJobType
    const matchesExperience = selectedExperience === "all" || job.experienceLevel === selectedExperience
    const matchesLocation = selectedLocation === "all" || 
                           (job.location && job.location.toLowerCase().includes(selectedLocation.toLowerCase()))
    
    return matchesSearch && matchesType && matchesExperience && matchesLocation
  })

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedJobType("all")
    setSelectedExperience("all")
    setSelectedLocation("all")
  }

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case "FULL_TIME": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "PART_TIME": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "INTERNSHIP": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "CONTRACT": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getExperienceColor = (level: string) => {
    switch (level) {
      case "ENTRY_LEVEL": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "INTERMEDIATE": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "SENIOR": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return "1 day ago"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }
console.log('filteredJobs', filteredJobs);
console.log('Sample job createdAt:', filteredJobs[0]?.createdAt);
console.log('Sample job data:', filteredJobs[0]);

  return (
    <PageShell>
      <PageHeader
        badge="Opportunities"
        title="Discover Campus Jobs"
        subtitle="Find on-campus roles and internships to build real-world experience."
      />

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="vt-search-panel flex flex-col items-center gap-4 md:flex-row">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search jobs, companies, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 rounded-lg border-gray-200 focus:ring-2 focus:ring-[var(--vt-teal-700)]/30"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="vt-btn-outline flex items-center gap-2 px-6 py-3"
            >
              <Filter className="h-5 w-5" />
              Filters
            </Button>
            {(searchTerm || selectedJobType !== "all" || selectedExperience !== "all" || selectedLocation !== "all") && (
              <Button variant="ghost" onClick={clearFilters} className="flex items-center gap-2 text-gray-500 px-6 py-3 rounded-lg">
                <X className="h-5 w-5" />
                Clear
              </Button>
            )}
          </div>

          {showFilters && (
            <div className="vt-section-card mt-4 grid grid-cols-1 gap-4 p-6 md:grid-cols-3">
              <div>
                <label className="text-sm font-medium mb-2 block">Job Type</label>
                <Select value={selectedJobType} onValueChange={setSelectedJobType}>
                  <SelectTrigger className="w-full rounded-lg border-gray-200">
                    <SelectValue placeholder="All job types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Job Types</SelectItem>
                    <SelectItem value="FULL_TIME">Full Time</SelectItem>
                    <SelectItem value="PART_TIME">Part Time</SelectItem>
                    <SelectItem value="INTERNSHIP">Internship</SelectItem>
                    <SelectItem value="CONTRACT">Contract</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Experience Level</label>
                <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                  <SelectTrigger className="w-full rounded-lg border-gray-200">
                    <SelectValue placeholder="All experience levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Experience Levels</SelectItem>
                    <SelectItem value="ENTRY_LEVEL">Entry Level</SelectItem>
                    <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                    <SelectItem value="SENIOR">Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-full rounded-lg border-gray-200">
                    <SelectValue placeholder="All locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="new york">New York</SelectItem>
                    <SelectItem value="san francisco">San Francisco</SelectItem>
                    <SelectItem value="chicago">Chicago</SelectItem>
                    <SelectItem value="boston">Boston</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {isLoading ? "Loading jobs..." : `${filteredJobs.length} job${filteredJobs.length !== 1 ? "s" : ""} found`}
          </p>
        </div>

        {/* Job Listings */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No jobs found.</div>
        ) : (
          <div className="vt-grid-cards-wide">
            {filteredJobs.map((job) => (
              <article key={job.id} className="vt-section-card vt-card-hover flex h-full flex-col overflow-hidden">
                <div className="flex items-start gap-3 border-b border-border/50 bg-[color:var(--vt-mint-50)]/40 px-4 py-3.5 sm:px-5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-[color:var(--vt-teal-600)]/10">
                    <Briefcase className="h-5 w-5 text-[color:var(--vt-teal-700)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold leading-snug text-foreground">{job.title}</h3>
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <Building className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{job.business?.businessName}</span>
                    </p>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-3 px-4 py-4 sm:px-5">
                  <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    <Badge className={getJobTypeColor(job.type)}>{job.type.replace("_", " ")}</Badge>
                    <Badge className={getExperienceColor(job.experienceLevel)}>
                      {job.experienceLevel.replace("_", " ")}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground sm:text-sm">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {job.location || "Remote"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {job.createdAt && !isNaN(new Date(job.createdAt).getTime()) ? formatDate(job.createdAt) : 'N/A'}
                    </span>
                    {job.salary && (
                      <span className="flex items-center gap-1 font-medium text-[color:var(--vt-teal-700)]">
                        <DollarSign className="h-3.5 w-3.5" />
                        {job.salary}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-auto flex gap-2 border-t border-border/50 px-4 py-3 sm:px-5">
                  <Button variant="outline" size="sm" asChild className="flex-1 text-xs">
                    <Link href={`/jobs/${job.id}`}>View Details</Link>
                  </Button>
                  {user?.role === 'student' && (
                    <Button
                      onClick={() => handleApplyForJob(job.id)}
                      disabled={applyingJobId === job.id || hasAppliedToJob(job)}
                      size="sm"
                      className={`flex-1 text-xs ${hasAppliedToJob(job) ? 'bg-green-600 text-white' : 'vt-btn-primary'}`}
                    >
                      {applyingJobId === job.id ? (
                        <><Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" /> Applying</>
                      ) : hasAppliedToJob(job) ? (
                        'Applied'
                      ) : (
                        'Apply'
                      )}
                    </Button>
                  )}
                </div>
              </article>
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
                  <p className="text-gray-800 whitespace-pre-line">{viewJob.description}</p>
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center"><MapPin className="h-4 w-4 mr-1" />{viewJob.location || 'Remote'}</span>
                  {viewJob.salary && <span className="flex items-center text-green-700"><span className="font-semibold ml-1">{viewJob.salary}</span></span>}
                  <Badge className={getJobTypeColor(viewJob.type)}>{viewJob.type.replace('_', ' ')}</Badge>
                  {viewJob.experienceLevel && <Badge className={getExperienceColor(viewJob.experienceLevel)}>{viewJob.experienceLevel.replace('_', ' ')}</Badge>}
                </div>
                {user?.role === 'student' && (
                  <Button
                    className={`w-full ${hasAppliedToJob(viewJob) ? 'bg-green-600 text-white cursor-not-allowed' : 'vt-btn-primary'}`}
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
    </PageShell>
  )
}

