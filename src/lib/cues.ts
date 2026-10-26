// Beeps, vibration and keeping the screen awake during a workout.

let ctx: AudioContext | null = null

// iPhone Safari only allows sound after a tap, so call this from a button press
export function unlockAudio() {
  try {
    ctx ??= new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
  } catch {
    ctx = null
  }
}

export function beep(long = false) {
  if (ctx) {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.frequency.value = long ? 660 : 880
    gain.gain.setValueAtTime(0.25, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (long ? 0.6 : 0.15))
    osc.connect(gain).connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + (long ? 0.6 : 0.15))
  }
  navigator.vibrate?.(long ? 400 : 80)
}

let lock: WakeLockSentinel | null = null

export async function keepAwake() {
  try {
    if ('wakeLock' in navigator && document.visibilityState === 'visible') lock = await navigator.wakeLock.request('screen')
  } catch {
    lock = null
  }
}

export function releaseAwake() {
  void lock?.release()
  lock = null
}
