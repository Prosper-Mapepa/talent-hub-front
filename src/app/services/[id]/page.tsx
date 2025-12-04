"use client"
import { useState, useEffect, use } from "react"
import { toast, Toaster } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MessageSquare, Clock, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import Servicee from "@/assets/landdd.webp"
import Serviceee from "@/assets/designn.jpg"
import Serviceeee from "@/assets/landd.jpg"
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { fetchServiceById } from '@/lib/slices/servicesSlice';
import { useRouter } from 'next/navigation';

// Mock service data
const mockService = {
  id: 1,
  title: "Graphic Design & Branding",
  description:
    "Professional logos, posters, and branding materials for your club or event. I specialize in creating eye-catching designs that help your organization stand out. Whether you need a complete brand identity or just a simple poster for an upcoming event, I can help bring your vision to life.",
  price: "$40",
  category: "Design",
  rating: 4.9,
  provider: {
    id: 101,
    name: "Alex Chen",
    avatar: "/placeholder.svg?height=100&width=100",
    initials: "AC",
    major: "Design",
    year: "Junior",
    bio: "I'm a junior studying Design with a focus on digital media. I've worked with several campus organizations and local businesses to create branding materials and marketing collateral.",
    completedProjects: 42,
    responseTime: "Within 2 hours",
    joinedDate: "September 2022",
  },
  images: [
    `${Servicee.src}`,
    `${Serviceee.src}`,
    `${Serviceeee.src}`,
  ],
  deliverables: [
    "Logo design (multiple concepts and revisions)",
    "Brand style guide (colors, typography, usage)",
    "Social media graphics package",
    "Print-ready files in multiple formats",
    "Source files for future editing",
  ],
  turnaroundTime: "3-5 days",
  revisions: "Up to 3 revisions included",
  additionalServices: [
    {
      title: "Rush delivery (24-48 hours)",
      price: "+$20",
    },
    {
      title: "Additional revision round",
      price: "+$10",
    },
    {
      title: "Social media kit (10 templates)",
      price: "+$25",
    },
  ],
  reviews: [
    {
      id: 1,
      user: {
        name: "Jamie Smith",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "JS",
      },
      rating: 5,
      date: "October 15, 2023",
      comment:
        "Alex created an amazing logo for our student organization. The design perfectly captured our mission and has helped us stand out on campus. Highly recommend!",
    },
    {
      id: 2,
      user: {
        name: "Taylor Wong",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "TW",
      },
      rating: 5,
      date: "September 28, 2023",
      comment:
        "I needed posters for an event with a tight deadline, and Alex delivered high-quality work quickly. The designs were creative and exactly what I was looking for.",
    },
    {
      id: 3,
      user: {
        name: "Jordan Lee",
        avatar: "/placeholder.svg?height=40&width=40",
        initials: "JL",
      },
      rating: 4,
      date: "August 12, 2023",
      comment:
        "Great work on our club's branding package. The only reason for 4 stars instead of 5 is that we needed an extra revision round, but Alex was accommodating and the final result was excellent.",
    },
  ],
}

export default function ServicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const dispatch = useAppDispatch();
  const { currentService: service, isLoading, error } = useAppSelector((state) => state.services);
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchServiceById(resolvedParams.id));
  }, [dispatch, resolvedParams.id]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleContactSeller = () => {
    toast('Contact feature coming soon!', { icon: '✉️' });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Toaster position="top-right" />
        <svg className="animate-spin h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
  if (!service) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Toaster position="top-right" />
        <span className="text-gray-500 mb-2">Service not found.</span>
        <Button onClick={() => router.refresh()}>Reload</Button>
      </div>
    );
  }

  return (
    <div className=" px-4 py-8 md:px-6 md:py-12">
      <Toaster position="top-right" />
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Service Details */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2">
              <Badge>{service.category}</Badge>
              <div className="flex items-center text-amber-500">
                <Star className="mr-1 h-4 w-4 fill-amber-500" />
                <span className="text-sm font-medium">{service.rating}</span>
                <span className="text-sm text-muted-foreground">({service.reviews?.length ?? 0} reviews)</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold">{service.title}</h1>
            <div className="mt-2 flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={service.provider.avatar || "/placeholder.svg"} alt={service.provider.name} />
                <AvatarFallback>{service.provider.initials}</AvatarFallback>
              </Avatar>
              <div>
                <Link href={`/students/${service.provider.id}`} className="text-sm font-medium hover:underline">
                  {service.provider.name}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {service.provider.major}, {service.provider.year}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {service.images?.map((image: string, index: number) => (
              <div key={index} className="overflow-hidden rounded-lg">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${service.title} example ${index + 1}`}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>

          <Tabs defaultValue="description" className="mb-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4">
              <div className="space-y-4">
                <p>{service.description}</p>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">What You'll Get</h3>
                  <ul className="list-inside list-disc space-y-1">
                    {service.deliverables?.map((item: string, index: number) => (
                      <li key={index} className="text-muted-foreground">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="details" className="mt-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Turnaround Time</p>
                      <p className="text-sm text-muted-foreground">{service.turnaroundTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Revisions</p>
                      <p className="text-sm text-muted-foreground">{service.revisions}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-lg font-semibold">Additional Services</h3>
                  <ul className="space-y-2">
                    {service.additionalServices?.map((item: any, index: number) => (
                      <li key={index} className="flex items-center justify-between rounded-lg border p-3">
                        <span>{item.title}</span>
                        <span className="font-medium text-red-600">{item.price}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <div className="space-y-4">
                {service.reviews?.map((review: any, index: number) => (
                  <div key={index} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={review.user.avatar || "/placeholder.svg"} alt={review.user.name} />
                          <AvatarFallback>{review.user.initials}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{review.user.name}</span>
                      </div>
                      <div className="flex items-center">
                        {Array(review.rating)
                          .fill(0)
                          .map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                          ))}
                        {Array(5 - review.rating)
                          .fill(0)
                          .map((_, i) => (
                            <Star key={i} className="h-4 w-4 text-muted-foreground" />
                          ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{review.date}</p>
                    <p className="mt-2">{review.comment}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-red-600">{service.price}</CardTitle>
              <CardDescription>Base package</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <span>{service.turnaroundTime} delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-muted-foreground" />
                <span>{service.revisions}</span>
              </div>
              <Button className="w-full bg-red-600 hover:bg-red-700" asChild>
                <Link href={`/checkout?serviceId=${resolvedParams.id}`}>Request This Service</Link>
              </Button>
              <Button variant="outline" className="w-full" onClick={handleContactSeller}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Seller
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About the Seller</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={service.provider.avatar || "/placeholder.svg"} alt={service.provider.name} />
                  <AvatarFallback>{service.provider.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <Link href={`/students/${service.provider.id}`} className="text-lg font-medium hover:underline">
                    {service.provider.name}
                  </Link>
                  <p className="text-muted-foreground">
                    {service.provider.major}, {service.provider.year}
                  </p>
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed Projects</span>
                  <span className="font-medium">{(service.provider as any)?.completedProjects ?? '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Response Time</span>
                  <span className="font-medium">{(service.provider as any)?.responseTime ?? '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="font-medium">{(service.provider as any)?.joinedDate ?? '-'}</span>
                </div>
              </div>
              <p className="pt-2 text-sm">{(service.provider as any)?.bio ?? ''}</p>
              <Button variant="outline" className="w-full">
                View Full Profile
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Safety Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 text-amber-500" />
                <p className="text-sm">Always communicate through CMUTalentHub</p>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 text-amber-500" />
                <p className="text-sm">Pay using our secure payment system</p>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 text-amber-500" />
                <p className="text-sm">Meet in public places for in-person services</p>
              </div>
              <Link href="/safety" className="text-sm text-red-600 hover:underline">
                View all safety guidelines
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
