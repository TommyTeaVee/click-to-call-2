import { h, JSX } from 'preact'

interface SpeechBubleProps {
  text: string
}

const SpeechBuble = ({ text }: SpeechBubleProps): JSX.Element => (
  <p className="speech-buble">{text}</p>
)

export default SpeechBuble
