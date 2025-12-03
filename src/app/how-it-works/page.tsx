import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { CheckCircle, Users, Briefcase, MessageSquare, Star, CreditCard, Shield, Award } from "lucide-react"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Hero Section */}
      <section className="bg-white py-12 px-4 md:px-8 md:py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
              How <span className="text-[#8F1A27]">CMUTalentHub</span> Works
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Connect with talented students, showcase your skills, and grow your professional network all in one place.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-[#8F1A27] text-white hover:bg-[#6D0432] rounded-lg shadow-sm font-medium px-8 py-3">
                  Start Networking
                </Button>
              </Link>
              <Link href="/services">
                <Button size="lg" variant="outline" className="border-[#8F1A27] text-[#8F1A27] hover:bg-[#8F1A27]/10 rounded-lg font-medium px-8 py-3">
                  Explore Talents
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* For Students Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="mx-auto max-w-8xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#8F1A27] mb-4">For Students</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Showcase your skills, build your portfolio, and connect with CMU Community
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 ">
            <Card className="border shadow-sm rounded-2xl hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="bg-[#8F1A27]/10 rounded-full p-3 w-fit mb-4">
                  <Users className="h-6 w-6 text-[#8F1A27]" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">Create Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Sign up and create a detailed profile showcasing your Talents, skills, experience, and education.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Highlight your academic achievements</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Showcase your portfolio</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">List your skills and expertise</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border shadow-sm rounded-2xl hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="bg-[#8F1A27]/10 rounded-full p-3 w-fit mb-4">
                  <Briefcase className="h-6 w-6 text-[#8F1A27]" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">List Talents</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Create Talent listings with detailed descriptions and media.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Showcase your Talents</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">See related Talents</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Upload examples of your work</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border shadow-sm rounded-2xl hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="bg-[#8F1A27]/10 rounded-full p-3 w-fit mb-4">
                  <MessageSquare className="h-6 w-6 text-[#8F1A27]" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">Manage Network</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Communicate with peers, start projects, and manage your connections.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Secure messaging system</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">File sharing capabilities</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Profile visibility</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border shadow-sm rounded-2xl hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="bg-[#8F1A27]/10 rounded-full p-3 w-fit mb-4">
                  <Star className="h-6 w-6 text-[#8F1A27]" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">Build Reputation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Receive reviews and ratings to build your professional reputation.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Collect peer testimonials</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Showcase your rating</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Earn verification badges</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* For Clients Section */}
      <section className="py-16 px-4 md:px-8 bg-white">
        <div className="mx-auto max-w-8xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#8F1A27] mb-4">For Faculty and Staff</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find talented students to help with your projects, events, and business needs.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border shadow-sm rounded-2xl hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="bg-[#8F1A27]/10 rounded-full p-3 w-fit mb-4">
                  <Users className="h-6 w-6 text-[#8F1A27]" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">Browse Talents</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Explore profiles of talented students with various skills and expertise.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Search by Talent, skill, or category</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Filter by rating and experience</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">View detailed portfolios</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border shadow-sm rounded-2xl hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="bg-[#8F1A27]/10 rounded-full p-3 w-fit mb-4">
                  <Briefcase className="h-6 w-6 text-[#8F1A27]" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">Post Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Create job listings for your projects and receive proposals from qualified students.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Detailed job descriptions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Secure messaging system</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Receive targeted applications</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border shadow-sm rounded-2xl hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="bg-[#8F1A27]/10 rounded-full p-3 w-fit mb-4">
                  <CreditCard className="h-6 w-6 text-[#8F1A27]" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">Connect = Network </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Connect with talented students to help with your projects, events, and business needs.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Connect with students</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Connect with departments</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Build your network</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border shadow-sm rounded-2xl hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="bg-[#8F1A27]/10 rounded-full p-3 w-fit mb-4">
                  <Shield className="h-6 w-6 text-[#8F1A27]" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">Quality Assurance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Ensure quality with our review system and satisfaction guarantee.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Verified student profiles</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Data protection and privacy</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 mt-0.5 h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600">Satisfaction guarantee</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="mx-auto max-w-8xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#8F1A27] mb-4">Trust & Safety</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We prioritize creating a safe and trusted environment for all users
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Card className="border shadow-sm rounded-2xl hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="bg-[#8F1A27]/10 rounded-full p-3 w-fit mb-4">
                  <Shield className="h-6 w-6 text-[#8F1A27]" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">Verified Profiles</CardTitle>
                <CardDescription className="text-gray-600">
                  All students are verified through their university email and credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We verify the identity and student status of all users to ensure a trusted community. Additional
                  verification badges can be earned through document verification and completed projects.
                </p>
              </CardContent>
            </Card>

            <Card className="border shadow-sm rounded-2xl hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="bg-[#8F1A27]/10 rounded-full p-3 w-fit mb-4">
                  <CreditCard className="h-6 w-6 text-[#8F1A27]" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">Secure Messaging</CardTitle>
                <CardDescription className="text-gray-600">
                  All communications are protected with secure messaging system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                    Our messaging system is protected with end-to-end encryption to ensure privacy and security. All messages are encrypted and decrypted on the client's device. 
                </p>
              </CardContent>
            </Card>

            <Card className="border shadow-sm rounded-2xl hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="bg-[#8F1A27]/10 rounded-full p-3 w-fit mb-4">
                  <Award className="h-6 w-6 text-[#8F1A27]" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">Quality Standards</CardTitle>
                <CardDescription className="text-gray-600">
                  We maintain high standards for all services offered on our platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our review and rating system helps maintain quality standards across the platform. We also provide
                  dispute resolution services to ensure fair outcomes for all parties.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="radient-bg py-20 text-white bg-gradient-to-br from-[#8F1A27] via-[#6A0032] to-[#8F1A27] text-center ">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join CMUTalentHub today to connect with talented students or offer your skills to the campus community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-white text-[#8F1A27] hover:bg-gray-100 rounded-lg font-medium px-8 py-3">
                Start Networking
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline" className="border-white bg-[#6A0032]/10 text-white hover:bg-white/10 rounded-lg font-medium px-8 py-3">
                Explore Talents
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

