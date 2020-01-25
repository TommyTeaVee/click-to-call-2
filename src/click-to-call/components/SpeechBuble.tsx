import { h, JSX } from 'preact' // lgtm [js/unused-local-variable]

interface SpeechBubleProps {
  text: string
}

const SpeechBuble = ({ text }: SpeechBubleProps): JSX.Element => (
  <p className="speech-buble">{text}</p>
)

export default SpeechBuble
