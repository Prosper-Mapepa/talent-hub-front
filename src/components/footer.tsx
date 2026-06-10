import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">VeriTalent</span>
            </Link>
            <p className="text-sm text-muted-foreground">
            Connect, collaborate, and grow with verified student talent.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services" className="text-muted-foreground transition-colors hover:text-foreground">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-muted-foreground transition-colors hover:text-foreground">
                  Jobs
                </Link>
              </li>
              <li>
                <Link href="/students" className="text-muted-foreground transition-colors hover:text-foreground">
                  Students
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-muted-foreground transition-colors hover:text-foreground">
                  How It Works
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-muted-foreground transition-colors hover:text-foreground">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="text-muted-foreground transition-colors hover:text-foreground">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-muted-foreground transition-colors hover:text-foreground">
                  Safety Tips
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground transition-colors hover:text-foreground">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-muted-foreground transition-colors hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground transition-colors hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-muted-foreground transition-colors hover:text-foreground">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="text-muted-foreground transition-colors hover:text-foreground">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} VeriTalent. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

