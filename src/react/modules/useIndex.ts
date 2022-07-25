import { useEffect, useState } from 'react'

export type useIndexOutput = {
  state: useIndexState
  action: useIndexAction
}

export type useIndexState = {
  index: number
  length: number
  isEnd: boolean
  isStart: boolean
}

export type useIndexAction = {
  setIndex: (next: number) => void
  next: () => void
  prev: () => void
}

export const useIndex = (maxlength: number, initialIndex: number): useIndexOutput => {
  const [index, _setIndex] = useState(initialIndex)
  const [length, setLength] = useState(maxlength)

  const isEnd = index >= length - 1
  const isStart = index <= 0

  const next = () => {
    if (isEnd) return
    _setIndex(index + 1)
  }

  const prev = () => {
    if (isStart) return
    _setIndex(index - 1)
  }

  const setIndex = (i: number) => {
    if (i > length || i < 0) {
      throw new Error('useIndex: The specified index is out of range.')
    }
    _setIndex(i)
  }

  useEffect(() => {
    setLength(maxlength)
    _setIndex(0)
  }, [maxlength])

  return {
    state: {
      length,
      index,
      isEnd,
      isStart,
    },
    action: {
      setIndex,
      next,
      prev,
    },
  }
}
