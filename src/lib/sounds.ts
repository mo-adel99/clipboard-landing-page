const AudioFiles = {
  move: new Audio('/sounds/move.mp3'),
  win: new Audio('/sounds/win.mp3'),
  loss: new Audio('/sounds/loss.mp3'),
}

Object.values(AudioFiles).forEach(a => { a.load() })

export function playSound(name: keyof typeof AudioFiles) {
  const audio = AudioFiles[name]
  audio.currentTime = 0
  audio.play().catch(() => {})
}
