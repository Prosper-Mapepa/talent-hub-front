import Link from "next/link"
import type { ReactNode } from "react"

export function AuthFormShell({
  children,
  footer,
  wide,
  title,
  subtitle,
}: {
  children: ReactNode
  footer?: ReactNode
  wide?: boolean
  title?: string
  subtitle?: string
}) {
  return (
    <div
      className={`w-full rounded-2xl border border-border/50 bg-white p-8 shadow-sm md:p-10 ${
        wide ? "max-w-xl" : "max-w-md"
      }`}
    >
      {(title || subtitle) && (
        <header className="mb-8 space-y-2 text-center">
          {title && (
            <h1 className="text-2xl font-semibold tracking-tight text-[color:var(--vt-teal-950)] md:text-3xl">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              {subtitle}
            </p>
          )}
        </header>
      )}
      {children}
      {footer ? <div className="mt-8 text-center text-sm">{footer}</div> : null}
    </div>
  )
}

export function AuthFooterLink({
  text,
  linkText,
  href,
}: {
  text: string
  linkText: string
  href: string
}) {
  return (
    <p>
      <span className="text-muted-foreground">{text} </span>
      <Link
        href={href}
        className="font-semibold text-[color:var(--vt-teal-700)] hover:text-[color:var(--vt-gold-500)]"
      >
        {linkText}
      </Link>
    </p>
  )
}
