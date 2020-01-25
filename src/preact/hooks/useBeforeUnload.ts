import { useEffect } from 'preact/hooks'

export const useBeforeUnload = (dependable: any, opts = []): void => {
  const handleBeforeUnload = (e: Event): string | undefined => {
    if (dependable || dependable === undefined) {
      e.preventDefault()
      e.returnValue = true
      return ''
    }
  }

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload)
    return (): void => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [dependable, ...opts])
}
