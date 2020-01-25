import { useEffect, useRef } from 'preact/hooks'
import isEqual from 'lodash.isequal'

export const useObserver = <T>(value: T, action: (value: T) => any): void => {
  const previous = useRef(value)
  useEffect(() => {
    if (!isEqual(previous.current, value)) action(value)
    previous.current = value
  }, [value])
}
