"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Building, MapPin, Calendar, DollarSign, User, Briefcase, Clock, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchJobById, applyForJob } from '@/lib/slices/jobsSlice';
import { use } from 'react';

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const dispatch = useAppDispatch();
  const { currentJob: job, isLoading, error } = useAppSelector((state) => state.jobs);
  const { user } = useAppSelector((state) => state.auth);
  const [isApplying, setIsApplying] = useState(false);
  const router = useRouter();
  
  // Unwrap params Promise
  const resolvedParams = use(params);

  useEffect(() => {
    dispatch(fetchJobById(resolvedParams.id));
  }, [dispatch, resolvedParams.id]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Helper to check if a job has been applied by the current student
  const hasAppliedToJob = (job: any) => {
    if (!user?.studentId || !job.applications) return false;
    return job.applications.some((app: any) => app.student?.id === user.studentId);
  };

  const handleApply = () => {
    if (!user || user.role !== 'student') {
      toast.error('Only students can apply for jobs');
      return;
    }
    setIsApplying(true);
    dispatch(applyForJob({ jobId: resolvedParams.id, studentId: user.studentId || '' }))
      .unwrap()
      .then(() => {
        toast.success('Application submitted!');
      })
      .catch((err) => {
        toast.error(typeof err === 'string' ? err : 'Failed to apply for job');
      })
      .finally(() => setIsApplying(false));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Toaster position="top-right" />
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Toaster position="top-right" />
        <span className="text-red-600 font-semibold mb-2">{error}</span>
        <Button onClick={() => router.refresh()}>Retry</Button>
      </div>
    );
  }
  if (!job) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Toaster position="top-right" />
        <span className="text-gray-500 mb-2">Job not found.</span>
        <Button onClick={() => router.refresh()}>Reload</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-6 md:py-12">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="flex items-center gap-2 border-[#8F1A27]/20 text-[#8F1A27] hover:bg-[#8F1A27]/5"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
          <h1 className="text-lg md:text-4xl font-extrabold text-[#8F1A27] mb-2">
            Job Details
          </h1>
          <p className="text-lg text-gray-600">
            Explore this opportunity and apply if it's the right fit for you
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Job Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border shadow-sm rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">{job.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Briefcase className="h-4 w-4 text-[#8F1A27]" />
                  <span className="text-gray-600">{job.type.replace('_', ' ')}</span>
                  <Badge className="ml-2 bg-[#8F1A27]/10 text-[#8F1A27] border-[#8F1A27]/20">{job.experienceLevel.replace('_', ' ')}</Badge>
                </CardDescription>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                  <span className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {job.location}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                  {job.salary && (
                    <span className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span className="font-semibold text-green-600">{job.salary}</span>
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-3">Job Description</h3>
                  <p className="text-gray-700 leading-relaxed">{job.description}</p>
                </div>

                <div className="pt-6">
                  <Button 
                    className={`w-full rounded-lg shadow-sm font-medium py-3 ${
                      hasAppliedToJob(job) 
                        ? 'bg-green-600 text-white cursor-not-allowed' 
                        : 'bg-[#8F1A27] text-white hover:bg-[#6D0432]'
                    }`}
                    onClick={handleApply} 
                    disabled={isApplying || hasAppliedToJob(job)}
                  >
                    {isApplying ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Applying...</>
                    ) : hasAppliedToJob(job) ? (
                      'Applied'
                    ) : (
                      'Apply Now'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
        </div>
        {/* Sidebar: Business Info */}
        <div className="space-y-6">
          <Card className="border shadow-sm rounded-2xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-bold text-gray-900">About the Company</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#8F1A27]/10 rounded-full p-2">
                  <Building className="h-5 w-5 text-[#8F1A27]" />
                </div>
                <div>
                  <span className="font-semibold text-gray-900">{job.business.businessName}</span>
                  <p className="text-sm text-gray-600">{job.business.businessType.replace('_', ' ')}</p>
                </div>
              </div>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{job.business.location || 'Location not specified'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{job.business.businessType.replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Posted {new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-semibold text-green-600">{job.salary}</span>
                  </div>
                )}
              </div>
              
              <div className="pt-4 space-y-3">
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Job Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Job Type:</span>
                      <span className="font-medium">{job.type.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Experience Level:</span>
                      <span className="font-medium">{job.experienceLevel.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{job.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Company:</span>
                      <span className="font-medium">{job.business.businessName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Industry:</span>
                      <span className="font-medium">{job.business.businessType.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium text-[#8F1A27]">hr@{job.business.businessName.toLowerCase().replace(/\s+/g, '')}.com</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full mt-4 border-[#8F1A27]/20 text-[#8F1A27] hover:bg-[#8F1A27]/5" 
                asChild
              >
                <Link href={`mailto:hr@${job.business.businessName.toLowerCase().replace(/\s+/g, '')}.com`}>
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Company
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </div>
  );
} 