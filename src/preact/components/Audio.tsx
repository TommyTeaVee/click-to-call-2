import { h, JSX } from 'preact' // lgtm [js/unused-local-variable]
import { useRef, useEffect } from 'preact/hooks'

interface AudioProps {
  stream: MediaStream | null
}

const Audio = ({ stream }: AudioProps): JSX.Element => {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audioEl = audioRef.current

    if (audioEl !== null) {
      audioEl.srcObject = stream
      audioEl.play().catch(err => console.error('[C2C] Audio error', err))
    }
  }, [stream])

  return <audio ref={audioRef} id="c2c-audio" />
}

export default Audio
