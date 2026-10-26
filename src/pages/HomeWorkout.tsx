import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getSetting, setSetting } from '../db'
import { formatTarget, getExercise } from '../lib/exercises'
import { buildHomePlan, estimateMinutes, swapExercise, type HomeHistory, type HomeLength, type HomePlan } from '../lib/homeWorkout'
import { getActiveSession, loadHomeHistory, saveActiveSession, type ActiveSession } from '../lib/session'
import { unlockAudio } from '../lib/cues'
import Card from '../components/Card'

const lengths: HomeLength[] = [15, 25, 40]

export default function HomeWorkout() {
  const navigate = useNavigate()
  const [history, setHistory] = useState<HomeHistory>()
  const [plan, setPlan] = useState<HomePlan>()
  const [active, setActive] = useState<ActiveSession | null>(null)

  useEffect(() => {
    void (async () => {
      const [h, length, warmup, a] = await Promise.all([
        loadHomeHistory(),
        getSetting<HomeLength>('homeLength', 25),
        getSetting('homeWarmup', true),
        getActiveSession(),
      ])
      setHistory(h)
      setPlan(buildHomePlan(length, warmup, h))
      setActive(a)
    })()
  }, [])

  if (!history || !plan) return null

  const rebuild = (length: HomeLength, warmup: boolean) => {
    void setSetting('homeLength', length)
    void setSetting('homeWarmup', warmup)
    setPlan(buildHomePlan(length, warmup, history))
  }

  const start = async () => {
    unlockAudio()
    await saveActiveSession({ plan, stepIndex: 0, results: [], startedAt: Date.now() })
    navigate('/workout/play')
  }

  return (
    <div className="space-y-5">
      <header className="pt-2">
        <Link to="/" className="text-emerald-600 dark:text-brand">
          ← Back
        </Link>
        <h1 className="mt-2 text-3xl font-bold">Home</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Quiet, no jumping, fits a towel’s length.</p>
      </header>

      {active && (
        <Card>
          <p>You’ve got a session in progress.</p>
          <button
            className="mt-3 w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white"
            onClick={() => {
              unlockAudio()
              navigate('/workout/play')
            }}
          >
            Carry on
          </button>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Length">
        {lengths.map((l) => (
          <button
            key={l}
            role="radio"
            aria-checked={plan.lengthMin === l}
            onClick={() => rebuild(l, plan.warmup)}
            className={`rounded-xl py-3 font-semibold ${
              plan.lengthMin === l ? 'bg-sky-600 text-white' : 'bg-white ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700'
            }`}
          >
            {l} min
          </button>
        ))}
      </div>

      <label className="flex items-center justify-between rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
        <span>Short warm up (3 min)</span>
        <input
          type="checkbox"
          className="h-5 w-5 accent-sky-600"
          checked={plan.warmup}
          onChange={(e) => rebuild(plan.lengthMin, e.target.checked)}
        />
      </label>

      <Card title={`${plan.rounds} rounds of this circuit · about ${estimateMinutes(plan)} min`}>
        <ul className="divide-y divide-slate-100 dark:divide-slate-700">
          {plan.exercises.map((p, i) => {
            const e = getExercise(p.exerciseId)
            return (
              <li key={p.exerciseId} className="flex items-center justify-between gap-3 py-2.5">
                <div>
                  <p className="font-medium">{e.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {formatTarget(e, p.target)}
                    {e.needs ? ` · ${e.needs}` : ''}
                  </p>
                </div>
                <button
                  className="shrink-0 rounded-lg px-3 py-1.5 text-sm text-sky-700 ring-1 ring-slate-200 dark:text-sky-300 dark:ring-slate-600"
                  onClick={() => setPlan(swapExercise(plan, i, history))}
                  aria-label={`Swap ${e.name}`}
                >
                  Swap
                </button>
              </li>
            )
          })}
        </ul>
      </Card>

      <button onClick={start} className="w-full rounded-2xl bg-sky-600 py-4 text-xl font-bold text-white shadow-md active:scale-[0.99]">
        Start
      </button>
    </div>
  )
}
