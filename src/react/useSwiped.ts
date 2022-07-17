import { useRef } from 'react'
import { Swiped, SwipedOption } from '../Swiped'

export type UseSwipeOption = SwipedOption

export const useSwiped = (option: UseSwipeOption = {}): Swiped => {
  const sw = useRef(new Swiped(option)).current

  sw.onGrabbed = option.onGrabbed
  sw.onGrabbedMove = option.onGrabbedMove
  sw.onGrabbedRelease = option.onGrabbedRelease
  sw.onSwipedNot = option.onSwipedNot
  sw.onSwiped = option.onSwiped

  return sw
}
