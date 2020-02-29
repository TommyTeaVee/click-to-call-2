import { h, Fragment, JSX } from 'preact' // lgtm [js/unused-local-variable]

import { useJssip, useObserver, useBeforeUnload } from './hooks'
import { createAudioPlayer } from './audioPlayer'
import { CallButton, Audio } from './components'
import { CALL_STATES } from './callStates'
import ringtone from '../../assets/ringtone.wav'

import { C2CConfig } from '../types'

const soundMap = {
  ringing: { filename: ringtone, volume: 1.0 }
}
const audioPlayer = createAudioPlayer(soundMap)

const getConfig = (): C2CConfig => {
  if (!window.c2c || !window.c2c._config) {
    throw new Error('[C2C] Missing configuration.')
  }

  return window.c2c._config
}

const ClickToCall = (): JSX.Element => {
  const { callto, position, text, color, ...sipConfig } = getConfig()
  const [{ isRegistered, callState }, makeCall, hangupCall, rtc] = useJssip(sipConfig)
  const isRinging = callState === CALL_STATES.RINGING

  const handleClick = (): void => (rtc.session ? hangupCall() : makeCall(callto))

  useObserver(callState, () => {
    audioPlayer.stopAll()
    if (isRinging) {
      audioPlayer.play('ringing', true)
    }
  })

  useBeforeUnload(rtc.session)

  return (
    <Fragment>
      <Audio stream={rtc.stream} />
      <CallButton
        callState={callState}
        color={color}
        isRegistered={isRegistered}
        position={position}
        text={text}
        onClick={handleClick}
      />
    </Fragment>
  )
}

export { ClickToCall }
