import { Link } from 'react-router-dom'
import Card from '../components/Card'

export default function WorkoutStart() {
  return (
    <div className="space-y-6">
      <header className="pt-2">
        <Link to="/" className="text-emerald-600 dark:text-brand">
          ← Back
        </Link>
      </header>
      <h1 className="text-3xl font-bold">Gym</h1>
      <Card>
        <p>Pick a focus or let Fettle rotate muscle groups, then log weights and reps as you go.</p>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">The gym workout builder is coming in the next update.</p>
      </Card>
    </div>
  )
}
