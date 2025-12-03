"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Calendar, CheckCircle, Clock, Download, FileText, MessageSquare, Star, Upload } from "lucide-react"

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const [feedback, setFeedback] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  // Mock project data
  const project = {
    id: params.id,
    title: "Logo Design for Marketing Campaign",
    description:
      "Create a modern, eye-catching logo for our upcoming marketing campaign. The logo should reflect our brand values of innovation, reliability, and customer focus.",
    status: "In Progress",
    progress: 65,
    startDate: "Apr 15, 2025",
    dueDate: "Apr 28, 2025",
    price: "$120",
    provider: {
      id: "1",
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=80&width=80",
      initials: "AJ",
      major: "Design",
      year: "Senior",
      rating: 4.9,
      completedProjects: 24,
    },
    milestones: [
      {
        id: 1,
        title: "Initial Concepts",
        status: "Completed",
        dueDate: "Apr 18, 2025",
        completedDate: "Apr 17, 2025",
      },
      {
        id: 2,
        title: "Revisions & Refinement",
        status: "In Progress",
        dueDate: "Apr 23, 2025",
      },
      {
        id: 3,
        title: "Final Delivery",
        status: "Pending",
        dueDate: "Apr 28, 2025",
      },
    ],
    deliverables: [
      {
        id: 1,
        title: "Initial Concept Sketches",
        type: "PDF",
        date: "Apr 17, 2025",
        size: "2.4 MB",
      },
      {
        id: 2,
        title: "Color Palette Options",
        type: "PDF",
        date: "Apr 17, 2025",
        size: "1.8 MB",
      },
    ],
    messages: [
      {
        id: 1,
        sender: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "AJ",
        content: "I've uploaded the initial concept sketches for your review. Please let me know your thoughts!",
        date: "Apr 17, 2025",
        time: "2:45 PM",
      },
      {
        id: 2,
        sender: "You",
        content: "These look great! I particularly like concepts #2 and #4. Could we explore those further?",
        date: "Apr 17, 2025",
        time: "4:30 PM",
      },
      {
        id: 3,
        sender: "Alex Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "AJ",
        content: "I'll work on refining those two concepts and will have updates for you by tomorrow.",
        date: "Apr 17, 2025",
        time: "5:15 PM",
      },
    ],
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <Button variant="ghost" size="sm" className="mb-4" asChild>
        <Link href="/business-dashboard/projects">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Link>
      </Button>

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <Badge
              variant={
                project.status === "In Progress"
                  ? "default"
                  : project.status === "Revision Requested"
                    ? "destructive"
                    : project.status === "Completed"
                      ? "outline"
                      : "secondary"
              }
            >
              {project.status}
            </Badge>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1 h-4 w-4" />
              Due {project.dueDate}
            </div>
            <div className="flex items-center text-sm font-medium text-cmu-maroon">{project.price}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/messages?project=${project.id}`}>
              <MessageSquare className="mr-2 h-4 w-4" />
              Message
            </Link>
          </Button>
          {project.status !== "Completed" && (
            <Button size="sm" className="bg-cmu-maroon hover:bg-cmu-dark">
              Request Revision
            </Button>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="overview" className="space-y-4" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="deliverables">Deliverables</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{project.description}</p>

                  <div className="mt-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm font-medium">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="mt-2" />
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border p-3">
                      <span className="text-xs text-muted-foreground">Start Date</span>
                      <p className="font-medium">{project.startDate}</p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <span className="text-xs text-muted-foreground">Due Date</span>
                      <p className="font-medium">{project.dueDate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Milestones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-start justify-between rounded-lg border p-3">
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-0.5 rounded-full p-1 ${
                              milestone.status === "Completed"
                                ? "bg-green-100 text-green-600"
                                : milestone.status === "In Progress"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {milestone.status === "Completed" ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : milestone.status === "In Progress" ? (
                              <Clock className="h-4 w-4" />
                            ) : (
                              <Calendar className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{milestone.title}</p>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  milestone.status === "Completed"
                                    ? "outline"
                                    : milestone.status === "In Progress"
                                      ? "default"
                                      : "secondary"
                                }
                              >
                                {milestone.status}
                              </Badge>
                              <span className="text-xs text-muted-foreground">Due {milestone.dueDate}</span>
                              {milestone.completedDate && (
                                <span className="text-xs text-green-600">Completed {milestone.completedDate}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="deliverables" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Deliverables</CardTitle>
                  <CardDescription>Files and documents delivered by the provider</CardDescription>
                </CardHeader>
                <CardContent>
                  {project.deliverables.length > 0 ? (
                    <div className="space-y-4">
                      {project.deliverables.map((deliverable) => (
                        <div key={deliverable.id} className="flex items-center justify-between rounded-lg border p-3">
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-muted p-2">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">{deliverable.title}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {deliverable.type} • {deliverable.size}
                                </span>
                                <span className="text-xs text-muted-foreground">Uploaded {deliverable.date}</span>
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <p className="text-muted-foreground">No deliverables yet</p>
                    </div>
                  )}

                  <div className="mt-6">
                    <div className="rounded-lg border border-dashed p-8">
                      <div className="flex flex-col items-center justify-center text-center">
                        <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                        <h3 className="text-lg font-medium">Upload Project Files</h3>
                        <p className="text-sm text-muted-foreground">Drag and drop files here or click to browse</p>
                        <Button variant="outline" className="mt-4">
                          Select Files
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Project Messages</CardTitle>
                  <CardDescription>Communication history with the provider</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {project.messages.map((message) => (
                      <div key={message.id} className={`flex ${message.sender === "You" ? "justify-end" : ""}`}>
                        <div
                          className={`max-w-[80%] rounded-lg ${message.sender === "You" ? "bg-cmu-maroon/10" : "bg-muted"} p-3`}
                        >
                          <div className="flex items-center gap-2">
                            {message.sender !== "You" && (
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={message.avatar || "/placeholder.svg"} alt={message.sender} />
                                <AvatarFallback>{message.initials}</AvatarFallback>
                              </Avatar>
                            )}
                            <span className="text-xs font-medium">{message.sender}</span>
                            <span className="text-xs text-muted-foreground">
                              {message.date} at {message.time}
                            </span>
                          </div>
                          <p className="mt-1 text-sm">{message.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <Textarea
                      placeholder="Type your message here..."
                      className="min-h-[100px]"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                    />
                    <div className="mt-2 flex justify-end">
                      <Button className="bg-cmu-maroon hover:bg-cmu-dark">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Send Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Provider</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={project.provider.avatar || "/placeholder.svg"} alt={project.provider.name} />
                  <AvatarFallback>{project.provider.initials}</AvatarFallback>
                </Avatar>
                <h3 className="mt-4 text-lg font-medium">{project.provider.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {project.provider.major}, {project.provider.year}
                </p>
                <div className="mt-2 flex items-center">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="ml-1 text-sm">
                    {project.provider.rating} ({project.provider.completedProjects} projects)
                  </span>
                </div>
                <Button variant="outline" className="mt-4" size="sm" asChild>
                  <Link href={`/students/${project.provider.id}`}>View Profile</Link>
                </Button>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Project Actions</h4>
                <div className="grid grid-cols-1 gap-2">
                  <Button variant="outline" size="sm" className="justify-start" asChild>
                    <Link href={`/messages?project=${project.id}`}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send Message
                    </Link>
                  </Button>
                  {project.status !== "Completed" && (
                    <>
                      <Button variant="outline" size="sm" className="justify-start">
                        <Clock className="mr-2 h-4 w-4" />
                        Request Extension
                      </Button>
                      <Button variant="outline" size="sm" className="justify-start text-red-500 hover:text-red-500">
                        Cancel Project
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Project Fee</span>
                  <span className="font-medium">{project.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Service Fee</span>
                  <span className="font-medium">$10.00</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-medium text-cmu-maroon">$130.00</span>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-muted p-3">
                <p className="text-xs">Payment is held in escrow until you approve the final deliverables.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
