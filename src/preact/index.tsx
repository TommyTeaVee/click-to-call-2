import { h, Fragment, JSX } from 'preact' // lgtm [js/unused-local-variable]

import { useJssip, useObserver, useBeforeUnload } from './hooks'
import { createAudioPlayer } from './audioPlayer'
import { CallButton, Audio } from './components'
import { CALL_STATES } from './callStates'
import ringtone from '../../assets/ringtone.wav'

const sipConfig = JSON.parse(window.atob('__BUNDLE_CONFIG__'))
const soundMap = {
  ringing: { filename: ringtone, volume: 1.0 }
}
const audioPlayer = createAudioPlayer(soundMap)

interface ClickToCallProps {
  callto: string
  color: string
  position: 'left' | 'right'
  text: string
}

const ClickToCall = ({ callto, color, position, text }: ClickToCallProps): JSX.Element => {
  const [{ isRegistered, callState }, makeCall, hangupCall, rtc] = useJssip(sipConfig)
  const isRinging = callState === CALL_STATES.RINGING

  useObserver(callState, () => {
    audioPlayer.stopAll()
    if (isRinging) {
      audioPlayer.play('ringing', true)
    }
  })

  useBeforeUnload(rtc.session)

  const handleClick = (): void => (rtc.session ? hangupCall() : makeCall(callto))

  return (
    <Fragment>
      <Audio stream={rtc.stream || null} />
      <CallButton
        callState={callState}
        color={color || '#1877F1'}
        isRegistered={isRegistered}
        position={position || 'right'}
        text={text || 'Call us!'}
        onClick={handleClick}
      />
    </Fragment>
  )
}

export { ClickToCall }
