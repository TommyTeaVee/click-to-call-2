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

interface RTCState {
  session: JsSIP.RTCSession | null
  stream: MediaStream | null
}

type UseJssip = [JsSIPState, (uri: string) => void, () => void, RTCState]

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
  const [rtc, setRTC] = useState<RTCState>({
    session: null,
    stream: null
  })
  const [state, setState] = useState<JsSIPState>({
    isRegistered: false,
    callState: CALL_STATES.FREE
  })

  const endSession = (type: string, cause?: string): void => {
    setRTC({
      session: null,
      stream: null
    })
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
    console.log('[C2C] Session ended:', cause || 'hangup')
  }

  const handleRemoteStream = (stream: MediaStream | null): void =>
    setRTC(state => ({
      ...state,
      stream
    }))

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
      setRTC(state => ({
        ...state,
        session
      }))
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

    // Handle RTCPeerConnection (audio stream)
    session.connection.addEventListener('addstream', (event: MediaStreamEvent) =>
      handleRemoteStream(event.stream)
    )
  }

  const hangup = (): boolean | void => rtc.session !== null && rtc.session.terminate()

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

  return [state, makeCall, hangup, rtc]
}
