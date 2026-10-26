import { Link } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, today } from '../db'
import Card from '../components/Card'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Morning'
  if (h < 18) return 'Afternoon'
  return 'Evening'
}

function weekStart(): string {
  const d = new Date()
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7)) // Monday
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function HomeScreen() {
  const sessionsThisWeek = useLiveQuery(
    () => db.workouts.where('date').between(weekStart(), today(), true, true).count(),
    [],
  )

  return (
    <div className="space-y-6">
      <header className="pt-2">
        <p className="text-slate-500 dark:text-slate-400">{greeting()}, Dave</p>
        <h1 className="text-3xl font-bold">Fettle</h1>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/workout/gym"
          className="flex aspect-square flex-col items-center justify-center rounded-3xl bg-emerald-600 text-white shadow-md active:scale-[0.98]"
        >
          <span className="text-4xl font-bold">Gym</span>
          <span className="mt-1 text-sm text-emerald-100">Kit and weights</span>
        </Link>
        <Link
          to="/workout/home"
          className="flex aspect-square flex-col items-center justify-center rounded-3xl bg-sky-600 text-white shadow-md active:scale-[0.98]"
        >
          <span className="text-4xl font-bold">Home</span>
          <span className="mt-1 text-sm text-sky-100">No kit, quiet</span>
        </Link>
      </div>

      <Card title="This week">
        <p className="text-lg">
          {sessionsThisWeek === undefined
            ? '…'
            : sessionsThisWeek === 0
              ? 'Nothing logged yet. Whenever you’re ready.'
              : `${sessionsThisWeek} session${sessionsThisWeek === 1 ? '' : 's'} so far`}
        </p>
      </Card>
    </div>
  )
}
