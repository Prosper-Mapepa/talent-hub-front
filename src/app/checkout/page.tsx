"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CreditCard, CheckCircle, AlertCircle, ArrowRight, Shield, Clock, } from "lucide-react"
import Link from "next/link"
import Visa from "@/assets/visa.png"
import Serviceee from "@/assets/designn.jpg"
import Cardd from "@/assets/cardd.png"
import Paypal from "@/assets/paypal.png"
import Image from "next/image"
import Paypall from "@/assets/paypall.png"

// Mock service data for demonstration
const mockServices = {
  "1": {
    id: 1,
    title: "Logo Design & Brand Identity",
    price: 150,
    provider: {
      id: 101,
      name: "Alex Chen",
      avatar: Serviceee,
      initials: "AC",
    },
    additionalServices: [
      { id: 1, title: "Rush delivery (24-48 hours)", price: 20 },
      { id: 2, title: "Additional revision round", price: 10 },
      { id: 3, title: "Social media kit (10 templates)", price: 25 },
    ],
  },
  "2": {
    id: 2,
    title: "Website Development",
    price: 300,
    provider: {
      id: 102,
      name: "Maya Johnson",
      avatar: Serviceee,
      initials: "MJ",
    },
    additionalServices: [
      { id: 1, title: "Rush delivery (3-5 days)", price: 50 },
      { id: 2, title: "Additional page", price: 30 },
      { id: 3, title: "SEO optimization", price: 40 },
    ],
  },
}

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId = searchParams.get("serviceId") || "1"

  // Get service data based on ID
  const service = mockServices[serviceId as keyof typeof mockServices]

  const [selectedAddons, setSelectedAddons] = useState<number[]>([])
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [formErrors, setFormErrors] = useState<string[]>([])
  const [orderComplete, setOrderComplete] = useState(false)

  // Calculate total price
  const basePrice = service.price
  const addonsTotal = selectedAddons.reduce((total, addonId) => {
    const addon = service.additionalServices.find((a) => a.id === addonId)
    return total + (addon ? addon.price : 0)
  }, 0)
  const serviceFee = Math.round(basePrice * 0.05) // 5% service fee
  const total = basePrice + addonsTotal + serviceFee

  // Toggle addon selection
  const toggleAddon = (addonId: number) => {
    setSelectedAddons((prev) => (prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]))
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormErrors([])
    setIsProcessing(true)

    // Simulate form validation
    const errors: string[] = []
    const form = e.target as HTMLFormElement
    const cardNumber = form["card-number"].value
    const cardName = form["card-name"].value
    const cardExpiry = form["card-expiry"].value
    const cardCvc = form["card-cvc"].value

    if (!cardNumber) errors.push("Card number is required")
    if (!cardName) errors.push("Cardholder name is required")
    if (!cardExpiry) errors.push("Expiration date is required")
    if (!cardCvc) errors.push("CVC is required")

    if (errors.length > 0) {
      setFormErrors(errors)
      setIsProcessing(false)
      return
    }

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setOrderComplete(true)
    }, 2000)
  }

  if (orderComplete) {
    return (
      <div className="  px-4 py-12 md:px-6 md:py-24  bg-[#F9F9F9]">
        <Card className="text-center ">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
            <CardDescription>Your order has been placed successfully</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-muted p-4">
              <div className="mb-4 text-center">
                <p className="text-sm text-muted-foreground">Order Reference</p>
                <p className="font-mono text-lg font-medium">#ORD-{Math.floor(100000 + Math.random() * 900000)}</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Service</span>
                  <span className="font-medium">{service.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Provider</span>
                  <span className="font-medium">{service.provider.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Amount</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <p className="text-muted-foreground">
              We've sent a confirmation email to your registered email address. You can also view your order details in
              your dashboard.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button variant="outline" asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button className="bg-[#680130] hover:bg-cmu-dark" asChild>
              <Link href={`/services/${service.id}`}>View Service</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 md:px-6 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#680130]">Checkout</h1>
        <p className="text-muted-foreground">Complete your purchase</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 overflow-hidden rounded-md bg-muted">
                    <img
                      src={service.provider.avatar.src}
                      alt={service.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">By {service.provider.name}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Base Price</span>
                    <span>${basePrice.toFixed(2)}</span>
                  </div>

                  {selectedAddons.length > 0 && (
                    <>
                      {selectedAddons.map((addonId) => {
                        const addon = service.additionalServices.find((a) => a.id === addonId)
                        if (!addon) return null
                        return (
                          <div key={addon.id} className="flex justify-between text-sm">
                            <span>{addon.title}</span>
                            <span>${addon.price.toFixed(2)}</span>
                          </div>
                        )
                      })}
                    </>
                  )}

                  <div className="flex justify-between text-sm">
                    <span>Service Fee</span>
                    <span>${serviceFee.toFixed(2)}</span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-3 text-sm">
                  <div className="flex items-start gap-2">
                    <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Estimated Delivery</p>
                      <p className="text-muted-foreground">
                        {selectedAddons.includes(1) ? "2-3 days (Rush)" : "7-10 days"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Secure Checkout</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <Shield className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <p>Your payment information is encrypted and secure</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <p>Funds are held in escrow until you approve the work</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <p>100% satisfaction guarantee or your money back</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {/* Additional Services */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Services</CardTitle>
                  <CardDescription>Enhance your order with these add-ons</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {service.additionalServices.map((addon) => (
                    <div key={addon.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`addon-${addon.id}`}
                          checked={selectedAddons.includes(addon.id)}
                          onCheckedChange={() => toggleAddon(addon.id)}
                        />
                        <Label htmlFor={`addon-${addon.id}`} className="cursor-pointer">
                          {addon.title}
                        </Label>
                      </div>
                      <span className="font-medium text-cmu-maroon">+${addon.price.toFixed(2)}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Project Requirements</CardTitle>
                  <CardDescription>Provide details about your project</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="requirements">Project Details</Label>
                    <Textarea
                      id="requirements"
                      placeholder="Describe your project requirements, preferences, and any specific details the service provider should know..."
                      className="min-h-[150px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="attachments">Attachments (Optional)</Label>
                    <div className="flex items-center gap-2">
                      <Input id="attachments" type="file" multiple />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Upload any relevant files or examples to help the provider understand your requirements better.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Select your preferred payment method</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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

                  <RadioGroup defaultValue="credit-card" value={paymentMethod} onValueChange={setPaymentMethod}>
                    <div className="flex items-center space-x-2 rounded-lg border p-4">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label htmlFor="credit-card" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-5 w-5 text-muted-foreground" />
                          <span>Credit / Debit Card</span>
                        </div>
                      </Label>
                      <div className="flex gap-1">
                        <Image src={Visa} alt="Visa" className="h-8 w-8" />
                        <Image src={Cardd} alt="Mastercard" className="h-8 w-8" />
                        <Image src={Paypal} alt="Amex" className="h-8 w-8" />
                    
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg border p-4">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Image src={Paypall} alt="PayPal" className="h-5 w-5" />
                          <span>PayPal</span>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "credit-card" && (
                    <div className="space-y-4 rounded-lg border p-4">
                      <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <Input id="card-number" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card-name">Cardholder Name</Label>
                        <Input id="card-name" placeholder="John Doe" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="card-expiry">Expiration Date</Label>
                          <Input id="card-expiry" placeholder="MM/YY" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="card-cvc">CVC</Label>
                          <Input id="card-cvc" placeholder="123" />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "paypal" && (
                    <div className="rounded-lg border p-4 text-center">
                      <p className="mb-4 text-muted-foreground">
                        You will be redirected to PayPal to complete your payment.
                      </p>
                      <img src="/placeholder.svg?height=40&width=150" alt="PayPal" className="mx-auto h-10 w-auto" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Billing Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                  <CardDescription>Enter your billing address</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postal-code">Postal Code</Label>
                      <Input id="postal-code" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" />
                  </div>
                </CardContent>
              </Card>

              {/* Terms and Conditions */}
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{" "}
                  <Link href="/terms" className="text-cmu-maroon hover:underline">
                    terms of service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-cmu-maroon hover:underline">
                    privacy policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-[#6A0032] hover:bg-cmu-dark"
                disabled={isProcessing}
                size="lg"
              >
                {isProcessing ? "Processing..." : `Pay $${total.toFixed(2)}`}
                {!isProcessing && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
