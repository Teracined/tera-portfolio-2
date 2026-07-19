import { useCallback, useState } from 'react'

export function useCopyToClipboard(timeout = 1800) {
  const [copiedValue, setCopiedValue] = useState('')

  const copy = useCallback(
    async (value) => {
      try {
        await navigator.clipboard.writeText(value)
        setCopiedValue(value)
        window.setTimeout(() => {
          setCopiedValue((current) => (current === value ? '' : current))
        }, timeout)
        return true
      } catch {
        return false
      }
    },
    [timeout]
  )

  return { copiedValue, copy }
}
