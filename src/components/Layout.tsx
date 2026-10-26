import { NavLink, Outlet } from 'react-router-dom'
import UpdatePrompt from './UpdatePrompt'

const tabs = [
  { to: '/', label: 'Train', icon: 'M6 9v6M18 9v6M3 11v2M21 11v2M6 12h12' },
  { to: '/food', label: 'Food', icon: 'M7 3v8a2 2 0 0 0 2 2v8M11 3v8M7 7h4M17 3c-2 2-2 6 0 8v10' },
  { to: '/progress', label: 'Progress', icon: 'M4 20V10M10 20V4M16 20v-7M22 20H2' },
  { to: '/settings', label: 'Settings', icon: 'M4 6h16M4 12h16M4 18h16' },
]

export default function Layout() {
  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col">
      <main className="flex-1 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-28">
        <Outlet />
      </main>
      <UpdatePrompt />
      <nav className="fixed inset-x-0 bottom-0 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
        <ul className="mx-auto grid max-w-lg grid-cols-4">
          {tabs.map((t) => (
            <li key={t.to}>
              <NavLink
                to={t.to}
                end={t.to === '/'}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 py-2.5 text-xs font-medium ${
                    isActive ? 'text-emerald-600 dark:text-brand' : 'text-slate-500 dark:text-slate-400'
                  }`
                }
              >
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={t.icon} />
                </svg>
                {t.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
