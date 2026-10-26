import { useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

// Quietly mention when the app is ready to work offline. Updates install themselves.
export default function UpdatePrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
  } = useRegisterSW()

  useEffect(() => {
    if (!offlineReady) return
    const id = setTimeout(() => setOfflineReady(false), 5000)
    return () => clearTimeout(id)
  }, [offlineReady, setOfflineReady])

  if (!offlineReady) return null
  return (
    <div className="fixed inset-x-4 top-[max(1rem,env(safe-area-inset-top))] z-30 mx-auto flex max-w-md items-center justify-between rounded-xl bg-slate-800 px-4 py-3 text-sm text-white shadow-lg">
      <span>Fettle is ready to use offline.</span>
      <button className="font-semibold text-brand" onClick={() => setOfflineReady(false)}>
        OK
      </button>
    </div>
  )
}
