'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Smartphone, Home, BookOpen, Users, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import Image from 'next/image';

const products = [
  {
    id: 1,
    name: 'CMU TalentHub ',
    description: 'A comprehensive web and mobile application that connects CMU students with job opportunities, showcases their talents, and facilitates networking within the university community.',
    features: ['Job Postings', 'Talent Showcase', 'Student Networking', 'Mobile-First Design'],
    status: 'Active',
    icon: Smartphone,
    color: 'bg-[#8F1A27]',
    link: '#',
    github: '#',
    images: [
      '/assets/mobile/a.png',
      '/assets/mobile/b.jpeg',
      '/assets/mobile/c.jpeg',
      '/assets/mobile/d.jpeg',
      '/assets/mobile/e.jpeg'
    ]
  },
  {
    id: 5,
    name: 'CMU Attendance System',
    description: 'A comprehensive web and mobile application that helps CMU students and faculty manage their attendance records efficiently.',
    features: ['Session Creation', 'QR Code Scanning', 'Attendance Management', 'Cost Savings'],
    status: 'Active',
    icon: Users,
    color: 'bg-[#FFC540]',
    link: 'http://localhost:3002/',
    github: '#',
    images: [
      '/assets/slate/f.png'
    ]
  },
  {
    id: 2,
    name: 'CMU Perks',
    description: 'We\'re dedicated to helping Central Michigan University students discover and utilize all the amazing resources, software, and services available to them. No more missing out on valuable benefits you\'re already paying for.',
    features: ['Resource Discovery', 'Software Access', 'Student Benefits', 'Cost Savings'],
    status: 'Active',
    icon: Users,
    color: 'bg-[#FFC540]',
    link: 'http://localhost:3002/',
    github: '#',
    images: [
      '/assets/perks/aa.png',
      '/assets/perks/b.png',
      '/assets/perks/c.png',
      '/assets/perks/d.png'
    ]
  },
  {
    id: 3,
    name: 'CMU Off-Campus Housing',
    description: 'Our mission is to simplify the off-campus housing search for Central Michigan University students. We understand that finding the right place to live is a crucial part of the college experience, and we\'re dedicated to making that process as smooth as possible.',
    features: ['Housing Search', 'Property Listings', 'Student Reviews', 'Rental Assistance'],
    status: 'Active',
    icon: Home,
    color: 'bg-[#6A0032]',
    link: 'http://localhost:3004',
    github: '#',
    images: [
      '/assets/accomodation/a.png',
      '/assets/accomodation/b.png',
      '/assets/accomodation/c.png',
      '/assets/accomodation/d.png'
    ]
  },
  {
    id: 4,
    name: 'Slate Student Documentation',
    description: 'Your comprehensive resource for tutorials, guides, and support to help CMU students and faculty navigate the college admissions process with confidence.',
    features: ['Documentation', 'Tutorials', 'Admissions Guide', 'Faculty Support'],
    status: 'Active',
    icon: BookOpen,
    color: 'bg-[#8F1A27]',
    link: 'http://localhost:3003',
    github: '#',
    images: [
      '/assets/slate/a.png',
      '/assets/slate/b.png',
      '/assets/slate/c.png',
      '/assets/slate/d.png',
      '/assets/slate/e.png'
    ]
  }
];

export default function ProductsPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState<{ [key: number]: number }>({});
  const [isPlaying, setIsPlaying] = useState<{ [key: number]: boolean }>(() => {
    // Initialize all products as playing
    const initialPlaying: { [key: number]: boolean } = {};
    products.forEach(product => {
      initialPlaying[product.id] = true;
    });
    return initialPlaying;
  });
  const [currentProduct, setCurrentProduct] = useState<number | null>(null);

  // Auto-advance images
  useEffect(() => {
    const intervals: number[] = [];
    
    products.forEach((product) => {
      const interval = setInterval(() => {
        if (isPlaying[product.id]) {
          setCurrentImageIndex(prev => ({
            ...prev,
            [product.id]: (prev[product.id] || 0 + 1) % product.images.length
          }));
        }
      }, 3000); // Rotate every 3 seconds
      intervals.push(interval);
    });

    return () => intervals.forEach(clearInterval);
  }, [isPlaying]);

  const nextImage = (productId: number, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0 + 1) % totalImages
    }));
  };

  const prevImage = (productId: number, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [productId]: prev[productId] === 0 ? totalImages - 1 : (prev[productId] || 0) - 1
    }));
  };

  const togglePlay = (productId: number) => {
    setIsPlaying(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-[#8F1A27] to-[#6A0032] overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              Innovation Products & Services
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Discover our comprehensive suite of tools and services designed to enhance the CMU student experience.
            </p>
            <div className="mt-6 flex justify-center">
              <div className="w-20 h-1 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {products.map((product) => {
            const IconComponent = product.icon;
            const currentIndex = currentImageIndex[product.id] || 0;
            const isProductPlaying = isPlaying[product.id] || false;

            return (
              <Card key={product.id} className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-xl overflow-hidden bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4 px-6 pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-xl ${product.color} text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl font-bold text-gray-900 mb-1">
                          {product.name}
                        </CardTitle>
                        <Badge 
                          variant={product.status === 'Active' ? 'default' : 'secondary'}
                          className="bg-[#8F1A27] text-white px-2 py-1 text-xs font-medium"
                        >
                          {product.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                {/* Media Slider */}
                <div className="relative h-64 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    {product.id === 1 ? (
                      // Mobile phone frame for the mobile app
                      <div className="relative w-48 h-80 bg-black rounded-[3rem] p-2 shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                        <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                          <div className="relative w-full h-full">
                            <Image
                              src={product.images[currentIndex]}
                              alt={`${product.name} screenshot ${currentIndex + 1}`}
                              fill
                              className="object-cover"
                              priority={currentIndex === 0}
                              onError={(e) => {
                                console.error(`Failed to load image: ${product.images[currentIndex]}`);
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const fallback = target.parentElement?.querySelector('.fallback-content');
                                if (fallback) {
                                  (fallback as HTMLElement).style.display = 'flex';
                                }
                              }}
                            />
                            {/* Fallback content */}
                            <div className="fallback-content absolute inset-0 flex items-center justify-center" style={{ display: 'none' }}>
                              <div className="text-gray-400 text-center">
                                <div className="w-12 h-12 mx-auto mb-3 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <IconComponent className="w-6 h-6 text-gray-400" />
                                </div>
                                <p className="text-xs">Mobile Screenshots</p>
                                <p className="text-xs text-gray-500 mt-1">Loading...</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        {/* Phone notch */}
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl"></div>
                        {/* Home indicator */}
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-black rounded-full"></div>
                      </div>
                    ) : (
                      // Regular image display for other products
                      <div className="relative w-full h-full rounded-xl overflow-hidden shadow-lg">
                        <Image
                          src={product.images[currentIndex]}
                          alt={`${product.name} screenshot ${currentIndex + 1}`}
                          fill
                          className="object-cover"
                          priority={currentIndex === 0}
                          onError={(e) => {
                            console.error(`Failed to load image: ${product.images[currentIndex]}`);
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const fallback = target.parentElement?.querySelector('.fallback-content');
                            if (fallback) {
                              (fallback as HTMLElement).style.display = 'flex';
                            }
                          }}
                        />
                        {/* Fallback content */}
                        <div className="fallback-content absolute inset-0 flex items-center justify-center" style={{ display: 'none' }}>
                          <div className="text-gray-400 text-center">
                            <div className="w-12 h-12 mx-auto mb-3 bg-gray-200 rounded-lg flex items-center justify-center">
                              <IconComponent className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-xs">Product Screenshots</p>
                            <p className="text-xs text-gray-500 mt-1">Loading...</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Navigation Controls */}
                  <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-white/90 hover:bg-white text-gray-800 rounded-full w-8 h-8 p-0 shadow-lg"
                      onClick={() => prevImage(product.id, product.images.length)}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-white/90 hover:bg-white text-gray-800 rounded-full w-8 h-8 p-0 shadow-lg"
                      onClick={() => nextImage(product.id, product.images.length)}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Play/Pause Control */}
                  <div className="absolute top-4 right-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-white/90 hover:bg-white text-gray-800 rounded-full w-8 h-8 p-0 shadow-lg"
                      onClick={() => togglePlay(product.id)}
                    >
                      {isProductPlaying ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  {/* Image Indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {product.images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentIndex ? 'bg-white shadow-lg' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <CardContent className="space-y-4 p-6">
                  <CardDescription className="text-gray-600 leading-relaxed text-base">
                    {product.description}
                  </CardDescription>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 text-base">Key Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-[#8F1A27]/5 border-[#8F1A27]/20 text-[#8F1A27] px-3 py-1 font-medium">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="group-hover:bg-[#8F1A27] group-hover:text-white border-[#8F1A27] text-[#8F1A27] hover:bg-[#8F1A27] hover:text-white transition-colors duration-300"
                        onClick={() => window.open(product.link, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Visit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        className="group-hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors duration-300"
                        onClick={() => window.open(product.github, '_blank')}
                      >
                        <Github className="w-3 h-3 mr-1" />
                        GitHub
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-[#8F1A27] to-[#6A0032] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Explore our products and discover how we're enhancing the CMU student experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-[#8F1A27] hover:bg-gray-100 px-6 py-2 text-base font-semibold shadow-lg">
                Contact Us
              </Button>
              <Button size="lg" variant="outline" className="border-white text-[#8F1A27] hover:bg-white hover:text-[#8F1A27] px-6 py-2 text-base font-semibold">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 