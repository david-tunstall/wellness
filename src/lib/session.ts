import { db, getSetting, setSetting, today } from '../db'
import { getExercise } from './exercises'
import type { HomeHistory, HomePlan } from './homeWorkout'
import { progressFrom, type ProgressChange, type SetResult } from './progression'

export interface ActiveSession {
  plan: HomePlan
  stepIndex: number
  results: (SetResult & { round: number })[]
  startedAt: number
}

const ACTIVE = 'activeSession'

export async function loadHomeHistory(): Promise<HomeHistory> {
  const [progressRows, pressUpLevel, last] = await Promise.all([
    db.progress.toArray(),
    getSetting('pressUpLevel', 'incline-press-up'),
    db.workouts.where('mode').equals('home').last(),
  ])
  const lastSets = last?.id ? await db.sets.where('workoutId').equals(last.id).toArray() : []
  return {
    targets: Object.fromEntries(progressRows.map((p) => [p.exerciseId, p.target])),
    pressUpLevel,
    lastUsed: [...new Set(lastSets.map((s) => s.exerciseId))],
  }
}

export const getActiveSession = () => getSetting<ActiveSession | null>(ACTIVE, null)
export const saveActiveSession = (s: ActiveSession) => setSetting(ACTIVE, s)
export const clearActiveSession = () => db.settings.delete(ACTIVE)

// Save the finished session, apply progression, and return what changed
export async function finishSession(s: ActiveSession): Promise<ProgressChange[]> {
  const changes = progressFrom(s.results)
  await db.transaction('rw', [db.workouts, db.sets, db.progress, db.settings], async () => {
    if (s.results.length) {
      const workoutId = (await db.workouts.add({
        date: today(),
        mode: 'home',
        durationMin: Math.max(1, Math.round((Date.now() - s.startedAt) / 60000)),
        completedAt: Date.now(),
      })) as number
      await db.sets.bulkAdd(
        s.results.map((r) =>
          getExercise(r.exerciseId).kind === 'time'
            ? { workoutId, exerciseId: r.exerciseId, seconds: r.done }
            : { workoutId, exerciseId: r.exerciseId, reps: r.done },
        ),
      )
    }
    for (const c of changes) {
      if (c.newExerciseId) await setSetting('pressUpLevel', c.newExerciseId)
      else await db.progress.put({ exerciseId: c.exerciseId, target: c.to, updatedAt: Date.now() })
    }
    await db.settings.delete(ACTIVE)
  })
  return changes
}
