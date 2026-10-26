import { Link } from 'react-router-dom'
import Card from '../components/Card'

const copy = {
  gym: {
    title: 'Gym',
    blurb: 'Pick a focus or let Fettle rotate muscle groups, then log weights and reps as you go.',
  },
  home: {
    title: 'Home',
    blurb: 'Quiet, no jumping, fits a towel’s length. Good for the living room or a hotel room.',
  },
}

export default function WorkoutStart({ mode }: { mode: 'gym' | 'home' }) {
  const c = copy[mode]
  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3 pt-2">
        <Link to="/" className="text-emerald-600 dark:text-brand" aria-label="Back">
          ← Back
        </Link>
      </header>
      <h1 className="text-3xl font-bold">{c.title}</h1>
      <Card>
        <p>{c.blurb}</p>
        <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
          The workout builder is coming in the next update.
        </p>
      </Card>
    </div>
  )
}
