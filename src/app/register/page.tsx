"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { registerStudent, registerBusiness, clearError } from "@/lib/slices/authSlice"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { AuthFormShell, AuthFooterLink } from "@/components/auth-form-shell"

function PasswordField({
  id,
  name,
  label,
  value,
  onChange,
  show,
  onToggle,
  error,
  disabled,
  placeholder,
}: {
  id: string
  name: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  show: boolean
  onToggle: () => void
  error?: string
  disabled?: boolean
  placeholder?: string
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={error ? "border-red-500 pr-10" : "pr-10"}
          disabled={disabled}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
          onClick={onToggle}
          disabled={disabled}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}

export default function RegisterPage() {
  const [activeTab, setActiveTab] = useState<"student" | "business">("student")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [studentData, setStudentData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    major: "",
    year: "",
  })

  const [businessData, setBusinessData] = useState({
    businessName: "",
    email: "",
    password: "",
    confirmPassword: "",
    businessType: "",
    location: "",
  })

  const dispatch = useAppDispatch()
  const router = useRouter()
  const { isLoading, error, isAuthenticated, user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (error) toast.error(error)
    return () => {
      dispatch(clearError())
    }
  }, [error, dispatch])

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "business") router.push("/business-dashboard")
      else if (user.role === "student") router.push("/dashboard")
    }
  }, [isAuthenticated, user, router])

  const validateStudentForm = () => {
    const newErrors: Record<string, string> = {}
    if (!studentData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!studentData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!studentData.email) newErrors.email = "Email is required"
    if (!studentData.password) newErrors.password = "Password is required"
    if (studentData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
    if (studentData.password !== studentData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match"
    if (!studentData.major) newErrors.major = "Major is required"
    if (!studentData.year) newErrors.year = "Year is required"
    if (!agreedToTerms) newErrors.terms = "You must agree to the terms"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateBusinessForm = () => {
    const newErrors: Record<string, string> = {}
    if (!businessData.businessName.trim()) newErrors.businessName = "Department name is required"
    if (!businessData.email) newErrors.email = "Email is required"
    if (!businessData.password) newErrors.password = "Password is required"
    if (businessData.password.length < 6) newErrors.password = "Password must be at least 6 characters"
    if (businessData.password !== businessData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match"
    if (!businessData.businessType) newErrors.businessType = "Business type is required"
    if (!businessData.location.trim()) newErrors.location = "Location is required"
    if (!agreedToTerms) newErrors.terms = "You must agree to the terms"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStudentForm()) return
    const { confirmPassword, ...registrationData } = studentData
    try {
      const resultAction = await dispatch(
        registerStudent({ ...registrationData, agreedToTerms: true })
      ).unwrap()
      const token =
        resultAction.token ||
        (typeof window !== "undefined" ? localStorage.getItem("authToken") : null)
      if (token && resultAction?.student?.id) {
        router.push(`/students/${resultAction.student.id}`)
        toast.success("Registration successful!")
      } else {
        toast.error("Authentication failed. Please try logging in.")
      }
    } catch {
      /* handled by Redux */
    }
  }

  const handleBusinessSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateBusinessForm()) return
    const { confirmPassword, ...registrationData } = businessData
    dispatch(registerBusiness({ ...registrationData, agreedToTerms: true }))
  }

  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setStudentData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleBusinessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBusinessData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleSelectChange = (name: string, value: string) => {
    if (activeTab === "student") setStudentData((prev) => ({ ...prev, [name]: value }))
    else setBusinessData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const submitClass =
    "w-full bg-[color:var(--vt-teal-700)] text-white hover:bg-[color:var(--vt-teal-600)]"

  return (
    <AuthFormShell
      wide
      title="Create your account"
      subtitle="Join VeriTalent as a student or business partner."
      footer={
        <AuthFooterLink text="Already have an account?" linkText="Sign in" href="/login" />
      }
    >
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "student" | "business")}
        className="w-full"
      >
        <TabsList className="mb-5 grid w-full grid-cols-2">
          <TabsTrigger value="student">Student</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
        </TabsList>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <TabsContent value="student" className="mt-0">
          <form onSubmit={handleStudentSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={studentData.firstName}
                  onChange={handleStudentChange}
                  className={errors.firstName ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={studentData.lastName}
                  onChange={handleStudentChange}
                  className={errors.lastName ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="student-email">Email</Label>
              <Input
                id="student-email"
                name="email"
                type="email"
                value={studentData.email}
                onChange={handleStudentChange}
                className={errors.email ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Major</Label>
                <Select
                  value={studentData.major}
                  onValueChange={(v) => handleSelectChange("major", v)}
                >
                  <SelectTrigger className={errors.major ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select major" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COMPUTER_SCIENCE">Computer Science</SelectItem>
                    <SelectItem value="BUSINESS_ADMINISTRATION">Business Administration</SelectItem>
                    <SelectItem value="ELECTRICAL_ENGINEERING">Electrical Engineering</SelectItem>
                    <SelectItem value="MECHANICAL_ENGINEERING">Mechanical Engineering</SelectItem>
                    <SelectItem value="MARKETING">Marketing</SelectItem>
                    <SelectItem value="FINANCE">Finance</SelectItem>
                    <SelectItem value="DATA_SCIENCE">Data Science</SelectItem>
                    <SelectItem value="SOFTWARE_ENGINEERING">Software Engineering</SelectItem>
                  </SelectContent>
                </Select>
                {errors.major && <p className="text-sm text-red-500">{errors.major}</p>}
              </div>
              <div className="space-y-2">
                <Label>Year</Label>
                <Select value={studentData.year} onValueChange={(v) => handleSelectChange("year", v)}>
                  <SelectTrigger className={errors.year ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FRESHMAN">Freshman</SelectItem>
                    <SelectItem value="SOPHOMORE">Sophomore</SelectItem>
                    <SelectItem value="JUNIOR">Junior</SelectItem>
                    <SelectItem value="SENIOR">Senior</SelectItem>
                    <SelectItem value="GRADUATE">Graduate</SelectItem>
                  </SelectContent>
                </Select>
                {errors.year && <p className="text-sm text-red-500">{errors.year}</p>}
              </div>
            </div>

            <PasswordField
              id="student-password"
              name="password"
              label="Password"
              value={studentData.password}
              onChange={handleStudentChange}
              show={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
              error={errors.password}
              disabled={isLoading}
            />
            <PasswordField
              id="student-confirm"
              name="confirmPassword"
              label="Confirm password"
              value={studentData.confirmPassword}
              onChange={handleStudentChange}
              show={showConfirmPassword}
              onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
              error={errors.confirmPassword}
              disabled={isLoading}
            />

            <div className="flex items-center gap-2">
              <Checkbox
                id="student-terms"
                checked={agreedToTerms}
                onCheckedChange={(c) => setAgreedToTerms(c === true)}
                disabled={isLoading}
              />
              <Label htmlFor="student-terms" className="text-sm font-normal">
                I agree to the terms and conditions
              </Label>
            </div>
            {errors.terms && <p className="text-sm text-red-500">{errors.terms}</p>}

            <Button type="submit" className={submitClass} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="business" className="mt-0">
          <form onSubmit={handleBusinessSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Department name</Label>
              <Input
                id="businessName"
                name="businessName"
                value={businessData.businessName}
                onChange={handleBusinessChange}
                className={errors.businessName ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.businessName && (
                <p className="text-sm text-red-500">{errors.businessName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="business-email">Email</Label>
              <Input
                id="business-email"
                name="email"
                type="email"
                value={businessData.email}
                onChange={handleBusinessChange}
                className={errors.email ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Business type</Label>
                <Select
                  value={businessData.businessType}
                  onValueChange={(v) => handleSelectChange("businessType", v)}
                >
                  <SelectTrigger className={errors.businessType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TECHNOLOGY">Technology</SelectItem>
                    <SelectItem value="CONSULTING">Consulting</SelectItem>
                    <SelectItem value="HEALTHCARE">Healthcare</SelectItem>
                    <SelectItem value="FINANCE">Finance</SelectItem>
                    <SelectItem value="EDUCATION">Education</SelectItem>
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
                  value={businessData.location}
                  onChange={handleBusinessChange}
                  className={errors.location ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.location && <p className="text-sm text-red-500">{errors.location}</p>}
              </div>
            </div>

            <PasswordField
              id="business-password"
              name="password"
              label="Password"
              value={businessData.password}
              onChange={handleBusinessChange}
              show={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
              error={errors.password}
              disabled={isLoading}
            />
            <PasswordField
              id="business-confirm"
              name="confirmPassword"
              label="Confirm password"
              value={businessData.confirmPassword}
              onChange={handleBusinessChange}
              show={showConfirmPassword}
              onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
              error={errors.confirmPassword}
              disabled={isLoading}
            />

            <div className="flex items-center gap-2">
              <Checkbox
                id="business-terms"
                checked={agreedToTerms}
                onCheckedChange={(c) => setAgreedToTerms(c === true)}
                disabled={isLoading}
              />
              <Label htmlFor="business-terms" className="text-sm font-normal">
                I agree to the terms and conditions
              </Label>
            </div>
            {errors.terms && <p className="text-sm text-red-500">{errors.terms}</p>}

            <Button type="submit" className={submitClass} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </AuthFormShell>
  )
}
