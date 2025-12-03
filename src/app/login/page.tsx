"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { login, clearError } from '@/lib/slices/authSlice';
import { Alert, AlertDescription } from '@/components/ui/alert';
import logo from '@/assets/ss.png';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: 'mapepa@mail.com',
    password: 'Pa$$w0rd!',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    console.log('user', user);
    
    // Only redirect if user just logged in (not if they're already authenticated)
    if (isAuthenticated && user) {
      // Redirect to homepage instead of dashboard to avoid redirect loops
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    return () => {
      dispatch(clearError());
    };
  }, [error, dispatch]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    dispatch(login(formData));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl border-0">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <Image src={logo} alt="App Icon" width={64} height={64} className="rounded-full shadow-md" />
          <CardTitle className="text-3xl font-extrabold text-center text-[#8F1A27] tracking-tight">CMU Talent<span className=" text-[#FFC540]">Hub</span></CardTitle>
          <CardDescription className="text-center text-gray-500">
            Sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'border-red-500' : ''}
                disabled={isLoading}
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'border-red-500' : ''}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  tabIndex={-1}
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
            <Button type="submit" className="w-full gradient-bg text-white bg-gradient-to-br from-[#8F1A27] via-[#6A0032] to-[#8F1A27] hover:bg-[#8F1A27]/90 rounded-lg shadow-md " disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          <div className="mt-8 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link href="/register" className="text-[#8F1A27] hover:underline font-bold">
              SignUp
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
