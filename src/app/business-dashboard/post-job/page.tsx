"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft, CheckCircle } from "lucide-react"

export default function PostJobPage() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState<{
    title: string
    category: string
    description: string
    skills: string[]
    budgetType: string
    budgetMin: string
    budgetMax: string
    timeline: string
    visibility: string
  }>({
    title: "",
    category: "",
    description: "",
    skills: [],
    budgetType: "fixed",
    budgetMin: "",
    budgetMax: "",
    timeline: "",
    visibility: "public",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="container max-w-3xl px-4 py-12">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl">Job Posted Successfully!</CardTitle>
            <CardDescription className="text-center">
              Your job has been posted and is now visible to qualified students
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="font-medium">{formData.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {formData.budgetType === "fixed"
                  ? `Fixed Price: $${formData.budgetMin}`
                  : `Budget Range: $${formData.budgetMin} - $${formData.budgetMax}`}
              </p>
            </div>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>What happens next?</AlertTitle>
              <AlertDescription>
                Students will now be able to view your job posting and submit applications. You'll receive notifications
                when new applications arrive.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/business-dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Dashboard
              </Link>
            </Button>
            <Button className="w-full sm:w-auto bg-cmu-maroon hover:bg-cmu-dark" asChild>
              <Link href="/business-dashboard/jobs">View All Job Postings</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-3xl px-4 py-12">
      <div className="mb-8">
        <Button variant="ghost" size="sm" className="mb-2" asChild>
          <Link href="/business-dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Post a New Job</h1>
        <p className="text-muted-foreground">Find the perfect student for your project</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>Provide basic information about the job you're posting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., UI/UX Designer for Mobile App"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                    required
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="writing">Writing & Translation</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe the job, requirements, and expectations..."
                    className="min-h-[150px]"
                    value={formData.description}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Required Skills</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "UI/UX Design",
                      "Graphic Design",
                      "Web Development",
                      "Mobile Development",
                      "Content Writing",
                      "Data Analysis",
                    ].map((skill) => (
                      <div key={skill} className="flex items-center space-x-2">
                        <Checkbox
                          id={`skill-${skill}`}
                          checked={formData.skills.includes(skill)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData((prev) => ({
                                ...prev,
                                skills: [...prev.skills, skill],
                              }))
                            } else {
                              setFormData((prev) => ({
                                ...prev,
                                skills: prev.skills.filter((s) => s !== skill),
                              }))
                            }
                          }}
                        />
                        <label
                          htmlFor={`skill-${skill}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {skill}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="ml-auto bg-cmu-maroon hover:bg-cmu-dark" onClick={() => setStep(2)}>
                  Continue
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Budget & Timeline</CardTitle>
                <CardDescription>Set your budget and project timeline</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Budget Type</Label>
                  <RadioGroup
                    value={formData.budgetType}
                    onValueChange={(value) => handleSelectChange("budgetType", value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="fixed" id="fixed" />
                      <Label htmlFor="fixed" className="font-normal">
                        Fixed Price
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="range" id="range" />
                      <Label htmlFor="range" className="font-normal">
                        Budget Range
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.budgetType === "fixed" ? (
                  <div className="space-y-2">
                    <Label htmlFor="budgetMin">Fixed Price ($)</Label>
                    <Input
                      id="budgetMin"
                      name="budgetMin"
                      type="number"
                      placeholder="e.g., 200"
                      value={formData.budgetMin}
                      onChange={handleChange}
                      required
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="budgetMin">Minimum ($)</Label>
                      <Input
                        id="budgetMin"
                        name="budgetMin"
                        type="number"
                        placeholder="e.g., 100"
                        value={formData.budgetMin}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budgetMax">Maximum ($)</Label>
                      <Input
                        id="budgetMax"
                        name="budgetMax"
                        type="number"
                        placeholder="e.g., 300"
                        value={formData.budgetMax}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="timeline">Project Timeline</Label>
                  <Select
                    value={formData.timeline}
                    onValueChange={(value) => handleSelectChange("timeline", value)}
                    required
                  >
                    <SelectTrigger id="timeline">
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less-than-week">Less than a week</SelectItem>
                      <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                      <SelectItem value="2-4-weeks">2-4 weeks</SelectItem>
                      <SelectItem value="1-3-months">1-3 months</SelectItem>
                      <SelectItem value="3-plus-months">3+ months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <Label>Job Visibility</Label>
                  <RadioGroup
                    value={formData.visibility}
                    onValueChange={(value) => handleSelectChange("visibility", value)}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="public" id="public" />
                      <Label htmlFor="public" className="font-normal">
                        Public - Visible to all students
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="invite" id="invite" />
                      <Label htmlFor="invite" className="font-normal">
                        Invite Only - Only visible to students you invite
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button type="submit" className="bg-cmu-maroon hover:bg-cmu-dark" disabled={isSubmitting}>
                  {isSubmitting ? "Posting..." : "Post Job"}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </form>
    </div>
  )
}
