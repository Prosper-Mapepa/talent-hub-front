"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Upload, X, Plus, FileVideo, File, DollarSign, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

// Service categories
const categories = [
  "Design",
  "Development",
  "Writing",
  "Marketing",
  "Tutoring",
  "Research",
  "Media",
  "Music",
  "Art",
  "Other",
]

// Skills by category
const skillsByCategory: Record<string, string[]> = {
  Design: ["Graphic Design", "UI/UX Design", "Logo Design", "Brand Identity", "Illustration", "Typography"],
  Development: [
    "Web Development",
    "Mobile Development",
    "Frontend",
    "Backend",
    "Full Stack",
    "JavaScript",
    "React",
    "Node.js",
  ],
  Writing: ["Content Writing", "Copywriting", "Editing", "Proofreading", "Academic Writing", "Creative Writing"],
  Marketing: ["Social Media", "SEO", "Email Marketing", "Content Marketing", "Analytics", "Market Research"],
  Tutoring: ["Math", "Science", "Computer Science", "English", "History", "Languages"],
  Research: ["Data Analysis", "Literature Review", "Survey Design", "Qualitative Research", "Quantitative Research"],
  Media: ["Video Production", "Photography", "Animation", "Editing", "Audio Production"],
  Music: ["Composition", "Production", "Lessons", "Performance", "Mixing", "Mastering"],
  Art: ["Painting", "Drawing", "Digital Art", "Sculpture", "Crafts"],
  Other: ["Event Planning", "Virtual Assistance", "Consulting", "Project Management"],
}

export default function CreateServicePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("basic")
  const [category, setCategory] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [portfolioItems, setPortfolioItems] = useState<
    {
      id: number
      file: File | null
      type: "image" | "video" | "document"
      preview: string
      title: string
      description: string
    }[]
  >([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<string[]>([])

  // Handle category change and reset skills
  const handleCategoryChange = (value: string) => {
    setCategory(value)
    setSelectedSkills([])
  }

  // Toggle skill selection
  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  // Handle file selection for portfolio
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    const fileType = file.type.startsWith("image/") ? "image" : file.type.startsWith("video/") ? "video" : "document"

    const newItem = {
      id: Date.now(),
      file,
      type: fileType as "image" | "video" | "document",
      preview: fileType === "image" ? URL.createObjectURL(file) : "",
      title: "",
      description: "",
    }

    setPortfolioItems((prev) => [...prev, newItem])
    e.target.value = "" // Reset input
  }

  // Remove portfolio item
  const removePortfolioItem = (id: number) => {
    setPortfolioItems((prev) => {
      const filtered = prev.filter((item) => item.id !== id)
      // Revoke object URL to avoid memory leaks
      const itemToRemove = prev.find((item) => item.id === id)
      if (itemToRemove?.preview) URL.revokeObjectURL(itemToRemove.preview)
      return filtered
    })
  }

  // Update portfolio item details
  const updatePortfolioItem = (id: number, field: "title" | "description", value: string) => {
    setPortfolioItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormErrors([])

    // Simulate form validation
    const errors: string[] = []
    const form = e.target as HTMLFormElement 
    const title = (form.elements.namedItem('title') as HTMLInputElement)?.value || ''
    const description = (form.elements.namedItem('description') as HTMLTextAreaElement)?.value || ''
    const price = (form.elements.namedItem('price') as HTMLInputElement)?.value || ''

    if (!title) errors.push("Service title is required")
    if (!description) errors.push("Service description is required")
    if (!price) errors.push("Price is required")
    if (!category) errors.push("Category is required")
    if (selectedSkills.length === 0) errors.push("At least one skill is required")

    if (errors.length > 0) {
      setFormErrors(errors)
      setIsSubmitting(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      // In a real app, you would submit the form data to your API here
      console.log("Form submitted successfully")
      router.push("/dashboard?tab=services")
    }, 1500)
  }

  // Navigate between tabs
  const goToNextTab = () => {
    if (activeTab === "basic") setActiveTab("portfolio")
    else if (activeTab === "portfolio") setActiveTab("pricing")
    else if (activeTab === "pricing") setActiveTab("review")
  }

  const goToPrevTab = () => {
    if (activeTab === "review") setActiveTab("pricing")
    else if (activeTab === "pricing") setActiveTab("portfolio")
    else if (activeTab === "portfolio") setActiveTab("basic")
  }

  return (
    <div className="  px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#6A0032]">Create New Service</h1>
        <p className="text-muted-foreground">Showcase your skills and offer your services to the community</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-[#6A0032]/10">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Service Information</CardTitle>
                <CardDescription>Provide the basic details about your service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Service Title</Label>
                  <Input id="title" name="title" placeholder="e.g., Professional Logo Design" />
                  <p className="text-xs text-muted-foreground">
                    Choose a clear, specific title that describes what you offer
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Service Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your service in detail..."
                    className="min-h-[150px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Explain what you offer, your process, and what clients can expect
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={handleCategoryChange}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {category && (
                  <div className="space-y-2">
                    <Label>Skills</Label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {skillsByCategory[category]?.map((skill) => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox
                            id={`skill-${skill}`}
                            checked={selectedSkills.includes(skill)}
                            onCheckedChange={() => toggleSkill(skill)}
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
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="button" onClick={goToNextTab} className="bg-[#6A0032] hover:bg-orange-500">
                  Continue to Portfolio
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Portfolio Tab */}
          <TabsContent value="portfolio" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#6A0032]">Portfolio</CardTitle>
                <CardDescription>Showcase examples of your previous work</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Upload Portfolio Items</Label>
                  <p className="text-sm text-muted-foreground">
                    Add images, videos, or documents that demonstrate your skills and previous work
                  </p>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {/* Portfolio items */}
                    {portfolioItems.map((item) => (
                      <Card key={item.id} className="overflow-hidden">
                        <div className="relative aspect-video bg-muted">
                          {item.type === "image" && item.preview && (
                            <img
                              src={item.preview || "/placeholder.svg"}
                              alt={item.title || "Portfolio preview"}
                              className="h-full w-full object-cover"
                            />
                          )}
                          {item.type === "video" && (
                            <div className="flex h-full items-center justify-center">
                              <FileVideo className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                          {item.type === "document" && (
                            <div className="flex h-full items-center justify-center">
                              <File className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute right-2 top-2 h-6 w-6"
                            onClick={() => removePortfolioItem(item.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <CardContent className="p-3">
                          <Input
                            placeholder="Title"
                            value={item.title}
                            onChange={(e) => updatePortfolioItem(item.id, "title", e.target.value)}
                            className="mb-2"
                          />
                          <Textarea
                            placeholder="Description"
                            value={item.description}
                            onChange={(e) => updatePortfolioItem(item.id, "description", e.target.value)}
                            className="min-h-[80px] text-sm"
                          />
                        </CardContent>
                      </Card>
                    ))}

                    {/* Add new item button */}
                    <div className="flex aspect-video items-center justify-center rounded-lg border-2 border-dashed">
                      <label
                        htmlFor="portfolio-upload"
                        className="flex cursor-pointer flex-col items-center p-4 text-center"
                      >
                        <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                        <span className="text-sm font-medium">Upload file</span>
                        <span className="text-xs text-muted-foreground">Images, videos, or documents</span>
                        <input
                          id="portfolio-upload"
                          type="file"
                          className="hidden"
                          accept="image/*,video/*,.pdf,.doc,.docx"
                          onChange={handleFileSelect}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={goToPrevTab}>
                  Back
                </Button>
                <Button type="button" onClick={goToNextTab} className="bg-[#6A0032] hover:bg-orange-500">
                  Continue to Pricing
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#6A0032]">Pricing & Delivery</CardTitle>
                <CardDescription>Set your pricing structure and delivery details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="pricing-type" className="text-[#6A0032]">Pricing Type</Label>
                    <RadioGroup defaultValue="fixed" className="mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fixed" id="pricing-fixed" />
                        <Label htmlFor="pricing-fixed">Fixed Price</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="hourly" id="pricing-hourly" />
                        <Label htmlFor="pricing-hourly">Hourly Rate</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input id="price" name="price" type="number" min="1" className="pl-9" placeholder="e.g., 50" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="delivery-time">Delivery Time</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Select defaultValue="3">
                          <SelectTrigger id="delivery-time" className="pl-9">
                            <SelectValue placeholder="Select delivery time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 day</SelectItem>
                            <SelectItem value="2">2 days</SelectItem>
                            <SelectItem value="3">3 days</SelectItem>
                            <SelectItem value="5">5 days</SelectItem>
                            <SelectItem value="7">1 week</SelectItem>
                            <SelectItem value="14">2 weeks</SelectItem>
                            <SelectItem value="30">1 month</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>What's Included</Label>
                    <p className="text-sm text-muted-foreground">
                      Specify what deliverables are included in your service
                    </p>

                    <div className="mt-2 space-y-2">
                      {[1, 2, 3].map((index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <Input
                            placeholder={`Deliverable ${index} (e.g., "Source files included")`}
                            name={`deliverable-${index}`}
                          />
                        </div>
                      ))}
                      <Button variant="outline" size="sm" className="mt-2">
                        <Plus className="mr-1 h-4 w-4" /> Add More
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Additional Services (Optional)</Label>
                    <p className="text-sm text-muted-foreground">
                      Offer additional services or upgrades for an extra fee
                    </p>

                    <div className="mt-2 space-y-2">
                      {[1, 2].map((index) => (
                        <div key={index} className="grid grid-cols-3 gap-2">
                          <div className="col-span-2">
                            <Input
                              placeholder={`Additional service ${index} (e.g., "Express delivery")`}
                              name={`additional-${index}`}
                            />
                          </div>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              min="1"
                              className="pl-9"
                              placeholder="Price"
                              name={`additional-price-${index}`}
                            />
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" className="mt-2">
                        <Plus className="mr-1 h-4 w-4" /> Add More
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={goToPrevTab}>
                  Back
                </Button>
                <Button type="button" onClick={goToNextTab} className="bg-[#6A0032] hover:bg-orange-500">
                  Review Service
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Review Tab */}
          <TabsContent value="review" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-[#6A0032]">Review Your Service</CardTitle>
                <CardDescription>Review all details before publishing your service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {formErrors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      <ul className="ml-4 list-disc">
                        {formErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="rounded-lg border p-4">
                  <h3 className="mb-2 text-lg font-semibold text-[#6A0032]">Basic Information</h3>
                  <div className="grid gap-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-medium text-[#6A0032]">{category || "Not specified"}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Skills:</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {selectedSkills.length > 0 ? (
                          selectedSkills.map((skill) => (
                            <Badge key={skill} variant="outline">
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-sm italic">No skills selected</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="mb-2 text-lg font-semibold text-[#6A0032]">Portfolio</h3>
                  {portfolioItems.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2">
                      {portfolioItems.map((item) => (
                        <div key={item.id} className="overflow-hidden rounded-md border">
                          <div className="aspect-video bg-muted">
                            {item.type === "image" && item.preview ? (
                              <img
                                src={item.preview || "/placeholder.svg"}
                                alt={item.title || "Preview"}
                                className="h-full w-full object-cover"
                              />
                            ) : item.type === "video" ? (
                              <div className="flex h-full items-center justify-center">
                                <FileVideo className="h-8 w-8 text-muted-foreground" />
                              </div>
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <File className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="p-2">
                            <p className="truncate text-xs font-medium">{item.title || "Untitled"}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm italic text-muted-foreground">No portfolio items added</p>
                  )}
                </div>

                <div className="rounded-lg border p-4">
                  <h3 className="mb-2 text-lg font-semibold text-[#6A0032]">Pricing & Delivery</h3>
                  <div className="grid gap-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-medium text-orange-500">$50</span>
                    </div>
                    <div className="flex justify-between text-[#6A0032]">
                      <span className="text-muted-foreground">Delivery Time:</span>
                      <span className="font-medium">3 days</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <a href="/terms" className="text-cmu-maroon hover:underline">
                      terms of service
                    </a>{" "}
                    and confirm that my service complies with all platform guidelines.
                  </label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={goToPrevTab}>
                  Back
                </Button>
                <Button type="submit" className="bg-[#6A0032] hover:bg-orange-500" disabled={isSubmitting}>
                  {isSubmitting ? "Publishing..." : "Publish Service"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}
