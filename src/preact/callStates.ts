export const CALL_STATES = {
  CONNECTING: 'CONNECTING',
  RINGING: 'RINGING',
  FREE: 'FREE',
  ANSWERED: 'ANSWERED',
  CALL_END: 'CALL_END'
} as const

export type CallState = keyof typeof CALL_STATES
