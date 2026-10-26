import type { ReactNode } from 'react'

export default function Card({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
      {title && <h2 className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">{title}</h2>}
      {children}
    </section>
  )
}
