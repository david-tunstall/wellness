import { useLiveQuery } from 'dexie-react-hooks'
import { db, today } from '../db'
import Card from '../components/Card'

export default function Food() {
  const entries = useLiveQuery(() => db.food.where('date').equals(today()).toArray(), [])
  const protein = entries?.reduce((sum, e) => sum + (e.proteinG ?? 0), 0) ?? 0
  const kcal = entries?.reduce((sum, e) => sum + (e.kcal ?? 0), 0) ?? 0

  return (
    <div className="space-y-6">
      <h1 className="pt-2 text-3xl font-bold">Food</h1>
      <Card title="Today, roughly">
        <div className="flex gap-8">
          <div>
            <p className="text-3xl font-bold">{Math.round(protein)} g</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">protein</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{Math.round(kcal)}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">kcal</p>
          </div>
        </div>
      </Card>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Adding food (quick add, barcode and photo) is coming in a later update.
      </p>
    </div>
  )
}
