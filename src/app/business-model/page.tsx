"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Handshake, 
  Lightbulb, 
  Heart, 
  Building, 
  Truck, 
  DollarSign, 
  Cog,
  Target,
  Zap
} from 'lucide-react';

export default function BusinessModelPage() {
  const businessModelSections = [
    {
      id: 'key-partners',
      title: 'Key Partners',
      icon: Handshake,
      color: 'bg-blue-500',
      description: 'Strategic alliances and collaborations essential for the platform\'s success',
      items: [
        'Central Michigan University Administration',
        'Academic Departments (Business, Education, Health Professions, Engineering)',
        'Student Organizations',
        'Alumni Network',
        'Local Michigan Businesses',
        'Career Services Integration',
        'Technology Partners',
        'Michigan Business Community'
      ]
    },
    {
      id: 'key-activities',
      title: 'Key Activities',
      icon: Cog,
      color: 'bg-green-500',
      description: 'Core operations that deliver value and maintain the platform',
      items: [
        'Student Profile Management',
        'Talent Matching Algorithms',
        'Community Building & Events',
        'Platform Development',
        'Content Moderation',
        'Data Analytics',
        'Networking, Project, and Achievement Sharing',
        'Job Posting Management'
      ]
    },
    {
      id: 'value-propositions',
      title: 'Value Propositions',
      icon: Lightbulb,
      color: 'bg-yellow-500',
      description: 'The unique value delivered to users',
      primaryValue: 'Find other CMU Students with the Skills you need and Interests you share',
      items: [
        'Talent-Based Matching',
        'Interest Alignment',
        'Collaboration Opportunities',
        'Career Development',
        'Learning Enhancement',
        'Community Building',
        'Project Discovery',
        'Regional Networking'
      ]
    },
    {
      id: 'customer-relationships',
      title: 'Customer Relationships',
      icon: Heart,
      color: 'bg-red-500',
      description: 'How the platform builds and maintains relationships with users',
      items: [
        'Personalized Recommendations',
        'Community Forums',
        'Direct Messaging',
        'Event-Based Engagement',
        'Mentorship Programs',
        // 'Gamification',
        'Support Services',
        'Feedback Loops'
      ]
    },
    {
      id: 'customer-segments',
      title: 'Customer Segments',
      icon: Users,
      color: 'bg-purple-500',
      description: 'The specific groups the platform serves',
      items: [
        'CMU Students (Core User Base)',
        'Undergraduate Students',
        'Graduate Students',
        'Faculty Members',
        'CMU Alumni',
        'Local Michigan Businesses',
        'Regional Employers'
      ]
    },
    {
      id: 'key-resources',
      title: 'Key Resources',
      icon: Building,
      color: 'bg-indigo-500',
      description: 'Essential assets required for platform operation',
      items: [
        'Student Database',
        'Technology Platform',
        'Human Capital',
        'CMU Brand & Reputation',
        'Intellectual Property',
        'Server Infrastructure',
        'Partnership Agreements',
        'Michigan Network'
      ]
    },
    {
      id: 'channels',
      title: 'Channels',
      icon: Truck,
      color: 'bg-orange-500',
      description: 'How the platform reaches and communicates with users',
      items: [
        'Web Platform',
        'Mobile App',
        'University Integration',
        'Campus Events',
        'Social Media',
        'Email Campaigns',
        'Student Ambassadors',
        'Campus Organizations'
      ]
    },
    {
      id: 'cost-structure',
      title: 'Cost Structure',
      icon: DollarSign,
      color: 'bg-pink-500',
      description: 'Major expenses required to operate the business',
      items: [
        'Technology Development',
        'Infrastructure Costs',
        'Personnel Expenses',
        'Marketing & Outreach',
        'Partnership Development',
        'Legal & Compliance',
        'Content Creation',
        'Operational Overhead'
      ]
    },
    {
      id: 'revenue-streams',
      title: 'Revenue Streams',
      icon: Target,
      color: 'bg-teal-500',
      description: 'How the platform generates income',
      items: [
        'University Partnership Fees',
        'Premium Features',
        'Corporate Partnerships',
        'Event Sponsorships',
        'Career Services Integration',
        'Alumni Network Access',
        'Data Analytics Services',
        'Regional Business Partnerships'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <section className="bg-white py-12 px-4 md:px-8 border-b border-gray-100">
        <div className="mx-auto max-w-6xl">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#8F1A27] leading-tight">
              CMU Talent Hub
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              Business Model 
            </h2>
            <p className="text-xl text-gray-600 font-medium max-w-3xl mx-auto">
              Strategic framework for connecting Central Michigan University students 
              with the skills and interests they need to succeed
            </p>
            <div className="flex justify-center mt-6">
              <Badge variant="secondary" className="bg-[#8F1A27]/10 text-[#8F1A27] px-6 py-2 text-lg font-semibold">
                <Zap className="h-5 w-5 mr-2" />
                Central Michigan University
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Business Model Canvas Grid */}
      <section className="py-12 px-4 md:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Primary Value Proposition Highlight */}
          <Card className="mb-12 border-0 shadow-2xl bg-gradient-to-r from-[#8F1A27] to-[#6D0432] text-white">
            <CardContent className="p-8 text-center">
              <Lightbulb className="h-16 w-16 mx-auto mb-4 text-yellow-300" />
              <h3 className="text-3xl font-bold mb-4">Primary Value Proposition</h3>
              <p className="text-xl font-medium leading-relaxed">
                &quot;Find other CMU Students with the Skills you need and Interests you share&quot;
              </p>
            </CardContent>
          </Card>

          {/* Business Model Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {businessModelSections.map((section) => {
              const IconComponent = section.icon;
              return (
                <Card 
                  key={section.id} 
                  className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/90 backdrop-blur-sm"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`${section.color} rounded-xl p-3 group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-[#8F1A27] transition-colors duration-300">
                        {section.title}
                      </CardTitle>
                    </div>
                    <CardDescription className="text-gray-600 text-sm leading-relaxed">
                      {section.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {section.items.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className={`${section.color} rounded-full p-1 mt-1 flex-shrink-0`}>
                            <div className="h-2 w-2 bg-white rounded-full"></div>
                          </div>
                          <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Additional Information Section */}
          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-[#8F1A27] flex items-center">
                  <Target className="h-6 w-6 mr-2" />
                  Strategic Focus
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Student-Centric Approach</h4>
                  <p className="text-blue-800 text-sm">
                    Every feature and partnership is designed to enhance the student experience 
                    and create meaningful connections within the CMU community.
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">Regional Impact</h4>
                  <p className="text-green-800 text-sm">
                    Leveraging Michigan&apos;s business ecosystem to provide students with 
                    local opportunities while building regional talent networks.
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">Technology Integration</h4>
                  <p className="text-purple-800 text-sm">
                    Seamless integration with CMU&apos;s existing systems and infrastructure 
                    to provide a unified student experience.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-[#8F1A27] flex items-center">
                  <Zap className="h-6 w-6 mr-2" />
                  Key Success Factors
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-[#8F1A27] rounded-full p-2">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Community Engagement</h4>
                    <p className="text-gray-600 text-sm">Active participation from students, faculty, and alumni</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-[#8F1A27] rounded-full p-2">
                    <Cog className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Platform Reliability</h4>
                    <p className="text-gray-600 text-sm">Consistent, fast, and user-friendly experience</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-[#8F1A27] rounded-full p-2">
                    <Handshake className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Strategic Partnerships</h4>
                    <p className="text-gray-600 text-sm">Strong relationships with university and business partners</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-[#8F1A27] rounded-full p-2">
                    <DollarSign className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sustainable Revenue</h4>
                    <p className="text-gray-600 text-sm">Diverse income streams ensuring long-term viability</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <Card className="border-0 shadow-xl bg-gradient-to-r from-[#8F1A27] to-[#6D0432] text-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Ready to Connect?</h3>
                <p className="text-lg mb-6 opacity-90">
                  Join the CMU Talent Hub and start building meaningful connections 
                  with your fellow Central Michigan University students today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href="/register" 
                    className="bg-white text-[#8F1A27] hover:bg-gray-100 px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:shadow-lg"
                  >
                    Get Started
                  </a>
                  <a 
                    href="/login" 
                    className="border-2 border-white text-white hover:bg-white hover:text-[#8F1A27] px-8 py-3 rounded-xl font-semibold transition-all duration-200"
                  >
                    Sign In
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
