import { useEffect, useState } from 'preact/hooks'
import JsSIP from 'jssip'
import 'webrtc-adapter'

import { CALL_STATES, CallState } from '../callStates'

window.JsSIP = JsSIP

interface JsSIPState {
  isRegistered: boolean
  callState: CallState
}

interface JsSIPConfig {
  uri: string
  user: string
  password: string
  socket: string
  displayName?: string
}

type UseJssip = [JsSIPState, (uri: string) => void, () => void, any]

const generateSipConfig = ({
  uri,
  user,
  password,
  socket,
  displayName = `ctc-${Date.now()}`
}: JsSIPConfig): JsSIP.UserAgentConfiguration => ({
  uri,
  password,
  sockets: new JsSIP.WebSocketInterface(socket),
  display_name: displayName,
  authorization_user: user,
  connection_recovery_min_interval: 2,
  connection_recovery_max_interval: 15,
  register_expires: 60
})

const HANG_UP_DELAY = 3000

export const useJssip = (configuration: JsSIPConfig): UseJssip => {
  const [jssipUA, setJsSIP] = useState<JsSIP.UA | null>(null)
  const [session, setSession] = useState<any>(null)
  const [state, setState] = useState<JsSIPState>({
    isRegistered: false,
    callState: CALL_STATES.FREE
  })

  const endSession = (type: string, cause?: string): void => {
    if (type === 'failed') {
      console.log('[CTC] Session ended:', cause)
    }
    setSession(null)
    setState(state => ({
      ...state,
      callState: CALL_STATES.CALL_END
    }))
    setTimeout(
      () =>
        setState(state => ({
          ...state,
          callState: CALL_STATES.FREE
        })),
      HANG_UP_DELAY
    )
  }

  const makeCall = (uri: string): void => {
    if (jssipUA === null) return
    const session = jssipUA.call(uri, {
      pcConfig: {
        iceServers: []
      },
      mediaConstraints: {
        audio: true,
        video: false
      },
      rtcOfferConstraints: {
        offerToReceiveAudio: true,
        offerToReceiveVideo: false
      }
    })

    session.on('connecting', () => {
      setState(state => ({
        ...state,
        callState: CALL_STATES.CONNECTING
      }))
      setSession(session)
    })
    session.on('progress', () =>
      setState(state => ({
        ...state,
        callState: CALL_STATES.RINGING
      }))
    )
    session.on('accepted', () =>
      setState(state => ({
        ...state,
        callState: CALL_STATES.ANSWERED
      }))
    )
    session.on('failed', ({ cause }: { cause: string }) => endSession('failed', cause))
    session.on('ended', () => endSession('ended'))
  }

  const hangup = (): void => session !== null && session.terminate()

  useEffect(() => {
    const jssipUA = new JsSIP.UA(generateSipConfig(configuration))

    jssipUA.on('connected', () => {
      setJsSIP(jssipUA)
      setState(state => ({ ...state, isRegistered: true }))
    })
    jssipUA.on('disconnected', () => {
      setJsSIP(null)
      setState(state => ({ ...state, isRegistered: false }))
    })

    jssipUA.start()
  }, [])

  return [state, makeCall, hangup, session]
}
