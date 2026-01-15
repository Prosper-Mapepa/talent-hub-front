import type { Metadata } from "next"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Privacy Policy | CMUTalentHub",
  description: "Privacy Policy for CMUTalentHub",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50">
      <div className="mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-500">
            Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12">
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="mb-4 text-2xl font-bold text-[#8F1A27]">1. Introduction</h2>
            <Separator className="mb-6" />
            <p className="leading-7 text-gray-700">
              CMUTalentHub is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and mobile application.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="mb-4 text-2xl font-bold text-[#8F1A27]">2. Information We Collect</h2>
            <Separator className="mb-6" />
            <p className="mb-6 leading-7 text-gray-700">
              We collect information that you provide directly to us, including:
            </p>
            <ul className="space-y-3 pl-6">
              <li className="leading-7 text-gray-700 list-disc">Personal information (name, email address)</li>
              <li className="leading-7 text-gray-700 list-disc">Academic information (university affiliation, major, graduation year)</li>
              <li className="leading-7 text-gray-700 list-disc">Profile information (skills, projects, work experience, portfolio content)</li>
              <li className="leading-7 text-gray-700 list-disc">Business information (company details, job postings, contact information)</li>
              <li className="leading-7 text-gray-700 list-disc">Account credentials and authentication data</li>
              <li className="leading-7 text-gray-700 list-disc">Messages and communications sent through our platform</li>
              <li className="leading-7 text-gray-700 list-disc">Application and job-related information</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="mb-4 text-2xl font-bold text-[#8F1A27]">3. How We Use Your Information</h2>
            <Separator className="mb-6" />
            <p className="mb-6 leading-7 text-gray-700">
              We use the information we collect to:
            </p>
            <ul className="space-y-3 pl-6">
              <li className="leading-7 text-gray-700 list-disc">Provide, maintain, and improve our services</li>
              <li className="leading-7 text-gray-700 list-disc">Connect students with job opportunities and businesses</li>
              <li className="leading-7 text-gray-700 list-disc">Enable communication between users</li>
              <li className="leading-7 text-gray-700 list-disc">Verify user identities and ensure platform security</li>
              <li className="leading-7 text-gray-700 list-disc">Send you important updates, notifications, and administrative messages</li>
              <li className="leading-7 text-gray-700 list-disc">Personalize your experience and provide relevant content</li>
              <li className="leading-7 text-gray-700 list-disc">Monitor and analyze usage patterns to improve our platform</li>
              <li className="leading-7 text-gray-700 list-disc">Comply with legal obligations and enforce our terms of service</li>
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="mb-4 text-2xl font-bold text-[#8F1A27]">4. Information Sharing and Disclosure</h2>
            <Separator className="mb-6" />
            <p className="mb-6 leading-7 text-gray-700">
              We may share your information in the following circumstances:
            </p>
            <ul className="space-y-3 pl-6">
              <li className="leading-7 text-gray-700 list-disc"><span className="font-semibold text-gray-900">With other users:</span> Your profile information is visible to other users on the platform as intended by your privacy settings</li>
              {/* <li className="leading-7 text-gray-700 list-disc"><span className="font-semibold text-gray-900">Service providers:</span> We may share information with third-party service providers who perform services on our behalf</li>
              <li className="leading-7 text-gray-700 list-disc"><span className="font-semibold text-gray-900">Legal requirements:</span> We may disclose information if required by law or in response to valid legal requests</li>
              <li className="leading-7 text-gray-700 list-disc"><span className="font-semibold text-gray-900">Business transfers:</span> Information may be transferred in connection with a merger, acquisition, or sale of assets</li>
              <li className="leading-7 text-gray-700 list-disc"><span className="font-semibold text-gray-900">With your consent:</span> We may share information for any other purpose with your explicit consent</li> */}
            </ul>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="mb-4 text-2xl font-bold text-[#8F1A27]">5. Data Security</h2>
            <Separator className="mb-6" />
            <p className="leading-7 text-gray-700">
              We implement appropriate technical and organizational security measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="mb-4 text-2xl font-bold text-[#8F1A27]">6. Your Rights and Choices</h2>
            <Separator className="mb-6" />
            <p className="mb-6 leading-7 text-gray-700">
              You have the right to:
            </p>
            <ul className="space-y-3 pl-6">
              <li className="leading-7 text-gray-700 list-disc">Access and review your personal information</li>
              <li className="leading-7 text-gray-700 list-disc">Update or correct your information through your account settings</li>
              <li className="leading-7 text-gray-700 list-disc">Delete your account and associated data</li>
              <li className="leading-7 text-gray-700 list-disc">Opt-out of certain communications and data processing</li>
              <li className="leading-7 text-gray-700 list-disc">Request a copy of your data</li>
            </ul>
          </section>
{/* 
          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="mb-4 text-2xl font-bold text-[#8F1A27]">7. Children's Privacy</h2>
            <Separator className="mb-6" />
            <p className="leading-7 text-gray-700">
              Our services are not intended for individuals under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
            </p>
          </section> */}

          {/* <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="mb-4 text-2xl font-bold text-[#8F1A27]">8. Cookies and Tracking Technologies</h2>
            <Separator className="mb-6" />
            <p className="leading-7 text-gray-700">
              We use cookies and similar tracking technologies to enhance your experience, analyze usage, and assist with marketing efforts. You can control cookie preferences through your browser settings.
            </p>
          </section> */}

          <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="mb-4 text-2xl font-bold text-[#8F1A27]">9. Changes to This Privacy Policy</h2>
            <Separator className="mb-6" />
            <p className="leading-7 text-gray-700">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date. Your continued use of our services after such changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="bg-gradient-to-br from-[#8F1A27]/5 to-[#8F1A27]/10 rounded-2xl p-8 shadow-sm border border-[#8F1A27]/20">
            <h2 className="mb-4 text-2xl font-bold text-[#8F1A27]">10. Contact Us</h2>
            <Separator className="mb-6" />
            <p className="mb-6 leading-7 text-gray-700">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 space-y-3 border border-gray-200">
              <p className="leading-7 text-gray-700">
                <span className="font-semibold text-gray-900">Email:</span>{" "}
                <a href="mailto:privacy@cmutalenthub.com" className="text-[#8F1A27] hover:underline">
                  mapepapro@gmail.com
                </a>
              </p>
             
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
