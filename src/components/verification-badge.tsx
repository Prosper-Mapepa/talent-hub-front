import { CheckCircle } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface VerificationBadgeProps {
  type: "email" | "student" | "portfolio" | "payment" | "identity" | "skills"
  size?: "sm" | "md" | "lg"
}

export function VerificationBadge({ type, size = "md" }: VerificationBadgeProps) {
  const sizeClasses = {
    sm: "text-xs py-0.5 px-1.5",
    md: "text-sm py-1 px-2",
    lg: "text-base py-1.5 px-3",
  }

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  const labels = {
    email: "Email Verified",
    student: "Student Verified",
    portfolio: "Portfolio Verified",
    payment: "Payment Verified",
    identity: "Identity Verified",
    skills: "Skills Verified",
  }

  const tooltips = {
    email: "User has verified their university email address",
    student: "User has verified their student status with university credentials",
    portfolio: "Portfolio has been reviewed and verified by moderators",
    payment: "Payment method has been verified",
    identity: "Identity has been verified with official documents",
    skills: "Skills have been verified through tests or credentials",
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className={`verified-badge inline-flex items-center gap-1 ${sizeClasses[size]}`}>
            <CheckCircle className={iconSizes[size]} />
            <span>{labels[type]}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltips[type]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default VerificationBadge

