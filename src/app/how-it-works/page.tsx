import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  ArrowRight,
  Award,
  Briefcase,
  CreditCard,
  GraduationCap,
  MessageSquare,
  Shield,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react"

type Step = {
  icon: LucideIcon
  title: string
  description: string
}

const STUDENT_STEPS: Step[] = [
  { icon: Users, title: "Create profile", description: "Build a verified profile with your skills and portfolio." },
  { icon: Briefcase, title: "List talents", description: "Post services with clear pricing and work samples." },
  { icon: MessageSquare, title: "Manage network", description: "Message clients and manage projects in one place." },
  { icon: Star, title: "Build reputation", description: "Earn reviews that help you get hired again." },
]

const BUSINESS_STEPS: Step[] = [
  { icon: Users, title: "Browse talents", description: "Search verified students by skill and category." },
  { icon: Briefcase, title: "Post jobs", description: "Publish opportunities and review applications." },
  { icon: CreditCard, title: "Connect & network", description: "Build relationships with student talent." },
  { icon: Shield, title: "Quality assurance", description: "Verified profiles and platform protections." },
]

const TRUST_ITEMS: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: Shield, title: "Verified profiles", description: "Students verified through university credentials." },
  { icon: MessageSquare, title: "Secure messaging", description: "Private, in-platform communication." },
  { icon: Award, title: "Quality standards", description: "Reviews and support keep the community trusted." },
]

function IconBadge({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white ring-1 ring-[color:var(--vt-teal-600)]/12">
      <Icon className="h-[18px] w-[18px] text-[color:var(--vt-teal-700)]" strokeWidth={1.75} />
    </div>
  )
}

function StepCard({
  step,
  icon: Icon,
  title,
  description,
}: Step & { step: number }) {
  const stepLabel = String(step).padStart(2, "0")

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-[color:var(--vt-teal-600)]/10 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-[color:var(--vt-teal-600)]/8 bg-[color:var(--vt-mint-50)]/50 px-4 py-3.5 sm:px-5">
        <span className="text-xl font-bold tabular-nums leading-none text-[color:var(--vt-teal-700)]">
          {stepLabel}
        </span>
        <IconBadge icon={Icon} />
      </div>
      <div className="flex flex-1 flex-col gap-2 px-4 py-4 sm:px-5 sm:py-5">
        <h3 className="text-lg font-semibold leading-snug text-foreground">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>
      </div>
    </article>
  )
}

function TrustCard({ icon: Icon, title, description }: (typeof TRUST_ITEMS)[0]) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-[color:var(--vt-teal-600)]/10 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-[color:var(--vt-teal-600)]/8 bg-[color:var(--vt-mint-50)]/50 px-4 py-3.5 sm:px-5">
        <IconBadge icon={Icon} />
        <h3 className="text-lg font-semibold leading-snug text-foreground">{title}</h3>
      </div>
      <p className="flex-1 px-4 py-4 text-sm leading-relaxed text-muted-foreground sm:px-5 sm:py-5 sm:text-base">
        {description}
      </p>
    </article>
  )
}

function FlowSection({
  label,
  title,
  subtitle,
  icon: SectionIcon,
  steps,
  variant,
}: {
  label: string
  title: string
  subtitle: string
  icon: LucideIcon
  steps: Step[]
  variant: "mint" | "white"
}) {
  return (
    <section
      className={
        variant === "mint"
          ? "w-full bg-[color:var(--vt-mint-50)]/40 py-10 md:py-12"
          : "w-full bg-white py-10 md:py-12"
      }
    >
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="mb-6 md:mb-7">
          <div className="mb-2 flex items-center gap-2">
            <SectionIcon className="h-4 w-4 text-[color:var(--vt-teal-600)]" />
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--vt-teal-600)]">
              {label}
            </p>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            {title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">{subtitle}</p>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <StepCard key={step.title} step={index + 1} {...step} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="vt-hero -mt-16 text-white">
        <div className="mx-auto w-full px-4 pb-16 pt-28 sm:px-8 lg:px-12 xl:px-16 md:pb-24 md:pt-36">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-white/60">
              Simple · Verified · Connected
            </p>
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
              How <span className="vt-hero-gold">VeriTalent</span> works
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85 md:text-xl">
              One platform to showcase talent, find work, and connect with confidence.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="h-12 px-8 text-base bg-[color:var(--vt-teal-600)] text-white hover:bg-[color:var(--vt-teal-600)]/90"
                >
                  Start networking
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/services">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 border-white/30 bg-transparent px-8 text-base text-white hover:bg-white/10"
                >
                  Explore talents
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FlowSection
        label="Students"
        title="For students"
        subtitle="Four steps from signup to your first client."
        icon={GraduationCap}
        steps={STUDENT_STEPS}
        variant="mint"
      />

      <FlowSection
        label="Businesses"
        title="For businesses"
        subtitle="Find, hire, and collaborate with verified student talent."
        icon={Briefcase}
        steps={BUSINESS_STEPS}
        variant="white"
      />

      {/* Trust */}
      <section className="w-full border-t border-[color:var(--vt-teal-600)]/8 bg-[color:var(--vt-mint-50)]/25 py-10 md:py-12">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="mb-6 md:mb-7">
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Trust & safety
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
              Built for a community you can rely on.
            </p>
          </div>
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
            {TRUST_ITEMS.map((item) => (
              <TrustCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="vt-hero py-20 text-center text-white md:py-28">
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-6">
          <h2 className="text-3xl font-extrabold md:text-4xl lg:text-5xl">Ready to get started?</h2>
          <p className="mt-4 text-lg text-white/85 md:text-xl">
            Join VeriTalent today—free to sign up.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="h-12 bg-white px-8 text-base text-[color:var(--vt-teal-950)] hover:bg-white/90">
                Start networking
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/services">
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-white/30 bg-white/5 px-8 text-base text-white hover:bg-white/10"
              >
                Explore talents
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
