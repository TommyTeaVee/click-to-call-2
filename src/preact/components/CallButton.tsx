import { h, JSX } from 'preact' // lgtm [js/unused-local-variable]
import classnames from 'classnames'

import { useMemo } from 'preact/hooks'
import { SpeechBuble } from '../components'
import { callButtonStyles as styles } from './styles'
import { CALL_STATES, CallState } from '../callStates'

interface CallButton {
  callState: CallState
  isRegistered: boolean
  text?: string
  color?: string
  position?: string
  onClick(event: MouseEvent): void
}

const CallButton = ({
  isRegistered,
  callState,
  text = 'You can call us!',
  color = '#1877F1',
  position = 'right',
  onClick,
  ...props
}: CallButton): JSX.Element => {
  const callButtonClass = useMemo(() => styles.createCallButtonClass(color, position), [
    color,
    position
  ])

  const isFree = callState === CALL_STATES.FREE
  const isAnswered = callState === CALL_STATES.ANSWERED
  const isRinging = callState === CALL_STATES.RINGING
  const isConnecting = callState === CALL_STATES.CONNECTING
  const isHungup = callState === CALL_STATES.CALL_END
  const speechBubleShown = isFree && isRegistered

  return (
    <div
      className={classnames(callButtonClass, {
        disabled: !isRegistered,
        hangup: isConnecting || isRinging || isAnswered,
        ringing: isConnecting || isRinging,
        ended: isHungup
      })}
      onClick={onClick}
      {...props}
    >
      <i className="icon">{isFree ? 'phone_call' : 'phone_hangup'}</i>
      {isAnswered && <div className="answered-wave" />}
      {text && speechBubleShown && <SpeechBuble text={text} />}
    </div>
  )
}

export default CallButton
