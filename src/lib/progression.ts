import { getExercise, ladder } from './exercises'

export interface SetResult {
  exerciseId: string
  target: number
  done: number // reps or seconds actually done
}

export interface ProgressChange {
  exerciseId: string
  from: number
  to: number
  newExerciseId?: string // moved up to a harder variation
}

// Gentle progression: if every set of an exercise hit its target, nudge the
// target up by one step next time. At the top of a ladder exercise's range,
// move on to the next variation at its starting target. Never goes down.
export function progressFrom(results: SetResult[]): ProgressChange[] {
  const byExercise = new Map<string, SetResult[]>()
  for (const r of results) byExercise.set(r.exerciseId, [...(byExercise.get(r.exerciseId) ?? []), r])

  const changes: ProgressChange[] = []
  for (const [id, sets] of byExercise) {
    const e = getExercise(id)
    if (e.pattern === 'warmup' || e.step === 0) continue
    const target = sets[0].target
    if (!sets.every((s) => s.done >= s.target)) continue

    if (target < e.max) {
      changes.push({ exerciseId: id, from: target, to: Math.min(e.max, target + e.step) })
    } else if (e.ladder) {
      const next = ladder(e.ladder.family).find((x) => x.ladder!.rank === e.ladder!.rank + 1)
      if (next) changes.push({ exerciseId: id, from: target, to: target, newExerciseId: next.id })
    }
  }
  return changes
}
