// Exercise library. Home moves are quiet, low impact and fit a towel's length:
// no jumping, and anything needing furniture works with a chair or bed edge.

export type Pattern = 'push' | 'squat' | 'lunge' | 'hinge' | 'back' | 'core' | 'calves' | 'warmup'
export type Area = 'knees' | 'lowerBack' | 'shoulders' | 'wrists'

export interface Exercise {
  id: string
  name: string
  pattern: Pattern
  kind: 'reps' | 'time'
  perSide?: boolean
  muscles: string[]
  description: string
  tips: string[]
  needs?: string
  loads: Area[] // areas this move puts load through, for the niggles setting later
  start: number // starting reps or seconds
  step: number // how much to add when a session goes well
  max: number
  ladder?: { family: string; rank: number } // easier to harder variations
}

export const patternLabels: Record<Pattern, string> = {
  push: 'Push',
  squat: 'Squat',
  lunge: 'Lunge',
  hinge: 'Glutes and hamstrings',
  back: 'Back',
  core: 'Core',
  calves: 'Calves',
  warmup: 'Warm up',
}

export const exercises: Exercise[] = [
  // Press up ladder, easiest first
  {
    id: 'incline-press-up',
    name: 'Incline press up',
    pattern: 'push',
    kind: 'reps',
    muscles: ['Chest', 'Shoulders', 'Triceps'],
    description: 'Hands on the edge of a sofa, chair or bed, body in a straight line. Lower your chest to the edge, then push back up.',
    tips: ['Squeeze your bum so your hips don’t sag', 'Elbows at about 45°, not flared out', 'Make sure the chair can’t slide'],
    needs: 'Sofa, chair or bed edge',
    loads: ['shoulders', 'wrists'],
    start: 8, step: 1, max: 15,
    ladder: { family: 'pressup', rank: 1 },
  },
  {
    id: 'knee-press-up',
    name: 'Knee press up',
    pattern: 'push',
    kind: 'reps',
    muscles: ['Chest', 'Shoulders', 'Triceps'],
    description: 'Press up from your knees, keeping a straight line from knees to head. Lower until your chest is just off the floor.',
    tips: ['Put a folded towel under your knees', 'Keep your hips in line, not up in the air', 'Lower slowly, push up firmly'],
    loads: ['shoulders', 'wrists', 'knees'],
    start: 8, step: 1, max: 15,
    ladder: { family: 'pressup', rank: 2 },
  },
  {
    id: 'press-up',
    name: 'Press up',
    pattern: 'push',
    kind: 'reps',
    muscles: ['Chest', 'Shoulders', 'Triceps', 'Core'],
    description: 'Hands just wider than your shoulders, body straight from heels to head. Lower your chest towards the floor and push back up.',
    tips: ['Brace like someone’s about to poke your stomach', 'Elbows at about 45°', 'Full range: chest close to the floor'],
    loads: ['shoulders', 'wrists'],
    start: 6, step: 1, max: 15,
    ladder: { family: 'pressup', rank: 3 },
  },
  {
    id: 'wide-press-up',
    name: 'Wide press up',
    pattern: 'push',
    kind: 'reps',
    muscles: ['Chest', 'Shoulders'],
    description: 'A press up with your hands set wider than usual, which puts more work through the chest.',
    tips: ['Hands about one and a half shoulder widths apart', 'Keep the body straight', 'Control the way down'],
    loads: ['shoulders', 'wrists'],
    start: 6, step: 1, max: 15,
    ladder: { family: 'pressup', rank: 4 },
  },
  {
    id: 'diamond-press-up',
    name: 'Diamond press up',
    pattern: 'push',
    kind: 'reps',
    muscles: ['Triceps', 'Chest'],
    description: 'Hands close together under your chest, thumbs and fingers making a diamond. Lower and push back up.',
    tips: ['Elbows brush your sides', 'Drop to your knees if your form slips', 'Keep your neck long'],
    loads: ['shoulders', 'wrists'],
    start: 5, step: 1, max: 12,
    ladder: { family: 'pressup', rank: 5 },
  },
  {
    id: 'decline-press-up',
    name: 'Decline press up',
    pattern: 'push',
    kind: 'reps',
    muscles: ['Upper chest', 'Shoulders', 'Triceps'],
    description: 'Feet up on a chair or bed edge, hands on the floor. Lower your chest to the floor and push up.',
    tips: ['Keep your hips level, don’t pike', 'Look at the floor just ahead of your hands', 'Go slowly on the way down'],
    needs: 'Chair or bed edge',
    loads: ['shoulders', 'wrists'],
    start: 5, step: 1, max: 12,
    ladder: { family: 'pressup', rank: 6 },
  },
  {
    id: 'chair-dip',
    name: 'Chair dip',
    pattern: 'push',
    kind: 'reps',
    muscles: ['Triceps', 'Shoulders'],
    description: 'Hands on the edge of a sturdy chair or bed behind you, feet on the floor. Bend your elbows to lower, then straighten.',
    tips: ['Keep your back close to the edge', 'Only go as low as your shoulders are happy with', 'Bend your knees to make it easier'],
    needs: 'Sturdy chair or bed edge',
    loads: ['shoulders', 'wrists'],
    start: 8, step: 1, max: 15,
  },
  {
    id: 'pike-press-up',
    name: 'Pike press up',
    pattern: 'push',
    kind: 'reps',
    muscles: ['Shoulders', 'Triceps'],
    description: 'Hips high in an upside down V. Bend your elbows to bring the top of your head towards the floor, then push back up.',
    tips: ['Walk your feet in to make it harder', 'Head goes forward of your hands', 'Move slowly'],
    loads: ['shoulders', 'wrists'],
    start: 5, step: 1, max: 12,
  },

  // Squat
  {
    id: 'squat',
    name: 'Squat',
    pattern: 'squat',
    kind: 'reps',
    muscles: ['Quads', 'Glutes'],
    description: 'Feet shoulder width apart. Sit back and down as if onto a low chair, then stand up tall.',
    tips: ['Knees follow your toes', 'Weight through your whole foot', 'Chest up'],
    loads: ['knees'],
    start: 12, step: 2, max: 25,
  },
  {
    id: 'tempo-squat',
    name: 'Slow squat',
    pattern: 'squat',
    kind: 'reps',
    muscles: ['Quads', 'Glutes'],
    description: 'A squat taking three seconds on the way down, a short pause at the bottom, then stand up.',
    tips: ['Count three on the way down', 'Stay tight at the bottom', 'Stand up smoothly'],
    loads: ['knees'],
    start: 8, step: 1, max: 15,
  },
  {
    id: 'sumo-squat',
    name: 'Wide squat',
    pattern: 'squat',
    kind: 'reps',
    muscles: ['Inner thighs', 'Glutes', 'Quads'],
    description: 'Feet wide with toes turned out. Sit straight down between your heels and stand back up.',
    tips: ['Push your knees out over your toes', 'Keep your back upright', 'Squeeze your bum at the top'],
    loads: ['knees'],
    start: 12, step: 2, max: 25,
  },
  {
    id: 'wall-sit',
    name: 'Wall sit',
    pattern: 'squat',
    kind: 'time',
    muscles: ['Quads', 'Glutes'],
    description: 'Back flat against a wall, slide down until your thighs are roughly level with the floor. Hold.',
    tips: ['Knees over your ankles', 'Press your lower back into the wall', 'Higher is fine if your knees grumble'],
    needs: 'Wall',
    loads: ['knees'],
    start: 30, step: 5, max: 90,
  },

  // Lunge
  {
    id: 'split-squat',
    name: 'Split squat',
    pattern: 'lunge',
    kind: 'reps',
    perSide: true,
    muscles: ['Quads', 'Glutes'],
    description: 'One foot forward, one back, like a long stride. Lower your back knee towards the floor and come back up. Do all reps, then swap.',
    tips: ['Front knee tracks over your toes', 'Stay tall through your body', 'Hold a wall or chair for balance if needed'],
    loads: ['knees'],
    start: 8, step: 1, max: 15,
  },
  {
    id: 'reverse-lunge',
    name: 'Reverse lunge',
    pattern: 'lunge',
    kind: 'reps',
    perSide: true,
    muscles: ['Quads', 'Glutes', 'Hamstrings'],
    description: 'Step one foot back and lower the back knee towards the floor, then push through the front foot to stand. Place your foot down softly.',
    tips: ['Step back, not out to the side', 'Put your foot down quietly', 'Push through the front heel'],
    loads: ['knees'],
    start: 8, step: 1, max: 15,
  },
  {
    id: 'side-lunge',
    name: 'Side lunge',
    pattern: 'lunge',
    kind: 'reps',
    perSide: true,
    muscles: ['Inner thighs', 'Glutes', 'Quads'],
    description: 'Feet wide. Shift your weight to one side, bending that knee and keeping the other leg straight, then push back to the middle.',
    tips: ['Sit your hips back', 'Keep both feet flat', 'Chest up'],
    loads: ['knees'],
    start: 6, step: 1, max: 12,
  },

  // Hinge
  {
    id: 'glute-bridge',
    name: 'Glute bridge',
    pattern: 'hinge',
    kind: 'reps',
    muscles: ['Glutes', 'Hamstrings'],
    description: 'Lie on your back, knees bent, feet flat. Push through your heels to lift your hips until your body is straight from knees to shoulders. Lower slowly.',
    tips: ['Squeeze your bum at the top for a second', 'Don’t arch your lower back', 'Feet about a foot from your bum'],
    loads: [],
    start: 12, step: 2, max: 25,
  },
  {
    id: 'single-leg-bridge',
    name: 'Single leg glute bridge',
    pattern: 'hinge',
    kind: 'reps',
    perSide: true,
    muscles: ['Glutes', 'Hamstrings'],
    description: 'A glute bridge with one foot on the floor and the other leg held up straight or bent. Do all reps, then swap.',
    tips: ['Keep your hips level', 'Drive through the heel on the floor', 'Pause at the top'],
    loads: [],
    start: 8, step: 1, max: 15,
  },
  {
    id: 'bridge-hold',
    name: 'Glute bridge hold',
    pattern: 'hinge',
    kind: 'time',
    muscles: ['Glutes', 'Hamstrings'],
    description: 'Lift into a glute bridge and hold it at the top.',
    tips: ['Keep squeezing your bum', 'Ribs down, don’t arch', 'Breathe steadily'],
    loads: [],
    start: 30, step: 5, max: 60,
  },

  // Back
  {
    id: 'superman-hold',
    name: 'Superman hold',
    pattern: 'back',
    kind: 'time',
    muscles: ['Lower back', 'Glutes', 'Upper back'],
    description: 'Lie face down, arms out in front. Lift your arms, chest and legs a few centimetres off the floor and hold.',
    tips: ['Small lift, long body', 'Look at the floor, not up', 'Squeeze your bum'],
    loads: ['lowerBack'],
    start: 20, step: 5, max: 45,
  },
  {
    id: 'reverse-snow-angel',
    name: 'Reverse snow angel',
    pattern: 'back',
    kind: 'reps',
    muscles: ['Upper back', 'Rear shoulders'],
    description: 'Lie face down with your chest slightly lifted. Sweep your arms from by your hips round to overhead and back, keeping them off the floor.',
    tips: ['Thumbs pointing up', 'Slow and smooth', 'Keep your neck relaxed'],
    loads: ['shoulders'],
    start: 8, step: 1, max: 15,
  },
  {
    id: 'prone-y-raise',
    name: 'Y raise',
    pattern: 'back',
    kind: 'reps',
    muscles: ['Upper back', 'Shoulders'],
    description: 'Lie face down, arms overhead in a Y shape. Lift your arms off the floor, pause, then lower.',
    tips: ['Thumbs up', 'Pull your shoulder blades down and back', 'Small lift is fine'],
    loads: ['shoulders'],
    start: 8, step: 1, max: 15,
  },

  // Core
  {
    id: 'plank',
    name: 'Plank',
    pattern: 'core',
    kind: 'time',
    muscles: ['Core', 'Shoulders'],
    description: 'On your forearms and toes, body in a straight line from head to heels. Hold.',
    tips: ['Squeeze your bum and brace your stomach', 'Elbows under your shoulders', 'Drop to your knees if your hips sag'],
    loads: ['shoulders', 'lowerBack'],
    start: 20, step: 5, max: 90,
  },
  {
    id: 'side-plank',
    name: 'Side plank',
    pattern: 'core',
    kind: 'time',
    perSide: true,
    muscles: ['Obliques', 'Core', 'Shoulders'],
    description: 'On one forearm and the side of your feet, lift your hips so your body is straight. Hold, then swap sides when the timer beeps.',
    tips: ['Elbow under your shoulder', 'Hips up, don’t let them drop', 'Bottom knee down to make it easier'],
    loads: ['shoulders'],
    start: 15, step: 5, max: 45,
  },
  {
    id: 'dead-bug',
    name: 'Dead bug',
    pattern: 'core',
    kind: 'reps',
    perSide: true,
    muscles: ['Core'],
    description: 'Lie on your back, arms up, knees bent over your hips. Slowly lower one arm and the opposite leg towards the floor, then return and swap.',
    tips: ['Lower back stays pressed into the floor', 'Breathe out as you reach', 'Slow is better'],
    loads: [],
    start: 6, step: 1, max: 12,
  },
  {
    id: 'bird-dog',
    name: 'Bird dog',
    pattern: 'core',
    kind: 'reps',
    perSide: true,
    muscles: ['Core', 'Lower back', 'Glutes'],
    description: 'On hands and knees. Reach one arm forward and the opposite leg back until both are straight, pause, return and swap.',
    tips: ['Keep your hips level', 'Reach long rather than high', 'Pause for a second at full stretch'],
    loads: ['wrists', 'knees'],
    start: 6, step: 1, max: 12,
  },
  {
    id: 'slow-mountain-climber',
    name: 'Slow mountain climber',
    pattern: 'core',
    kind: 'reps',
    perSide: true,
    muscles: ['Core', 'Shoulders', 'Hip flexors'],
    description: 'In a high plank, slowly draw one knee towards your chest, place it back, then swap. Controlled and quiet, no hopping.',
    tips: ['Shoulders over your wrists', 'Keep your hips low', 'Step, don’t jump'],
    loads: ['wrists', 'shoulders'],
    start: 8, step: 2, max: 20,
  },
  {
    id: 'shoulder-tap',
    name: 'Plank shoulder tap',
    pattern: 'core',
    kind: 'reps',
    perSide: true,
    muscles: ['Core', 'Shoulders'],
    description: 'In a high plank with feet apart, lift one hand to tap the opposite shoulder, then swap. Keep your hips still.',
    tips: ['Wider feet makes it easier', 'Don’t rock side to side', 'Slow taps'],
    loads: ['wrists', 'shoulders'],
    start: 8, step: 2, max: 20,
  },
  {
    id: 'hollow-hold',
    name: 'Hollow hold',
    pattern: 'core',
    kind: 'time',
    muscles: ['Core'],
    description: 'Lie on your back, lift your shoulders and legs slightly off the floor with arms reaching forward. Hold.',
    tips: ['Lower back pressed into the floor', 'Bend your knees to make it easier', 'Keep breathing'],
    loads: [],
    start: 15, step: 5, max: 45,
  },

  // Calves
  {
    id: 'calf-raise',
    name: 'Calf raise',
    pattern: 'calves',
    kind: 'reps',
    muscles: ['Calves'],
    description: 'Stand tall, rise up onto your toes as high as you can, pause, then lower slowly.',
    tips: ['Hold a wall for balance', 'Pause at the top', 'Lower slowly, no bouncing'],
    loads: [],
    start: 15, step: 2, max: 30,
  },
  {
    id: 'single-leg-calf-raise',
    name: 'Single leg calf raise',
    pattern: 'calves',
    kind: 'reps',
    perSide: true,
    muscles: ['Calves'],
    description: 'A calf raise standing on one foot. Do all reps, then swap.',
    tips: ['Hold a wall for balance', 'Full height every rep', 'Lower slowly'],
    loads: [],
    start: 10, step: 1, max: 20,
  },

  // Warm up (30 seconds each)
  {
    id: 'march',
    name: 'March on the spot',
    pattern: 'warmup',
    kind: 'time',
    muscles: ['Legs'],
    description: 'March on the spot, lifting your knees and swinging your arms. Keep it quiet.',
    tips: ['Land softly', 'Swing your arms'],
    loads: [],
    start: 30, step: 0, max: 30,
  },
  {
    id: 'arm-circles',
    name: 'Arm circles',
    pattern: 'warmup',
    kind: 'time',
    muscles: ['Shoulders'],
    description: 'Arms out to the side, make circles that get bigger. Switch direction halfway.',
    tips: ['Start small', 'Relax your neck'],
    loads: [],
    start: 30, step: 0, max: 30,
  },
  {
    id: 'hip-circles',
    name: 'Hip circles',
    pattern: 'warmup',
    kind: 'time',
    muscles: ['Hips', 'Lower back'],
    description: 'Hands on hips, draw big slow circles with your hips. Switch direction halfway.',
    tips: ['Keep your feet still', 'Big, easy circles'],
    loads: [],
    start: 30, step: 0, max: 30,
  },
  {
    id: 'good-morning',
    name: 'Bodyweight good morning',
    pattern: 'warmup',
    kind: 'time',
    muscles: ['Hamstrings', 'Lower back'],
    description: 'Hands on your chest, soft knees. Hinge forward at the hips with a flat back, then stand tall.',
    tips: ['Push your hips back', 'Flat back throughout'],
    loads: [],
    start: 30, step: 0, max: 30,
  },
  {
    id: 'cat-cow',
    name: 'Cat cow',
    pattern: 'warmup',
    kind: 'time',
    muscles: ['Spine'],
    description: 'On hands and knees, slowly round your back up, then let it dip down with your chest forward. Move with your breath.',
    tips: ['Slow and easy', 'Move through your whole back'],
    loads: [],
    start: 30, step: 0, max: 30,
  },
  {
    id: 'bodyweight-squat-warmup',
    name: 'Easy squats',
    pattern: 'warmup',
    kind: 'time',
    muscles: ['Legs', 'Hips'],
    description: 'Slow, easy squats through a comfortable range to loosen the hips and knees.',
    tips: ['Comfortable depth', 'Smooth pace'],
    loads: [],
    start: 30, step: 0, max: 30,
  },
]

export const exerciseById = new Map(exercises.map((e) => [e.id, e]))

export function getExercise(id: string): Exercise {
  const e = exerciseById.get(id)
  if (!e) throw new Error(`Unknown exercise ${id}`)
  return e
}

export function ladder(family: string): Exercise[] {
  return exercises.filter((e) => e.ladder?.family === family).sort((a, b) => a.ladder!.rank - b.ladder!.rank)
}

export const warmupIds = ['march', 'arm-circles', 'hip-circles', 'good-morning', 'cat-cow', 'bodyweight-squat-warmup']

export function formatTarget(e: Exercise, target: number): string {
  const unit = e.kind === 'time' ? `${target}s` : `${target} reps`
  return e.perSide ? `${unit} each side` : unit
}
