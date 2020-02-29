export type C2CConfig = {
  uri: string
  user: string
  socket: string
  password: string
  callto: string
  position?: string
  text?: string
  color?: string
}

export type C2C = {
  init: (config: C2CConfig) => void
  _config?: C2CConfig
}
