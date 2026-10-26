import { exercises, getExercise, ladder, warmupIds, type Exercise, type Pattern } from './exercises'

export type HomeLength = 15 | 25 | 40

export interface PlannedExercise {
  exerciseId: string
  target: number
}

export interface HomePlan {
  mode: 'home'
  lengthMin: HomeLength
  warmup: boolean
  rounds: number
  restSec: number
  roundRestSec: number
  exercises: PlannedExercise[]
}

// What the generator needs to know about past sessions
export interface HomeHistory {
  targets: Record<string, number> // exerciseId -> current target
  pressUpLevel: string // current press up variation
  lastUsed: string[] // exercise ids from the last home session
}

const slots: Record<HomeLength, Pattern[]> = {
  15: ['push', 'squat', 'core', 'hinge', 'back'],
  25: ['push', 'squat', 'core', 'hinge', 'lunge', 'back', 'core'],
  40: ['push', 'squat', 'core', 'hinge', 'lunge', 'back', 'push', 'core', 'calves'],
}

const timing: Record<HomeLength, { restSec: number; roundRestSec: number }> = {
  15: { restSec: 15, roundRestSec: 45 },
  25: { restSec: 20, roundRestSec: 60 },
  40: { restSec: 20, roundRestSec: 75 },
}

const SECONDS_PER_REP = 3
const CHANGEOVER_SEC = 10 // getting into position
export const WARMUP_SEC = 30

export function targetFor(e: Exercise, history: Pick<HomeHistory, 'targets'>): number {
  return history.targets[e.id] ?? e.start
}

export function workSeconds(e: Exercise, target: number): number {
  const once = e.kind === 'time' ? target : target * SECONDS_PER_REP
  return (e.perSide ? once * 2 : once) + CHANGEOVER_SEC
}

function pick<T>(items: T[], rng: () => number): T {
  return items[Math.floor(rng() * items.length)]
}

// Options for a slot: the main push slot is always the current press up level,
// so press ups get gradually harder; everything else rotates.
export function candidatesFor(pattern: Pattern, isMainPush: boolean, history: HomeHistory): Exercise[] {
  if (pattern === 'push' && isMainPush) return [getExercise(history.pressUpLevel)]
  return exercises.filter((e) => e.pattern === pattern && !(pattern === 'push' && e.ladder))
}

export function buildHomePlan(
  lengthMin: HomeLength,
  warmup: boolean,
  history: HomeHistory,
  rng: () => number = Math.random,
): HomePlan {
  const chosen: Exercise[] = []
  let pushSeen = false
  for (const pattern of slots[lengthMin]) {
    const isMainPush = pattern === 'push' && !pushSeen
    if (pattern === 'push') pushSeen = true
    const options = candidatesFor(pattern, isMainPush, history).filter((e) => !chosen.includes(e))
    const fresh = options.filter((e) => !history.lastUsed.includes(e.id))
    chosen.push(pick(fresh.length ? fresh : options, rng))
  }

  const planned = chosen.map((e) => ({ exerciseId: e.id, target: targetFor(e, history) }))
  const { restSec, roundRestSec } = timing[lengthMin]
  const roundSec = roundSeconds(planned, restSec)
  const rounds = Math.max(2, Math.round((lengthMin * 60 + roundRestSec) / (roundSec + roundRestSec)))

  return { mode: 'home', lengthMin, warmup, rounds, restSec, roundRestSec, exercises: planned }
}

// Pick another exercise for the same slot, e.g. if a move doesn't suit the room
export function swapExercise(plan: HomePlan, index: number, history: HomeHistory, rng: () => number = Math.random): HomePlan {
  const current = getExercise(plan.exercises[index].exerciseId)
  const inPlan = plan.exercises.map((p) => p.exerciseId)
  const options = exercises.filter(
    (e) => e.pattern === current.pattern && !inPlan.includes(e.id) && !(current.pattern === 'push' && e.ladder && e.id !== history.pressUpLevel),
  )
  if (!options.length) return plan
  const next = pick(options, rng)
  const updated = [...plan.exercises]
  updated[index] = { exerciseId: next.id, target: targetFor(next, history) }
  return { ...plan, exercises: updated }
}

function roundSeconds(planned: PlannedExercise[], restSec: number): number {
  const work = planned.reduce((sum, p) => sum + workSeconds(getExercise(p.exerciseId), p.target), 0)
  return work + restSec * (planned.length - 1)
}

export function estimateMinutes(plan: HomePlan): number {
  const main = roundSeconds(plan.exercises, plan.restSec) * plan.rounds + plan.roundRestSec * (plan.rounds - 1)
  const warm = plan.warmup ? warmupIds.length * WARMUP_SEC : 0
  return Math.round((main + warm) / 60)
}

// The session as a flat list of steps for the timer screen
export type Step =
  | { type: 'warmup'; exerciseId: string; seconds: number }
  | { type: 'work'; exerciseId: string; target: number; round: number }
  | { type: 'rest'; seconds: number; round: number }

export function buildSteps(plan: HomePlan): Step[] {
  const steps: Step[] = []
  if (plan.warmup) for (const id of warmupIds) steps.push({ type: 'warmup', exerciseId: id, seconds: WARMUP_SEC })
  for (let round = 1; round <= plan.rounds; round++) {
    plan.exercises.forEach((p, i) => {
      steps.push({ type: 'work', exerciseId: p.exerciseId, target: p.target, round })
      const lastInRound = i === plan.exercises.length - 1
      if (!lastInRound) steps.push({ type: 'rest', seconds: plan.restSec, round })
      else if (round < plan.rounds) steps.push({ type: 'rest', seconds: plan.roundRestSec, round })
    })
  }
  return steps
}

export const pressUpLadder = () => ladder('pressup')
