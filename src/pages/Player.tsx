import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatTarget, getExercise, type Exercise } from '../lib/exercises'
import { buildSteps, type Step } from '../lib/homeWorkout'
import { beep, keepAwake, releaseAwake, unlockAudio } from '../lib/cues'
import { clearActiveSession, finishSession, getActiveSession, saveActiveSession, type ActiveSession } from '../lib/session'
import type { ProgressChange } from '../lib/progression'

export default function Player() {
  const navigate = useNavigate()
  const [session, setSession] = useState<ActiveSession | null>()
  const [summary, setSummary] = useState<{ changes: ProgressChange[]; minutes: number; sets: number } | null>(null)
  const [confirmEnd, setConfirmEnd] = useState(false)

  useEffect(() => {
    void getActiveSession().then(setSession)
    void keepAwake()
    const onVisible = () => document.visibilityState === 'visible' && void keepAwake()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      releaseAwake()
    }
  }, [])

  const steps = useMemo(() => (session ? buildSteps(session.plan) : []), [session?.plan])

  const finish = useCallback(async (s: ActiveSession) => {
    const changes = await finishSession(s)
    setSummary({
      changes,
      minutes: Math.max(1, Math.round((Date.now() - s.startedAt) / 60000)),
      sets: s.results.length,
    })
  }, [])

  const advance = useCallback(
    (done?: number) => {
      if (!session) return
      const step = steps[session.stepIndex]
      const results =
        step.type === 'work' && done !== undefined
          ? [...session.results, { exerciseId: step.exerciseId, target: step.target, done, round: step.round }]
          : session.results
      const next = { ...session, stepIndex: session.stepIndex + 1, results }
      if (next.stepIndex >= steps.length) {
        beep(true)
        void finish(next)
      } else {
        setSession(next)
        void saveActiveSession(next)
      }
    },
    [session, steps, finish],
  )

  if (summary) return <Summary {...summary} />
  if (session === undefined) return null
  if (session === null)
    return (
      <div className="space-y-4 pt-6">
        <p>No workout in progress.</p>
        <Link to="/" className="text-emerald-600 dark:text-brand">
          Back to the start
        </Link>
      </div>
    )

  const step = steps[session.stepIndex]
  const workSteps = steps.filter((s) => s.type === 'work').length
  const workDone = steps.slice(0, session.stepIndex).filter((s) => s.type === 'work').length
  const upNext = steps.slice(session.stepIndex + 1).find((s): s is Extract<Step, { type: 'work' }> => s.type === 'work')

  return (
    <div className="flex min-h-[calc(100dvh-4rem)] flex-col">
      <div className="flex items-center justify-between pt-2 text-sm text-slate-500 dark:text-slate-400">
        <span>
          {step.type === 'warmup' ? 'Warm up' : `Round ${step.round} of ${session.plan.rounds}`}
        </span>
        <button className="font-medium text-slate-600 dark:text-slate-300" onClick={() => setConfirmEnd(true)}>
          End
        </button>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
        <div className="h-full bg-sky-500 transition-all" style={{ width: `${(workDone / workSteps) * 100}%` }} />
      </div>

      <div className="flex flex-1 flex-col pt-6">
        {step.type === 'rest' && <RestStep key={session.stepIndex} seconds={step.seconds} next={upNext} onDone={() => advance()} />}
        {step.type === 'warmup' && (
          <TimedStep key={session.stepIndex} exercise={getExercise(step.exerciseId)} seconds={step.seconds} autoStart onDone={() => advance()} />
        )}
        {step.type === 'work' && getExercise(step.exerciseId).kind === 'time' && (
          <TimedStep key={session.stepIndex} exercise={getExercise(step.exerciseId)} seconds={step.target} onDone={(s) => advance(s)} />
        )}
        {step.type === 'work' && getExercise(step.exerciseId).kind === 'reps' && (
          <RepsStep key={session.stepIndex} exercise={getExercise(step.exerciseId)} target={step.target} onDone={(r) => advance(r)} />
        )}
      </div>

      {confirmEnd && (
        <div className="fixed inset-0 z-20 flex items-end bg-black/40 p-4" onClick={() => setConfirmEnd(false)}>
          <div className="mx-auto w-full max-w-md space-y-2 rounded-2xl bg-white p-4 dark:bg-slate-800" onClick={(e) => e.stopPropagation()}>
            <p className="pb-2 font-semibold">Finish here?</p>
            <button className="w-full rounded-xl bg-sky-600 py-3 font-semibold text-white" onClick={() => void finish(session)}>
              Save what I’ve done
            </button>
            <button
              className="w-full rounded-xl py-3 font-semibold ring-1 ring-slate-200 dark:ring-slate-600"
              onClick={async () => {
                await clearActiveSession()
                navigate('/')
              }}
            >
              Discard
            </button>
            <button className="w-full py-2 text-slate-500" onClick={() => setConfirmEnd(false)}>
              Keep going
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function ExerciseInfo({ exercise, detail }: { exercise: Exercise; detail: string }) {
  return (
    <div>
      <h1 className="text-3xl font-bold">{exercise.name}</h1>
      <p className="mt-1 text-lg text-sky-700 dark:text-sky-300">{detail}</p>
      <ul className="mt-4 space-y-1 text-slate-600 dark:text-slate-300">
        {exercise.tips.map((t) => (
          <li key={t}>· {t}</li>
        ))}
      </ul>
    </div>
  )
}

// Counts down to zero using the clock, so it stays right if the phone sleeps.
// Beeps on the last three seconds and a long beep at the end.
function useCountdown(totalSec: number, running: boolean, onEnd: () => void, onTick?: (remaining: number) => void) {
  const [remaining, setRemaining] = useState(totalSec)
  const endAt = useRef<number | null>(null)
  const lastBeep = useRef<number | null>(null)
  const ended = useRef(false)
  const callbacks = useRef({ onEnd, onTick })
  callbacks.current = { onEnd, onTick }

  useEffect(() => {
    if (!running) {
      endAt.current = null
      return
    }
    endAt.current = Date.now() + remaining * 1000
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((endAt.current! - Date.now()) / 1000))
      setRemaining(left)
      callbacks.current.onTick?.(left)
      if (left <= 3 && left > 0 && lastBeep.current !== left) {
        lastBeep.current = left
        beep()
      }
      if (left === 0 && !ended.current) {
        ended.current = true
        clearInterval(id)
        beep(true)
        callbacks.current.onEnd()
      }
    }, 200)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  const addSeconds = (sec: number) => {
    if (endAt.current !== null) endAt.current += sec * 1000
    setRemaining((r) => r + sec)
  }

  return [remaining, addSeconds] as const
}

function BigClock({ seconds }: { seconds: number }) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return (
    <p className="my-6 text-center text-8xl font-bold tabular-nums" aria-live="polite">
      {m > 0 ? `${m}:${String(s).padStart(2, '0')}` : s}
    </p>
  )
}

function TimedStep({
  exercise,
  seconds,
  autoStart = false,
  onDone,
}: {
  exercise: Exercise
  seconds: number
  autoStart?: boolean
  onDone: (secondsDone: number) => void
}) {
  const total = exercise.perSide ? seconds * 2 : seconds
  const [running, setRunning] = useState(autoStart)
  const [started, setStarted] = useState(autoStart)
  const switched = useRef(false)
  const [remaining] = useCountdown(total, running, () => onDone(seconds), (left) => {
    if (exercise.perSide && !switched.current && left <= seconds) {
      switched.current = true
      beep(true)
    }
  })
  const elapsed = total - remaining
  const onSecondSide = exercise.perSide && remaining <= seconds
  const shown = exercise.perSide ? (onSecondSide ? remaining : remaining - seconds) : remaining

  const detail = exercise.pattern === 'warmup' ? `${seconds}s` : formatTarget(exercise, seconds)

  return (
    <>
      <ExerciseInfo exercise={exercise} detail={detail} />
      {exercise.perSide && started && <p className="mt-4 text-center font-semibold">{onSecondSide ? 'Second side' : 'First side'}</p>}
      <BigClock seconds={shown} />
      <div className="mt-auto space-y-2">
        {!started ? (
          <button
            className="w-full rounded-2xl bg-sky-600 py-4 text-xl font-bold text-white"
            onClick={() => {
              unlockAudio()
              setStarted(true)
              setRunning(true)
            }}
          >
            Start timer
          </button>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            <button className="rounded-2xl py-4 font-semibold ring-1 ring-slate-300 dark:ring-slate-600" onClick={() => setRunning((r) => !r)}>
              {running ? 'Pause' : 'Resume'}
            </button>
            <button
              className="rounded-2xl bg-sky-600 py-4 font-semibold text-white"
              onClick={() => {
                setRunning(false)
                onDone(exercise.pattern === 'warmup' ? seconds : exercise.perSide ? Math.floor(elapsed / 2) : elapsed)
              }}
            >
              {exercise.pattern === 'warmup' ? 'Skip' : 'Stop here'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}

function RepsStep({ exercise, target, onDone }: { exercise: Exercise; target: number; onDone: (reps: number) => void }) {
  const [reps, setReps] = useState(target)
  return (
    <>
      <ExerciseInfo exercise={exercise} detail={formatTarget(exercise, target)} />
      <div className="mt-auto">
        <p className="mb-2 text-center text-sm text-slate-500 dark:text-slate-400">
          Reps done{exercise.perSide ? ' (each side)' : ''}
        </p>
        <div className="mb-4 flex items-center justify-center gap-6">
          <button
            className="h-14 w-14 rounded-full text-3xl ring-1 ring-slate-300 dark:ring-slate-600"
            onClick={() => setReps((r) => Math.max(0, r - 1))}
            aria-label="One fewer"
          >
            −
          </button>
          <span className="w-20 text-center text-6xl font-bold tabular-nums">{reps}</span>
          <button
            className="h-14 w-14 rounded-full text-3xl ring-1 ring-slate-300 dark:ring-slate-600"
            onClick={() => setReps((r) => r + 1)}
            aria-label="One more"
          >
            +
          </button>
        </div>
        <button className="w-full rounded-2xl bg-sky-600 py-4 text-xl font-bold text-white" onClick={() => onDone(reps)}>
          Done
        </button>
      </div>
    </>
  )
}

function RestStep({ seconds, next, onDone }: { seconds: number; next?: Extract<Step, { type: 'work' }>; onDone: () => void }) {
  const [remaining, addSeconds] = useCountdown(seconds, true, onDone)
  const nextEx = next && getExercise(next.exerciseId)
  return (
    <>
      <h1 className="text-3xl font-bold">Rest</h1>
      <BigClock seconds={remaining} />
      {nextEx && (
        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">Up next</p>
          <p className="text-lg font-semibold">{nextEx.name}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {formatTarget(nextEx, next.target)}
            {nextEx.needs ? ` · ${nextEx.needs}` : ''}
          </p>
        </div>
      )}
      <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
        <button className="rounded-2xl py-4 font-semibold ring-1 ring-slate-300 dark:ring-slate-600" onClick={() => addSeconds(15)}>
          +15s
        </button>
        <button className="rounded-2xl bg-sky-600 py-4 font-semibold text-white" onClick={onDone}>
          Skip rest
        </button>
      </div>
    </>
  )
}

function Summary({ changes, minutes, sets }: { changes: ProgressChange[]; minutes: number; sets: number }) {
  return (
    <div className="space-y-5 pt-6">
      <h1 className="text-3xl font-bold">Nice one</h1>
      <p className="text-lg">
        {sets > 0 ? `${minutes} min, ${sets} sets done.` : 'Nothing logged this time, and that’s fine.'}
      </p>
      {changes.length > 0 && (
        <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
          <p className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Next time</p>
          <ul className="space-y-1">
            {changes.map((c) => {
              const e = getExercise(c.exerciseId)
              return (
                <li key={c.exerciseId}>
                  {c.newExerciseId
                    ? `Ready to move up from ${e.name.toLowerCase()} to ${getExercise(c.newExerciseId).name.toLowerCase()}`
                    : `${e.name}: ${formatTarget(e, c.to)}`}
                </li>
              )
            })}
          </ul>
        </div>
      )}
      <Link to="/" className="block w-full rounded-2xl bg-sky-600 py-4 text-center text-xl font-bold text-white">
        Done
      </Link>
    </div>
  )
}
