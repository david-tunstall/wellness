import { useEffect, useState } from 'react'
import Card from '../components/Card'

export default function Settings() {
  const [persisted, setPersisted] = useState<boolean | null>(null)

  useEffect(() => {
    navigator.storage?.persisted?.().then(setPersisted)
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="pt-2 text-3xl font-bold">Settings</h1>
      <Card title="Your data">
        <p>Everything is stored on this phone only.</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          {persisted === null
            ? 'Checking storage…'
            : persisted
              ? 'Storage is marked as persistent, so the browser won’t clear it to save space.'
              : 'Tip: add Fettle to your home screen so the browser keeps your data safe.'}
        </p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Backup and restore is coming in a later update.</p>
      </Card>
      <Card title="About">
        <p>Fettle {__APP_VERSION__}</p>
      </Card>
    </div>
  )
}
