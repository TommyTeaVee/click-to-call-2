import { h, JSX } from 'preact'

import { useJssip, useObserver, useBeforeUnload } from './hooks'
import { createAudioPlayer } from './audioPlayer'
import { CallButton } from './components'
import { CALL_STATES } from './callStates'

const soundMap = {
  ringing: { filename: 'https://cdn.ipex.cz/sounds/ringbacktone.wav', volume: 1.0 }
}
const audioPlayer = createAudioPlayer(soundMap)

export interface ClickToCallProps {
  uri: string
  user: string
  socket: string
  password: string
  callto: string
  position?: string
  text?: string
  color?: string
}

const ClickToCall = ({
  callto,
  color,
  position,
  text,
  ...sipConfig
}: ClickToCallProps): JSX.Element => {
  const [{ isRegistered, callState }, makeCall, hangupCall, session] = useJssip(sipConfig)
  const isRinging = callState === CALL_STATES.RINGING

  useObserver(callState, () => {
    audioPlayer.stopAll()
    if (isRinging) {
      audioPlayer.play('ringing', true)
    }
  })

  useBeforeUnload(session)

  const handleClick = (): void => {
    if (session) {
      hangupCall()
    } else {
      makeCall(callto)
    }
  }

  return (
    <CallButton
      callState={callState}
      color={color}
      isRegistered={isRegistered}
      position={position}
      text={text}
      onClick={handleClick}
    />
  )
}

export { ClickToCall }
