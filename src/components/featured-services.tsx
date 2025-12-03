import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Branding from '../assets/designn.jpg'
import Essay from '../assets/essay.jpg'
import Computer from '../assets/computer.jpg'
import Research from '../assets/research.jpg'
import { Star } from "lucide-react"
import Image from "next/image"

// Mock data for featured services
const featuredServices = [
  {
    id: 1,
    title: "Graphic Design & Branding",
    description: "Professional logos, posters, and branding materials for your club or event",
    price: "$40",
    category: "Design",
    rating: 4.9,
    reviews: 27,
    provider: {
      name: "Alex Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AC",
      major: "Design",
      year: "Junior",
    },
    image: Branding,
  },
  {
    id: 2,
    title: "Computer Science Tutoring",
    description: "One-on-one tutoring for CS courses including algorithms, data structures, and programming",
    price: "$25/hr",
    category: "Tutoring",
    rating: 4.8,
    reviews: 42,
    provider: {
      name: "Maya Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MJ",
      major: "Computer Science",
      year: "Senior",
    },
    image: Computer,
  },
  {
    id: 3,
    title: "Research Assistance",
    description: "Help with literature reviews, data analysis, and research methodology",
    price: "$30/hr",
    category: "Research",
    rating: 4.7,
    reviews: 18,
    provider: {
      name: "David Park",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "DP",
      major: "Psychology",
      year: "Graduate",
    },
    image: Research,
  },
  {
    id: 4,
    title: "Essay Editing & Proofreading",
    description: "Professional editing for essays, papers, and applications with quick turnaround",
    price: "$20",
    category: "Writing",
    rating: 4.9,
    reviews: 35,
    provider: {
      name: "Sophia Martinez",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SM",
      major: "English",
      year: "Senior",
    },
    image: Essay,
  },
]

export default function FeaturedServices() {
  return (
    <div className="grid gap-6 pt-8 md:grid-cols-2 lg:grid-cols-4">
      {featuredServices.map((service) => (
        <Link key={service.id} href={`/services/${service.id}`} className="group">
          <Card className="h-full overflow-hidden transition-all hover:shadow-md">
            <div className="aspect-video w-full overflow-hidden">
              {/* <img
                src={service.image || "/placeholder.svg"}
                alt={service.title}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              /> */}
              <Image src={service.image || "/placeholder.svg"} alt={service.title} width={0} height={0} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
            </div>
            <CardHeader className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <Badge className="mb-2 bg-red-600">{service.category}</Badge>
                  <CardTitle className="line-clamp-1 text-lg">{service.title}</CardTitle>
                </div>
                <div className="text-lg font-bold text-red-600">{service.price}</div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="line-clamp-2 text-sm text-muted-foreground">{service.description}</p>
            </CardContent>
            <CardFooter className="flex items-center justify-between p-4 pt-0">
              <div className="flex items-center space-x-2 ">
                <Avatar className="h-8 w-8 ">
                  <AvatarImage src={service.provider.avatar} alt={service.provider.name} />
                  <AvatarFallback className="bg-[#6A0032] text-white">{service.provider.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{service.provider.name}</p>
                  <p className="text-xs text-muted-foreground">{service.provider.major}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-medium">{service.rating}</span>
                <span className="text-xs text-muted-foreground">({service.reviews})</span>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}

