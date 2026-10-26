import { describe, expect, it } from 'vitest'
import { exercises, getExercise } from './exercises'
import { buildHomePlan, buildSteps, estimateMinutes, swapExercise, type HomeHistory, type HomeLength } from './homeWorkout'
import { progressFrom } from './progression'

const fresh: HomeHistory = { targets: {}, pressUpLevel: 'incline-press-up', lastUsed: [] }

// Small seeded random so tests are repeatable
function seeded(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
}

describe('home exercises', () => {
  it('has nothing that involves jumping', () => {
    for (const e of exercises) expect(`${e.name} ${e.description}`.toLowerCase()).not.toMatch(/jump|burpee|hop(?!ping)/)
  })
})

describe('buildHomePlan', () => {
  it.each([15, 25, 40] as HomeLength[])('fits roughly %i minutes without the warm up', (length) => {
    for (let seed = 1; seed < 50; seed++) {
      const plan = buildHomePlan(length, false, fresh, seeded(seed))
      const minutes = estimateMinutes(plan)
      expect(minutes).toBeGreaterThanOrEqual(length * 0.75)
      expect(minutes).toBeLessThanOrEqual(length * 1.25)
    }
  })

  it('uses the current press up level and no repeated exercises', () => {
    const plan = buildHomePlan(40, true, { ...fresh, pressUpLevel: 'press-up' }, seeded(3))
    const ids = plan.exercises.map((p) => p.exerciseId)
    expect(ids[0]).toBe('press-up')
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids.filter((id) => getExercise(id).ladder)).toHaveLength(1)
  })

  it('rotates away from last session where it can', () => {
    const first = buildHomePlan(25, false, fresh, seeded(7))
    const lastUsed = first.exercises.map((p) => p.exerciseId)
    const second = buildHomePlan(25, false, { ...fresh, lastUsed }, seeded(7))
    const repeats = second.exercises.filter((p) => lastUsed.includes(p.exerciseId) && !getExercise(p.exerciseId).ladder)
    expect(repeats.length).toBeLessThanOrEqual(1)
  })

  it('uses saved targets', () => {
    const plan = buildHomePlan(15, false, { ...fresh, targets: { 'incline-press-up': 12 } }, seeded(1))
    expect(plan.exercises[0]).toEqual({ exerciseId: 'incline-press-up', target: 12 })
  })

  it('swaps for another move of the same type', () => {
    const plan = buildHomePlan(25, false, fresh, seeded(2))
    const swapped = swapExercise(plan, 1, fresh, seeded(9))
    expect(swapped.exercises[1].exerciseId).not.toBe(plan.exercises[1].exerciseId)
    expect(getExercise(swapped.exercises[1].exerciseId).pattern).toBe(getExercise(plan.exercises[1].exerciseId).pattern)
  })
})

describe('buildSteps', () => {
  it('alternates work and rest with no rest at the very end', () => {
    const plan = buildHomePlan(15, true, fresh, seeded(4))
    const steps = buildSteps(plan)
    expect(steps.filter((s) => s.type === 'warmup')).toHaveLength(6)
    expect(steps.filter((s) => s.type === 'work')).toHaveLength(plan.exercises.length * plan.rounds)
    expect(steps.at(-1)!.type).toBe('work')
  })
})

describe('progressFrom', () => {
  it('nudges the target up when every set hits it', () => {
    expect(
      progressFrom([
        { exerciseId: 'plank', target: 30, done: 30 },
        { exerciseId: 'plank', target: 30, done: 32 },
      ]),
    ).toEqual([{ exerciseId: 'plank', from: 30, to: 35 }])
  })

  it('leaves it alone if a set fell short, and never lowers it', () => {
    expect(
      progressFrom([
        { exerciseId: 'squat', target: 16, done: 16 },
        { exerciseId: 'squat', target: 16, done: 12 },
      ]),
    ).toEqual([])
  })

  it('moves up the press up ladder at the top of the range', () => {
    expect(progressFrom([{ exerciseId: 'knee-press-up', target: 15, done: 15 }])).toEqual([
      { exerciseId: 'knee-press-up', from: 15, to: 15, newExerciseId: 'press-up' },
    ])
  })

  it('stops at the hardest variation', () => {
    expect(progressFrom([{ exerciseId: 'decline-press-up', target: 12, done: 12 }])).toEqual([])
  })
})
