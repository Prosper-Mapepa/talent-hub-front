import type { ReactNode } from "react"

export function PageShell({
  children,
  className = "",
  innerClassName = "",
}: {
  children: ReactNode
  className?: string
  innerClassName?: string
}) {
  return (
    <div className={`vt-page ${className}`}>
      <div className={`vt-page-inner ${innerClassName}`}>{children}</div>
    </div>
  )
}

export function PageHeader({
  title,
  subtitle,
  action,
  badge,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
  badge?: string
}) {
  return (
    <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-3">
        {badge && (
          <span className="inline-block rounded-full bg-[color:var(--vt-mint-50)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[color:var(--vt-teal-700)] ring-1 ring-[color:var(--vt-teal-600)]/15">
            {badge}
          </span>
        )}
        <h1 className="vt-page-title">{title}</h1>
        {subtitle && <p className="vt-page-subtitle">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  )
}
