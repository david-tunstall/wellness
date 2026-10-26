import { useState } from 'react'
import { Link } from 'react-router-dom'
import { exercises, patternLabels, type Pattern } from '../lib/exercises'

const order: Pattern[] = ['push', 'squat', 'lunge', 'hinge', 'back', 'core', 'calves', 'warmup']

export default function Library() {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<string | null>(null)
  const q = query.trim().toLowerCase()
  const matches = exercises.filter(
    (e) => !q || e.name.toLowerCase().includes(q) || e.muscles.some((m) => m.toLowerCase().includes(q)),
  )

  return (
    <div className="space-y-5">
      <header className="pt-2">
        <Link to="/" className="text-emerald-600 dark:text-brand">
          ← Back
        </Link>
        <h1 className="mt-2 text-3xl font-bold">Exercises</h1>
      </header>

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name or muscle"
        className="w-full rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-sky-500 dark:bg-slate-800 dark:ring-slate-700"
      />

      {order.map((pattern) => {
        const group = matches.filter((e) => e.pattern === pattern)
        if (!group.length) return null
        return (
          <section key={pattern}>
            <h2 className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">{patternLabels[pattern]}</h2>
            <ul className="divide-y divide-slate-100 overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 dark:divide-slate-700 dark:bg-slate-800 dark:ring-slate-700">
              {group.map((e) => (
                <li key={e.id}>
                  <button
                    className="flex w-full items-center justify-between px-4 py-3 text-left"
                    onClick={() => setOpen(open === e.id ? null : e.id)}
                    aria-expanded={open === e.id}
                  >
                    <span className="font-medium">{e.name}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{e.muscles.slice(0, 2).join(', ')}</span>
                  </button>
                  {open === e.id && (
                    <div className="space-y-2 px-4 pb-4 text-sm">
                      <p>{e.description}</p>
                      <p className="text-slate-500 dark:text-slate-400">Works: {e.muscles.join(', ')}</p>
                      {e.needs && <p className="text-slate-500 dark:text-slate-400">Needs: {e.needs}</p>}
                      <ul className="space-y-0.5">
                        {e.tips.map((t) => (
                          <li key={t}>· {t}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )
      })}
      {!matches.length && <p className="text-slate-500">Nothing matches that.</p>}
    </div>
  )
}
