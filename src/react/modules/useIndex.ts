import { useEffect, useState } from 'react'

export const useIndex = (maxIndex: number, current: number) => {
  const [index, _setIndex] = useState(current)
  const [length, setLength] = useState(maxIndex)
  const end = index >= length - 1
  const start = index <= 0
  const next = () => {
    if (end) return
    _setIndex(index + 1)
  }
  const prev = () => {
    if (start) return
    _setIndex(index - 1)
  }

  const setIndex = (i: number) => {
    if (i > length || i < 0) {
      throw new Error('useIndex: The specified index is out of range.')
    }
    _setIndex(i)
  }

  useEffect(() => {
    setLength(maxIndex)
    _setIndex(0)
  }, [maxIndex])

  return { length, index, setIndex, next, prev, end, start }
}
