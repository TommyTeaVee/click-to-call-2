import { h, JSX } from 'preact' // lgtm [js/unused-local-variable]
import { useRef } from 'preact/hooks'

import { useObserver } from '../hooks'

interface AudioProps {
  stream: MediaStream | null
}

const Audio = ({ stream }: AudioProps): JSX.Element => {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useObserver(stream, () => {
    const audioEl = audioRef.current

    if (audioEl === null) return

    if (stream) {
      audioEl.srcObject = stream
      audioEl.play().catch(err => console.error('[C2C] Audio error', err))
    } else {
      audioEl.pause()
      audioEl.currentTime = 0
    }
  })

  return <audio ref={audioRef} id="c2c-audio" />
}

export default Audio
