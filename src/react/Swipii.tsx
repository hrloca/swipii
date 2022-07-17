import React, { useRef, useState, useEffect, FC, useCallback } from 'react'
import { useSwiped } from './useSwiped'
import { getPoint } from '../web'
import { EventData } from '../Swiped'

export type SwipiiProps = JSX.IntrinsicElements['div'] & {
  touchThreshold?: number
  disable?: boolean
  onGrabbed?: () => void
  onGrabbedMove?: (e: EventData) => void
  onGrabbedRelease?: (e: EventData) => void
  onSwiped?: (e: EventData) => void
  onSwipedNot?: (e: EventData) => void
}

export const Swipii: FC<SwipiiProps> = ({
  touchThreshold,
  disable = false,
  onGrabbed,
  onGrabbedMove,
  onGrabbedRelease,
  onSwipedNot,
  onSwiped,
  ...props
}) => {
  const [isMouseDown, setIsMouseDown] = useState(false)
  const elRef = useRef<null | HTMLDivElement>(null)
  const sw = useSwiped({
    onGrabbed,
    onGrabbedMove,
    onGrabbedRelease,
    onSwipedNot,
    onSwiped,
  })

  const onTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!disable) {
        sw.start(getPoint(e))
      }
      props.onTouchStart?.(e)
    },
    [props.onTouchStart]
  )

  const onTouchEnd = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!disable) {
        sw.release()
      }
      props.onTouchEnd?.(e)
    },
    [props.onTouchEnd]
  )

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!disable) {
        sw.start(getPoint(e))
        setIsMouseDown(true)
      }
      props.onMouseDown?.(e)
    },
    [props.onMouseDown]
  )

  const onMouseUp = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!disable) {
        sw.release()
        setIsMouseDown(false)
      }
      props.onMouseUp?.(e)
    },
    [props.onMouseUp]
  )

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isMouseDown || !disable) {
        sw.grabbing(getPoint(e), 0)
      }
      props.onMouseMove?.(e)
    },
    [isMouseDown, props.onMouseMove]
  )

  // NOTE: Waiting for 'passive: false' on React
  useEffect(() => {
    if (!elRef.current || disable) return
    const el = elRef.current
    const onTouchMove = (e: Event) => {
      if (sw.grabbing(getPoint(e), touchThreshold)) e.preventDefault()
    }
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => {
      el.removeEventListener('touchmove', onTouchMove)
    }
  }, [disable])

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseUp}
      onMouseMove={onMouseMove}
      {...props}
      ref={elRef}
    ></div>
  )
}
