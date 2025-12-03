"use client"
import { use, useState, useEffect } from "react"
import { toast, Toaster } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MessageSquare, CheckCircle, Briefcase, GraduationCap, MapPin, Clock, Camera, X, Upload, User } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import Servicee from "@/assets/landdd.webp"
import Serviceee from "@/assets/designn.jpg"
import Serviceeee from "@/assets/landd.jpg"
import Design from "@/assets/user.webp"
import Image from "next/image"
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchStudentById, updateStudent } from '@/lib/slices/studentsSlice';
import { AddProjectForm, AddAchievementForm } from "@/components/portfolio-forms"
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import type { Project, Achievement } from '@/lib/slices/studentsSlice';
import { log } from "console"
import EditableSkills from '@/components/EditableSkills';
import apiClient from '@/lib/apiClient';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageSlider from '@/components/ImageSlider';

export default function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { currentStudent: student, isLoading, error } = useAppSelector((state) => state.students);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Check if user is the owner - compare user's studentId with student's id
  const isOwner = user?.studentId === student?.id;
  
  // Only allow editing if user is the owner of the profile
  const canEdit = isOwner;
  
  // Debug: Log ownership status
  console.log('Ownership check:', {
    userStudentId: user?.studentId,
    studentId: student?.id,
    isOwner: isOwner,
    canEdit: canEdit,
    isAuthenticated: isAuthenticated,
    user: user,
    student: student
  });

  // Editable form state
  const [about, setAbout] = useState({
    firstName: student?.firstName || '',
    lastName: student?.lastName || '',
    major: student?.major || '',
    year: student?.year || '',
    bio: student?.bio || '',
  });
  const [skills, setSkills] = useState(student?.skills || []);
  const [projects, setProjects] = useState(student?.projects || []);
  const [achievements, setAchievements] = useState(student?.achievements || []);
  const [projectFile, setProjectFile] = useState<File | null>(null);
  const [achievementFile, setAchievementFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  // Modal state
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [selectedTalent, setSelectedTalent] = useState<any>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [showTalentModal, setShowTalentModal] = useState(false);

  const [talents, setTalents] = useState<any[]>([]);
  const [talentForm, setTalentForm] = useState({ title: '', category: '', description: '', files: [] as File[] });
  const [editingTalent, setEditingTalent] = useState<any>(null);
  const [talentLoading, setTalentLoading] = useState(false);
  const [talentFiles, setTalentFiles] = useState<File[]>([]);

  // Example options for title and category
  const talentTitles = ["Design", "Tutoring", "Research", "Writing", "Development", "Music", "Art", "Digital Marketing","UX/UI Design","Video Editing"];
  const talentCategories = ["Artwork", "DJ", "Business", "Music", "Writing", "Tutoring", "Other","Branding", "Software Development"];

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  // Update the useEffect to properly handle route changes
  useEffect(() => {
    if (id) {
      // Clear previous student data first
      dispatch({ type: 'students/clearCurrentStudent' });
      // Fetch new student data
      dispatch(fetchStudentById(id));
    }
  }, [dispatch, id]); // Add id to dependencies

  // Also add this useEffect to reset form state when student changes
  useEffect(() => {
    if (student) {
      setAbout({
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        major: student.major || '',
        year: student.year || '',
        bio: student.bio || '',
      });
      setSkills(student.skills || []);
      setProjects(student.projects || []);
      setAchievements(student.achievements || []);
    }
  }, [student]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  useEffect(() => {
    if (student?.id) {
      apiClient.patch(`/students/${student.id}/profile-views`).then(() => {
        // Optionally refetch student profile here
        dispatch(fetchStudentById(student.id));
      });
    }
  }, [student?.id, dispatch]);

  // Fetch talents
  useEffect(() => {
    if (student?.id) {
      apiClient.get(`/students/${student.id}/talents`)
        .then(res => {
          const talentsData = Array.isArray(res.data.data) ? res.data.data : [];
          setTalents(talentsData);
        })
        .catch((error) => {
          console.error('Error fetching talents:', error);
          setTalents([]);
        });
    }
  }, [student?.id]);

  const handleAboutChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAbout({ ...about, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'project' | 'achievement') => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'project') setProjectFile(e.target.files[0]);
      else setAchievementFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!student) return;
    setSaving(true);
    // Update about info (ensure we use student.id)
    await dispatch(updateStudent({ id: student.id, data: about }));
    setSaving(false);
    // Optionally, show a toast or feedback here
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  const handleContact = () => {
    toast('Contact feature coming soon!', { icon: '✉️' });
  };
  const handleRequestService = () => {
    toast('Request Service feature coming soon!', { icon: '🛎️' });
  };
  console.log('student', student);
  // Helper to get full file URL
  const getFileUrl = (filePath: string) => {
    if (!filePath) return '';
    if (filePath.startsWith('http')) return filePath;
    return `${process.env.NEXT_PUBLIC_API_URL || ''}${filePath}`;
  };

  const handleTalentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTalentForm({ ...talentForm, [e.target.name]: e.target.value });
  };

  const handleTalentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    const validFiles = files.filter(file => {
      // Allow images, videos, and common document types
      const validTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/webm', 'video/ogg',
        'application/pdf', 'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!validTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported file type`);
        return false;
      }
      
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast.error(`${file.name} is too large. Maximum size is 50MB`);
        return false;
      }
      
      return true;
    });
    
    setTalentFiles(prev => [...prev, ...validFiles]);
    
    // Clear the input value to allow selecting the same file again
    e.target.value = '';
  };

  const removeTalentFile = (index: number) => {
    setTalentFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddTalent = async () => {
    if (!student?.id) return;
    setTalentLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', talentForm.title);
      formData.append('category', talentForm.category);
      formData.append('description', talentForm.description);
      
      // Add files to form data
      talentFiles.forEach((file) => {
        formData.append('files', file);
      });
      
      const response = await apiClient.post(`/students/${student.id}/talents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const res = await apiClient.get(`/students/${student.id}/talents`);
      setTalents(Array.isArray(res.data.data) ? res.data.data : []);
      setTalentForm({ title: '', category: '', description: '', files: [] });
      setTalentFiles([]);
      toast.success('Talent added!');
    } catch (error) {
      console.error('Error adding talent:', error);
      toast.error('Failed to add talent');
    }
    setTalentLoading(false);
  };

  const handleEditTalent = (talent: any) => {
    setEditingTalent(talent);
    setTalentForm({ title: talent.title, category: talent.category, description: talent.description, files: [] });
    // Clear any previously selected files when editing
    setTalentFiles([]);
  };

  const handleUpdateTalent = async () => {
    if (!student?.id || !selectedTalent) return;
    setTalentLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', talentForm.title);
      formData.append('category', talentForm.category);
      formData.append('description', talentForm.description);
      
      // Add files to form data
      talentFiles.forEach((file) => {
        formData.append('files', file);
      });
      
      const response = await apiClient.put(`/students/${student.id}/talents/${selectedTalent.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Refresh talents list
      const res = await apiClient.get(`/students/${student.id}/talents`);
      setTalents(Array.isArray(res.data.data) ? res.data.data : []);
      
      // Reset form and close modal
      setTalentForm({ title: '', category: '', description: '', files: [] });
      setTalentFiles([]);
      setSelectedTalent(null);
      setShowTalentModal(false);
      toast.success('Talent updated!');
    } catch (error) {
      console.error('Error updating talent:', error);
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

  const handleImageUpload = async (file: File) => {
    if (!student?.id) return;
    
    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append('profileImage', file);
    
    try {
      const response = await apiClient.post(`/students/${student.id}/profile-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Refresh student data to get updated profile image
      dispatch(fetchStudentById(student.id));
      toast.success('Profile picture updated successfully!');
      setShowImageUpload(false);
    } catch (error) {
      toast.error('Failed to upload profile picture');
    } finally {
      setIsUploadingImage(false);
    }
  };
 console.log('talentFiles', talentFiles);
 
  const handleDeleteImage = async () => {
    if (!student?.id) return;
    
    try {
      await apiClient.delete(`/students/${student.id}/profile-image`);
      // Refresh student data to get updated profile image
      dispatch(fetchStudentById(student.id));
      toast.success('Profile picture removed successfully!');
    } catch (error) {
      toast.error('Failed to remove profile picture');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      handleImageUpload(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Toaster position="top-right" />
        <svg className="animate-spin h-8 w-8 text-[#6A0032]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
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
  if (!student) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Toaster position="top-right" />
        <span className="text-gray-500 mb-2">Student not found.</span>
        <Button onClick={() => router.refresh()}>Reload</Button>
      </div>
    );
  }

  console.log('isOwner', isOwner);
  

  // Editable form for owner
  // Remove the if (isOwner) block and always use the tabbed layout below

  return (
    <div className="min-h-screen bg-[#F7F4F2] transition-colors duration-700 ease-in-out">
      <div className="px-4 py-8 md:px-10 md:py-10">
        <Toaster position="top-right" />
        {/* Only show Skip to Dashboard button for owner */}
        {canEdit && (
          <Button className="absolute right-10 top-17" variant="outline" onClick={handleSkip}>Skip to Dashboard</Button>
        )}
        
        <div className="grid gap-8 lg:grid-cols-3 mt-1">
          {/* Student Profile Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl">
              <CardContent className="p-8">
                {/* Update the profile image section in the sidebar */}
                <div className="flex flex-col items-center text-center">
                  <div className="relative group">
                    <div className="h-28 w-28 border-4 border-white shadow-lg rounded-full overflow-hidden bg-[#8F1A27] flex items-center justify-center">
                      {student.profileImage ? (
                        <Image
                          src={getFileUrl(student.profileImage)}
                          alt={`${student.firstName} ${student.lastName}`}
                          width={112}
                          height={112}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            try {
                              // Fallback to initials if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.parentElement?.querySelector('[data-fallback]') as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            } catch (error) {
                              // Silent fallback - just hide the image
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }
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
                        className={`text-xl font-bold text-white ${student.profileImage ? 'hidden' : 'flex'} items-center justify-center`}
                        data-fallback
                        style={{ display: student.profileImage ? 'none' : 'flex' }}
                      >
                        {student.firstName?.[0]}{student.lastName?.[0]}
                      </div>
                    </div>
                    
                    {/* Image upload overlay - only show for owner */}
                    {canEdit && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white"
                            onClick={() => setShowImageUpload(true)}
                          >
                            <Camera className="h-4 w-4 text-gray-700" />
                          </Button>
                          {student.profileImage && (
                            <Button
                              size="sm"
                              variant="destructive"
                              className="h-8 w-8 p-0 rounded-full bg-red-500/90 hover:bg-red-600"
                              onClick={handleDeleteImage}
                            >
                              <X className="h-4 w-4 text-white" />
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Profile image upload dialog */}
                  <Dialog open={showImageUpload} onOpenChange={setShowImageUpload}>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Update Profile Picture</DialogTitle>
                        <DialogDescription>
                          Choose a new profile picture. Supported formats: JPG, PNG, GIF. Max size: 5MB.
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="space-y-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#8F1A27] transition-colors relative">
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-sm text-gray-600 mb-2">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 5MB
                          </p>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={isUploadingImage}
                          />
                        </div>
                        
                        {isUploadingImage && (
                          <div className="flex items-center justify-center py-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#8F1A27]"></div>
                            <span className="ml-2 text-sm text-gray-600">Uploading...</span>
                          </div>
                        )}
                        
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setShowImageUpload(false)}
                            disabled={isUploadingImage}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <h1 className="mt-6 text-xl font-bold text-[#8F1A27]">{student.firstName} {student.lastName}</h1>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <GraduationCap className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-600 font-medium">
                      {student.major}, {student.year}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">{student.user?.email}</span>
                  </div>
                  <div className="mt-8 grid w-full grid-cols-2 gap-4">
                    <Button className="bg-[#8F1A27] hover:bg-[#6D0432] text-white font-semibold" onClick={handleContact}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Contact
                    </Button>
                    <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-gray-50">View Resume</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-gray-800">About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed text-sm">{student.bio || "No bio available."}</p>
              </CardContent>
            </Card>

            {/* <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-gray-800">About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{student.about || "No description available."}</p>
              </CardContent>
            </Card> */}

            <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-gray-800">Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {student.skills && student.skills.length > 0 ? (
                  student.skills.map((skill, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">{skill.name}</span>
                      <Badge variant="secondary" className="text-xs">{skill.proficiency}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 py-4">No skills added yet.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue={canEdit ? "talents" : "portfolio"} className="space-y-8">
              {/* Update the TabsList to show correct number of tabs */}
              <TabsList className="inline-flex w-auto bg-gradient-to-r from-gray-50 via-white to-gray-50 border border-gray-200 shadow-lg rounded-xl p-1 backdrop-blur-sm">
                {canEdit && (
                  <>
                    <TabsTrigger value="about" className="text-sm font-medium text-gray-600 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8F1A27] data-[state=active]:to-[#6D0432] data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg py-2 px-4 data-[state=active]:font-semibold hover:bg-gray-100">About</TabsTrigger>
                    <TabsTrigger value="skills" className="text-sm font-medium text-gray-600 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8F1A27] data-[state=active]:to-[#6D0432] data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg py-2 px-4 data-[state=active]:font-semibold hover:bg-gray-100">Skills</TabsTrigger>
                  </>
                )}
                <TabsTrigger value="portfolio" className="text-sm font-medium text-gray-600 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8F1A27] data-[state=active]:to-[#6D0432] data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg py-2 px-4 data-[state=active]:font-semibold hover:bg-gray-100">Portfolio</TabsTrigger>
                <TabsTrigger value="achievements" className="text-sm font-medium text-gray-600 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8F1A27] data-[state=active]:to-[#6D0432] data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg py-2 px-4 data-[state=active]:font-semibold hover:bg-gray-100">Achievements</TabsTrigger>
                <TabsTrigger value="talents" className="text-sm font-medium text-gray-600 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8F1A27] data-[state=active]:to-[#6D0432] data-[state=active]:text-white data-[state=active]:shadow-md rounded-lg py-2 px-4 data-[state=active]:font-semibold hover:bg-gray-100">Talents</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6">
                <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold text-gray-900">About</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <Input name="firstName" value={about.firstName} onChange={handleAboutChange} placeholder="First Name" disabled className={!canEdit ? 'text-gray-900 bg-white border-gray-300 opacity-100 cursor-not-allowed' : 'border-gray-200 focus:ring-2 focus:ring-[#8F1A27]/30'} />
                      <Input name="lastName" value={about.lastName} onChange={handleAboutChange} placeholder="Last Name" disabled className={!canEdit ? 'text-gray-900 bg-white border-gray-300 opacity-100 cursor-not-allowed' : 'border-gray-200 focus:ring-2 focus:ring-[#8F1A27]/30'} />
                      <Input name="major" value={about.major} onChange={handleAboutChange} placeholder="Major" disabled={!canEdit} className={!canEdit ? 'text-gray-900 bg-white border-gray-300 opacity-100 cursor-not-allowed' : 'border-gray-200 focus:ring-2 focus:ring-[#8F1A27]/30'} />
                      <Input name="year" value={about.year} onChange={handleAboutChange} placeholder="Year" disabled={!canEdit} className={!canEdit ? 'text-gray-900 bg-white border-gray-300 opacity-100 cursor-not-allowed' : 'border-gray-200 focus:ring-2 focus:ring-[#8F1A27]/30'} />
                    </div>
                                          <Textarea name="bio" value={about.bio} onChange={handleAboutChange} placeholder="Tell us about yourself..." rows={4} disabled={!canEdit} className={!canEdit ? 'text-gray-900 bg-white border-gray-300 opacity-100 cursor-not-allowed' : 'border-gray-200 focus:ring-2 focus:ring-[#8F1A27]/30'} />
                    {canEdit && (
                      <div className="flex justify-end mt-6">
                        <Button onClick={handleSave} disabled={saving} className="bg-[#8F1A27] hover:bg-[#6D0432] text-white font-semibold">{saving ? 'Saving...' : 'Save Changes'}</Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills" className="space-y-6">
                <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold text-gray-800">Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <EditableSkills studentId={student.id} skills={skills || []} disabled={!canEdit} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="portfolio" className="space-y-6">
                {/* Projects Section Only */}
                <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold text-[#8F1A27] border-b border-gray-200 pb-4">Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 mb-4">
                      {student.projects && student.projects.length > 0 ? (
                        student.projects.map((project, index) => (
                          <Card key={index} className="overflow-hidden cursor-pointer hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 border-0 bg-white/90 backdrop-blur-sm group relative" onClick={() => { setSelectedProject(project); setShowProjectModal(true); }}>
                            {/* Subtle gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-gray-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            
                            {/* Project Images Slider */}
                            {project.images && project.images.length > 0 ? (
                              <div className="relative overflow-hidden">
                                <ImageSlider
                                  images={project.images.map(img => getFileUrl(img))}
                                  alt={project.title}
                                  className="w-full h-56"
                                  autoPlay={true}
                                  interval={4000}
                                  showControls={false}
                                  showDots={true}
                                  showCounter={true}
                                />
                                {/* Subtle overlay for better text readability */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
                              </div>
                            ) : (
                              // Clean placeholder for projects without images
                              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 h-56 flex items-center justify-center overflow-hidden">
                                {/* Minimal decorative elements */}
                                <div className="absolute top-4 right-4 w-3 h-3 bg-[#8F1A27]/20 rounded-full" />
                                <div className="absolute bottom-4 left-4 w-2 h-2 bg-[#8F1A27]/30 rounded-full" />
                                
                                <div className="relative text-center z-10">
                                  <div className="w-14 h-14 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                  </div>
                                  <p className="text-gray-500 text-sm font-medium">No preview available</p>
                                </div>
                              </div>
                            )}
                            
                            <CardHeader className="p-4">
                              <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-[#8F1A27] transition-colors duration-300 flex items-center gap-2">
                                <span>{project.title}</span>
                                <div className="w-2 h-2 bg-emerald-500 rounded-full" title="Active project" />
                              </CardTitle>
                            </CardHeader>
                            
                            <CardContent className="p-4 pt-0">
                              <p className="text-gray-600 leading-relaxed line-clamp-3 mb-3 text-sm">{project.description}</p>
                              
                              {/* View Button */}
                              <div className="flex items-center justify-end">
                                <Button 
                                  variant="ghost"
                                  className="text-[#8F1A27] hover:text-white hover:bg-[#8F1A27] transition-all duration-200 font-medium px-5 py-2 rounded-lg"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedProject(project);
                                    setShowProjectModal(true);
                                  }}
                                >
                                  View Project
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <p className="text-gray-500 py-4">No projects added yet.</p>
                      )}
                    </div>
                    {/* Add Project Form */}
                    {canEdit && <AddProjectForm studentId={student.id} onSuccess={() => dispatch(fetchStudentById(student.id))} disabled={!canEdit} />}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements" className="space-y-6">
                {/* Achievements Section */}
                <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold text-[#8F1A27] border-b border-gray-200 pb-4">Achievements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 mb-4">
                      {student.achievements && student.achievements.length > 0 ? (
                        student.achievements.map((achievement, index) => (
                          <Card key={index} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow border border-gray-200 bg-white" onClick={() => { setSelectedAchievement(achievement); setShowAchievementModal(true); }}>
                            <CardHeader className="p-4">
                              <CardTitle className="text-lg font-semibold text-gray-900">{achievement.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <p className="text-gray-600 leading-relaxed">{achievement.description}</p>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <p className="text-gray-500 py-4">No achievements added yet.</p>
                      )}
                    </div>
                    {/* Add Achievement Form */}
                    {canEdit && <AddAchievementForm studentId={student.id} onSuccess={() => dispatch(fetchStudentById(student.id))} disabled={!canEdit} />}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="talents" className="space-y-6">
                <Card className="bg-white border border-gray-200 shadow-sm rounded-2xl">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold text-[#8F1A27] border-b border-gray-200 pb-4">Talents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(!Array.isArray(talents) || talents.length === 0) && <p className="text-gray-500 text-center py-8">No talents added yet.</p>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Array.isArray(talents) && talents.map((talent) => (
                        <div key={talent.id} className="border border-gray-200 rounded-xl p-6 bg-white cursor-pointer hover:shadow-lg transition-shadow" onClick={() => { 
                          setSelectedTalent(talent); 
                          setTalentForm({ title: talent.title, category: talent.category, description: talent.description, files: [] });
                          setTalentFiles([]);
                          setShowTalentModal(true); 
                        }}> 
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                          <div className="flex-1">
                            <div className="font-semibold text-lg text-gray-900">{talent.title}</div>
                            <div className="text-xs text-gray-500 mb-2">{talent.category}</div>
                            <div className="text-gray-600 mb-4">{talent.description}</div>
                            
                            {/* Image Slider for Files */}
                            {talent.files && (Array.isArray(talent.files) ? talent.files.length > 0 : talent.files) && (
                              <div className="mt-4">
                                <div className="relative group">
                                  {/* Main Image/Video Display */}
                                  <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden">
                                    {(() => {
                                      const files = Array.isArray(talent.files) ? talent.files : [talent.files];
                                      const images = files.filter((file: any) => file.match(/\.(jpg|jpeg|png|gif|webp)$/i));
                                      const videos = files.filter((file: any) => file.match(/\.(mp4|webm|ogg|mov)$/i));
                                      
                                      // Show first video if available, otherwise show first image
                                      if (videos.length > 0) {
                                        const fileUrl = getFileUrl(videos[0]);
                                        console.log('Video URL:', fileUrl);
                                        return (
                                          <video
                                            src={fileUrl}
                                            controls
                                            preload="metadata"
                                            controlsList="nodownload"
                                            className="w-full h-full object-cover"
                                            onError={(e) => console.error('Video error:', e)}
                                            onLoadStart={() => console.log('Video loading started')}
                                            onCanPlay={() => console.log('Video can play')}
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
                                            height={200}
                                            className="w-full h-full object-cover"
                                          />
                                        );
                                      }
                                      return null;
                                    })()}
                                    
                                    {/* Overlay with file count */}
                                    {(Array.isArray(talent.files) ? talent.files : [talent.files])
                                      .filter((file: any) => file.match(/\.(jpg|jpeg|png|gif|webp)$/i)).length > 1 && (
                                      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
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
                                          <div className="absolute top-2 left-2 bg-black/50 text-white p-1 rounded-full backdrop-blur-sm">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
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
                                      <div className="absolute bottom-2 left-2 bg-blue-500 text-white p-1 rounded-full backdrop-blur-sm">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* File count badge */}
                                  <div className="absolute bottom-2 right-2 bg-white/90 text-gray-700 text-xs px-2 py-1 rounded-full shadow-sm">
                                    {(Array.isArray(talent.files) ? talent.files : [talent.files]).length} files
                                  </div>
                                  
                                  {/* Hover overlay */}
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-lg flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                      <div className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                                        Click to view all files
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        {canEdit && (
                            <div className="flex gap-2 mt-4 md:mt-4 border-t pt-4 justify-end">
                              <Button size="sm" variant="outline" onClick={() => handleEditTalent(talent)} className="border-gray-200 text-gray-700 hover:bg-gray-50">Edit</Button>
                              <Button size="sm" variant="destructive" onClick={() => handleDeleteTalent(talent.id)} className="bg-red-600 hover:bg-red-700">Delete</Button>
                            </div>
                          )}
                            </div>
                      ))}
                    </div>
                    {/* Add Talent Form */}
                    {canEdit && (
                      <div className="mt-8 p-6  rounded-xl border border-gray-200">
                        <h3 className="font-semibold mb-4 text-gray-900">{editingTalent ? 'Edit Talent' : 'Add Talent'}</h3>
                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                          <Select value={talentForm.title} onValueChange={val => setTalentForm(f => ({ ...f, title: val }))}>
                            <SelectTrigger className="w-full md:w-1/3 border-gray-200 focus:ring-2 focus:ring-[#8F1A27]/30">
                              <SelectValue placeholder="Title" />
                            </SelectTrigger>
                            <SelectContent>
                              {talentTitles.map(title => (
                                <SelectItem key={title} value={title}>{title}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select value={talentForm.category} onValueChange={val => setTalentForm(f => ({ ...f, category: val }))}>
                            <SelectTrigger className="w-full md:w-1/3 border-gray-200 focus:ring-2 focus:ring-[#8F1A27]/30">
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                              {talentCategories.map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Textarea
                          name="description"
                          value={talentForm.description}
                          onChange={handleTalentChange}
                          placeholder="Description"
                          rows={3}
                          className="mb-4 border-gray-200 focus:ring-2 focus:ring-[#8F1A27]/30"
                        />
                        
                        {/* File Upload Section */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Attach Files (Images, Videos, Documents)
                          </label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#8F1A27] transition-colors">
                            <input
                              type="file"
                              multiple
                              accept="image/*,video/*,.pdf,.doc,.docx"
                              onChange={handleTalentFileChange}
                              className="hidden"
                              id="talent-file-upload"
                              onClick={(e) => console.log('Add talent file input clicked')}
                            />
                            <label htmlFor="talent-file-upload" className="cursor-pointer block">
                              <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a2 2 0 011 3.72M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <p className="text-sm text-gray-600">
                                Click to upload files or drag and drop
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Supports: Images, Videos, PDFs, Documents (Max 50MB each)
                              </p>
                            </label>
                          </div>
                          
                          {/* File Preview */}
                          {talentFiles.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
                              <div className="space-y-2">
                                {talentFiles.map((file, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                      <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                      <span className="text-xs text-gray-500">
                                        ({(file.size / 1024 / 1024).toFixed(1)}MB)
                                      </span>
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeTalentFile(index)}
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                      </svg>
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-3">
                          {editingTalent ? (
                            <>
                              <Button onClick={handleUpdateTalent} disabled={talentLoading || !talentForm.title || !talentForm.category || !talentForm.description} className="bg-[#8F1A27] hover:bg-[#6D0432] text-white font-semibold">
                                {talentLoading ? 'Updating...' : 'Update Talent'}
                              </Button>
                              <Button variant="outline" onClick={() => { setEditingTalent(null); setTalentForm({ title: '', category: '', description: '', files: [] }); setTalentFiles([]); }} className="border-gray-200 text-gray-700 hover:bg-gray-50">
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <Button onClick={handleAddTalent} disabled={talentLoading || !talentForm.title || !talentForm.category || !talentForm.description} className="bg-[#8F1A27] hover:bg-[#6D0432] text-white font-semibold px-10">
                              {talentLoading ? 'Adding...' : 'Add Talent'}
                            </Button>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
                </div>
      </div>
      {/* Project Modal */}
      <Dialog open={showProjectModal} onOpenChange={setShowProjectModal}>
        <DialogContent className="max-w-5xl w-full max-h-[80vh] overflow-y-auto flex flex-col items-center justify-center">
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 w-full pb-2 pt-2 px-2 border-b border-gray-200 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle>{selectedProject ? selectedProject.title : ''}</DialogTitle>
              <DialogDescription>{selectedProject ? selectedProject.description : ''}</DialogDescription>
            </DialogHeader>
          </div>
          {selectedProject && selectedProject.images && Array.isArray(selectedProject.images) && selectedProject.images.length > 0 && (
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
                            className="w-full max-h-48 object-contain rounded shadow hover:opacity-80 transition bg-white"
                            width={300}
                            height={192}
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
                      .map((img, i) =>
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
        </DialogContent>
      </Dialog>
      {/* Achievement Modal */}
      <Dialog open={showAchievementModal} onOpenChange={setShowAchievementModal}>
        <DialogContent className="max-w-3xl w-full max-h-[80vh] overflow-y-auto flex flex-col items-center justify-center">
          <div className="w-full flex items-start justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-2 pt-4 px-2 mb-4">
            <div>
              <DialogTitle>{selectedAchievement ? selectedAchievement.title : ''}</DialogTitle>
              <DialogDescription>{selectedAchievement ? selectedAchievement.description : ''}</DialogDescription>
            </div>
            <DialogClose asChild>
              <button aria-label="Close" className="text-2xl font-bold leading-none hover:text-red-500 focus:outline-none">×</button>
            </DialogClose>
          </div>
          {selectedAchievement && selectedAchievement.files && Array.isArray(selectedAchievement.files) && selectedAchievement.files.length > 0 && (
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
                            className="w-full max-h-48 object-contain rounded shadow hover:opacity-80 transition bg-white"
                            width={300}
                            height={192}
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
        </DialogContent>
      </Dialog>

      {/* Talent Modal */}
      <Dialog open={showTalentModal} onOpenChange={setShowTalentModal}>
        <DialogContent className="max-w-5xl w-full max-h-[80vh] overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 w-full pb-2 pt-2 px-2 border-b border-gray-200 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900">
                {selectedTalent ? selectedTalent.title : ''}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {selectedTalent ? selectedTalent.category : ''}
              </DialogDescription>
            </DialogHeader>
          </div>
          
          {selectedTalent && (
            <div className="p-6">
              {/* Talent Details */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed">{selectedTalent.description}</p>
              </div>

              {/* Files Section */}
              {selectedTalent.files && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Attached Files</h3>
                  

                  
                                     {(() => {
                     // Handle different possible file storage formats
                     let files: string[] = [];
                     
                     if (selectedTalent.files) {
                       if (Array.isArray(selectedTalent.files)) {
                         files = selectedTalent.files;
                       } else if (typeof selectedTalent.files === 'string') {
                         files = [selectedTalent.files];
                       } else if (typeof selectedTalent.files === 'object' && selectedTalent.files !== null) {
                         // Handle case where files might be stored as an object
                         files = Object.values(selectedTalent.files).filter((file: any) => typeof file === 'string');
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
                           <p className="text-xs text-gray-400 mt-2">Upload files using the edit form below</p>
                         </div>
                       );
                     }
                    
                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {validFiles.map((file: string, fileIndex: number) => {
                          const fileUrl = getFileUrl(file);
                          const isImage = file.match(/\.(jpg|jpeg|png|gif|webp)$/i);
                          const isVideo = file.match(/\.(mp4|webm|ogg|mov)$/i);
                          const isDocument = file.match(/\.(pdf|doc|docx)$/i);
                          
                          return (
                            <div key={fileIndex} className="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors">
                              {isImage ? (
                                <div className="space-y-2">
                                  <Image
                                    src={fileUrl}
                                    alt={`${selectedTalent.title} file ${fileIndex + 1}`}
                                    width={200}
                                    height={150}
                                    className="w-full h-32 object-cover rounded-md"
                                  />
                                  <p className="text-xs text-gray-600 truncate">{file.split('/').pop()}</p>
                                </div>
                              ) : isVideo ? (
                                <div className="space-y-2">
                                  <video
                                    src={fileUrl}
                                    controls
                                    preload="metadata"
                                    controlsList="nodownload"
                                    className="w-full h-48 object-cover rounded-md"
                                    style={{ maxHeight: '200px' }}
                                    onError={(e) => console.error('Modal video error:', e)}
                                    onLoadStart={() => console.log('Modal video loading started:', fileUrl)}
                                    onCanPlay={() => console.log('Modal video can play')}
                                    crossOrigin="anonymous"
                                    muted
                                  >
                                    <source src={fileUrl} type="video/mp4" />
                                    <source src={fileUrl} type="video/webm" />
                                    <source src={fileUrl} type="video/ogg" />
                                    Your browser does not support the video tag.
                                  </video>
                                  <p className="text-xs text-gray-600 truncate">{file.split('/').pop()}</p>
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <div className="w-full h-32 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-md flex items-center justify-center">
                                    <div className="text-center">
                                      <svg className="w-8 h-8 mx-auto text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                      <p className="text-xs text-blue-600 font-medium">
                                        {isDocument ? 'Document' : 'File'}
                                      </p>
                                    </div>
                                  </div>
                                  <p className="text-xs text-gray-600 truncate">{file.split('/').pop()}</p>
                                </div>
                              )}
                              <div className="flex justify-between items-center mt-2">
                                <a
                                  href={fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-[#8F1A27] hover:text-[#6D0432] font-medium"
                                >
                                  View
                                </a>
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

              {/* Edit Section (for owners) */}
              {canEdit && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Talent</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input
                          type="text"
                          value={talentForm.title}
                          onChange={(e) => setTalentForm({ ...talentForm, title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8F1A27]/30"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select
                          value={talentForm.category}
                          onChange={(e) => setTalentForm({ ...talentForm, category: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8F1A27]/30"
                        >
                          <option value="">Select Category</option>
                          {talentCategories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                      <textarea
                        value={talentForm.description}
                        onChange={(e) => setTalentForm({ ...talentForm, description: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8F1A27]/30"
                      />
                    </div>

                    {/* File Upload Section */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Add New Files (Images, Videos, Documents)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#8F1A27] transition-colors">
                        <input
                          type="file"
                          multiple
                          accept="image/*,video/*,.pdf,.doc,.docx"
                          onChange={handleTalentFileChange}
                          className="hidden"
                          id="talent-modal-file-upload"
                          onClick={(e) => console.log('File input clicked')}
                        />
                        <label htmlFor="talent-modal-file-upload" className="cursor-pointer block">
                          <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a2 2 0 011 3.72M15 13l-3-3m3-3v12" />
                          </svg>
                          <p className="text-sm text-gray-600">
                            Click to upload files or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Supports: Images, Videos, PDFs, Documents (Max 50MB each)
                          </p>
                        </label>
                      </div>
                      
                      {/* File Preview */}
                      {talentFiles.length > 0 && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">New Files to Add:</h4>
                          <div className="space-y-2">
                            {talentFiles.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-2">
                                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  <span className="text-sm text-gray-700 truncate">{file.name}</span>
                                  <span className="text-xs text-gray-500">
                                    ({(file.size / 1024 / 1024).toFixed(1)}MB)
                                  </span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeTalentFile(index)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button 
                        onClick={handleUpdateTalent}
                        disabled={talentLoading || !talentForm.title || !talentForm.category || !talentForm.description}
                        className="bg-[#8F1A27] hover:bg-[#6D0432] text-white font-semibold"
                      >
                        {talentLoading ? 'Updating...' : 'Update Talent'}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setShowTalentModal(false);
                          setSelectedTalent(null);
                          setTalentForm({ title: '', category: '', description: '', files: [] });
                          setTalentFiles([]);
                        }}
                        className="border-gray-200 text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
