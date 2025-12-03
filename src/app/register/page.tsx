"use client"

import { useState, useEffect } from 'react'
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { registerStudent, registerBusiness, clearError } from '@/lib/slices/authSlice';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { fetchStudentProfile } from '@/lib/slices/studentsSlice';
import logo from '@/assets/ss.png';
import Image from 'next/image';

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState<"student" | "business">("student")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const [studentData, setStudentData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: 'Letmein@99x!',
    confirmPassword: 'Letmein@99x!',
    major: '',
    year: '',
  })

  const [businessData, setBusinessData] = useState({
    businessName: '',
    email: '',
    password: 'Letmein@99x!',
    confirmPassword: 'Letmein@99x!',
    businessType: '',
    location: '',
  })

  const dispatch = useAppDispatch()
  const router = useRouter()
  const { isLoading, error, isAuthenticated, user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    return () => {
      dispatch(clearError())
    }
  }, [error, dispatch])

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'business') {
        router.push('/business-dashboard');
      } else if (user.role === 'student') {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, user, router]);

  const validateStudentForm = () => {
    const newErrors: { [key: string]: string } = {}
    if (!studentData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!studentData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!studentData.email) newErrors.email = "Email is required"
    if (!studentData.password) newErrors.password = "Password is required"
    if (studentData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
    if (studentData.password !== studentData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    if (!studentData.major) newErrors.major = "Major is required"
    if (!studentData.year) newErrors.year = "Year is required"
    if (!agreedToTerms) newErrors.terms = "You must agree to the terms and conditions"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateBusinessForm = () => {
    const newErrors: { [key: string]: string } = {}
    if (!businessData.businessName.trim()) newErrors.businessName = "Business name is required"
    if (!businessData.email) newErrors.email = "Email is required"
    if (!businessData.password) newErrors.password = "Password is required"
    if (businessData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
    if (businessData.password !== businessData.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    if (!businessData.businessType) newErrors.businessType = "Business type is required"
    if (!businessData.location.trim()) newErrors.location = "Location is required"
    if (!agreedToTerms) newErrors.terms = "You must agree to the terms and conditions"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStudentForm()) return;

    const { confirmPassword, ...registrationData } = studentData;
    try {
      const resultAction = await dispatch(registerStudent({ ...registrationData, agreedToTerms: true })).unwrap();
      console.log('resultAction', resultAction);
      
      // resultAction contains { token, user, student }
      // Check for access token in Redux state and localStorage
      const token = resultAction.token || (typeof window !== 'undefined' ? localStorage.getItem('authToken') : null);
      console.log('token', token);
      
      if (token && resultAction && resultAction.student && resultAction.student.id) {
        router.push(`/students/${resultAction.student.id}`);
        toast.success('Registration successful!');
      } else {
        toast.error('Authentication failed. Please try logging in.');
      }
    } catch (err) {
      // error is handled by Redux and toast in useEffect
    }
  };

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateBusinessForm()) return

    const { confirmPassword, ...registrationData } = businessData
    dispatch(registerBusiness({ ...registrationData, agreedToTerms: true }))
  }

  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setStudentData(prev => ({ ...prev, [name]: value }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleBusinessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBusinessData(prev => ({ ...prev, [name]: value }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    if (activeTab === "student") {
      setStudentData(prev => ({ ...prev, [name]: value }))
    } else {
      setBusinessData(prev => ({ ...prev, [name]: value }))
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-2xl shadow-xl rounded-2xl border-0">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <Image src={logo} alt="App Icon" width={64} height={64} className="mb-2 rounded-full shadow-md" />
          <CardTitle className="text-3xl font-extrabold text-center text-[#8F1A27] tracking-tight">Create Your Account</CardTitle>
          <CardDescription className="text-center">
            Join Student Talent Hub and connect with opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as "student" | "business")} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="business">Faculty</TabsTrigger>
            </TabsList>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <TabsContent value="student" className="space-y-4">
              <form onSubmit={handleStudentSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      value={studentData.firstName}
                      onChange={handleStudentChange}
                      className={errors.firstName ? 'border-red-500' : ''}
                      disabled={isLoading}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500">{errors.firstName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      value={studentData.lastName}
                      onChange={handleStudentChange}
                      className={errors.lastName ? 'border-red-500' : ''}
                      disabled={isLoading}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@university.edu"
                    value={studentData.email}
                    onChange={handleStudentChange}
                    className={errors.email ? 'border-red-500' : ''}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="major">Major</Label>
                    <Select value={studentData.major} onValueChange={(value) => handleSelectChange('major', value)}>
                      <SelectTrigger className={`w-full ${errors.major ? 'border-red-500' : ''}`} >
                        <SelectValue placeholder="Select major" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="COMPUTER_SCIENCE">Computer Science</SelectItem>
                        <SelectItem value="BUSINESS_ADMINISTRATION">Business Administration</SelectItem>
                        <SelectItem value="ELECTRICAL_ENGINEERING">Electrical Engineering</SelectItem>
                        <SelectItem value="MECHANICAL_ENGINEERING">Mechanical Engineering</SelectItem>
                        <SelectItem value="MARKETING">Marketing</SelectItem>
                        <SelectItem value="FINANCE">Finance</SelectItem>
                        <SelectItem value="ECONOMICS">Economics</SelectItem>
                        <SelectItem value="DATA_SCIENCE">Data Science</SelectItem>
                        <SelectItem value="AI">Artificial Intelligence</SelectItem>
                        <SelectItem value="CYBERSECURITY">Cybersecurity</SelectItem>
                        <SelectItem value="NETWORKING">Networking</SelectItem>
                        <SelectItem value="SOFTWARE_ENGINEERING">Software Engineering</SelectItem>
                        <SelectItem value="WEB_DEVELOPMENT">Web Development</SelectItem>
                        <SelectItem value="MOBILE_DEVELOPMENT">Mobile Development</SelectItem>
                        <SelectItem value="GAME_DEVELOPMENT">Game Development</SelectItem>
                        <SelectItem value="GRAPHICS_DESIGN">Graphics Design</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.major && (
                      <p className="text-sm text-red-500">{errors.major}</p>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Select value={studentData.year} onValueChange={(value) => handleSelectChange('year', value)}>
                      <SelectTrigger className={`w-full ${errors.year ? 'border-red-500' : ''}`} >
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FRESHMAN">Freshman</SelectItem>
                        <SelectItem value="SOPHOMORE">Sophomore</SelectItem>
                        <SelectItem value="JUNIOR">Junior</SelectItem>
                        <SelectItem value="SENIOR">Senior</SelectItem>
                        <SelectItem value="GRADUATE">Graduate</SelectItem>
                        <SelectItem value="ALUMNI">Alumni</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.year && (
                      <p className="text-sm text-red-500">{errors.year}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={studentData.password}
                      onChange={handleStudentChange}
                      className={errors.password ? 'border-red-500' : ''}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={studentData.confirmPassword}
                      onChange={handleStudentChange}
                      className={errors.confirmPassword ? 'border-red-500' : ''}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the terms and conditions
                  </Label>
                </div>
                {errors.terms && (
                  <p className="text-sm text-red-500">{errors.terms}</p>
                )}

                <Button type="submit" className="w-full gradient-bg text-white bg-gradient-to-br from-[#8F1A27] via-[#6A0032] to-[#8F1A27] hover:bg-[#8F1A27]/90 rounded-lg shadow-md" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Student Account'
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="business" className="space-y-4">
              <form onSubmit={handleBusinessSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Department Name</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    placeholder="Your Department Name"
                    value={businessData.businessName}
                    onChange={handleBusinessChange}
                    className={errors.businessName ? 'border-red-500' : ''}
                    disabled={isLoading}
                  />
                  {errors.businessName && (
                    <p className="text-sm text-red-500">{errors.businessName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="contact@department.com"
                    value={businessData.email}
                    onChange={handleBusinessChange}
                    className={errors.email ? 'border-red-500' : ''}
                    disabled={isLoading}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessType">Business Type</Label>
                    <Select value={businessData.businessType} onValueChange={(value) => handleSelectChange('businessType', value)}>
                      <SelectTrigger className={errors.businessType ? 'border-red-500' : ''}>
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
                    {errors.businessType && (
                      <p className="text-sm text-red-500">{errors.businessType}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="City, State"
                      value={businessData.location}
                      onChange={handleBusinessChange}
                      className={errors.location ? 'border-red-500' : ''}
                      disabled={isLoading}
                    />
                    {errors.location && (
                      <p className="text-sm text-red-500">{errors.location}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={businessData.password}
                      onChange={handleBusinessChange}
                      className={errors.password ? 'border-red-500' : ''}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={businessData.confirmPassword}
                      onChange={handleBusinessChange}
                      className={errors.confirmPassword ? 'border-red-500' : ''}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the terms and conditions
                  </Label>
                </div>
                {errors.terms && (
                  <p className="text-sm text-red-500">{errors.terms}</p>
                )}

                <Button type="submit" className="w-full gradient-bg text-white bg-gradient-to-br from-[#8F1A27] via-[#6A0032] to-[#8F1A27] hover:bg-[#8F1A27]/90 rounded-lg shadow-md" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Business Account'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/login" className="text-[#8F1A27] hover:underline font-bold">
              Sign in here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
