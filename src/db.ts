import Dexie, { type EntityTable } from 'dexie'

// Everything lives on this device. Tables for later phases are declared now
// so the schema starts stable; fields will grow as each feature is built.

export type WorkoutMode = 'gym' | 'home' | 'mobility'

export interface Workout {
  id?: number
  date: string // ISO date, e.g. 2026-10-26
  mode: WorkoutMode
  focus?: string
  durationMin?: number
  completedAt?: number
}

export interface WorkoutSet {
  id?: number
  workoutId: number
  exerciseId: string
  reps?: number
  weightKg?: number
  seconds?: number
}

export interface FoodEntry {
  id?: number
  date: string
  meal?: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  name: string
  kcal?: number
  proteinG?: number
  carbsG?: number
  fatG?: number
}

export interface SavedFood {
  id?: number
  name: string
  barcode?: string
  kcal?: number
  proteinG?: number
  carbsG?: number
  fatG?: number
  lastUsed?: number
}

export interface WeighIn {
  id?: number
  date: string
  kg: number
}

export interface Setting {
  key: string
  value: unknown
}

export const db = new Dexie('fettle') as Dexie & {
  workouts: EntityTable<Workout, 'id'>
  sets: EntityTable<WorkoutSet, 'id'>
  food: EntityTable<FoodEntry, 'id'>
  savedFoods: EntityTable<SavedFood, 'id'>
  weighIns: EntityTable<WeighIn, 'id'>
  settings: EntityTable<Setting, 'key'>
}

db.version(1).stores({
  workouts: '++id, date, mode',
  sets: '++id, workoutId, exerciseId',
  food: '++id, date',
  savedFoods: '++id, name, barcode, lastUsed',
  weighIns: '++id, &date',
  settings: 'key',
})

// Ask the browser not to clear our data when space is tight.
export async function requestPersistence(): Promise<boolean> {
  if (!navigator.storage?.persist) return false
  if (await navigator.storage.persisted()) return true
  return navigator.storage.persist()
}

export function today(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
