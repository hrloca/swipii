import React, { CSSProperties, useEffect, useRef, useCallback, FC } from 'react'
import { Swipii, SwipiiProps } from '../Swipii'

export interface CarouselProps {
  disable?: boolean
  duration?: number
  easing?: string
  length: number
  index: number
  onNext: (index: number) => void
  onPrev: (index: number) => void
  displayWidth?: string
  children?: React.ReactNode
}

export const Carousel: FC<CarouselProps> = ({
  easing,
  disable = false,
  duration = 280,
  index,
  onNext,
  onPrev,
  displayWidth,
  children,
  length,
}) => {
  const el = useRef<null | HTMLDivElement>(null)

  const resolvePosition = useCallback((i: number, pos: number) => {
    if (!el.current) return
    el.current.style.transform = `translate(${-i * 100}%, 0) translate(${pos}px, 0)`
  }, [])

  const isEnd = index === length - 1
  const isStart = index === 0

  const move = () => {
    if (!el.current) return
    el.current.style.cursor = 'grab'
    el.current.style.transition = `transform ${
      easing ? easing : 'cubic-bezier(0.19,1,0.22,1)'
    } ${duration}ms`
    resolvePosition(index, 0)
  }

  const handlers: SwipiiProps = {
    onGrabbed() {
      if (!el.current) return
      el.current.style.cursor = 'grabbing'
      el.current.style.transition = 'none'
    },
    onGrabbedMove({ offset }) {
      const isPositive = offset.x > 0
      const willOverMax = isEnd && !isPositive
      const willOverMin = isStart && isPositive
      const willOver = willOverMax || willOverMin
      const pos = willOver ? Math.cbrt(offset.x) * 5 : offset.x
      resolvePosition(index, pos)
    },
    onGrabbedRelease() {
      move()
    },
    onSwiped({ offset }) {
      const isPositive = offset.x > 0
      const willOverMax = isEnd && !isPositive
      const willOverMin = isStart && isPositive
      if (isPositive) {
        if (!willOverMax) onPrev(index)
      } else {
        if (!willOverMin) onNext(index)
      }
    },
  }

  useEffect(() => {
    move()
  }, [index])

  return (
    <div style={styles.wrap}>
      <Swipii {...handlers} disable={disable} style={display(displayWidth)}>
        <div ref={el} style={styles.tranck}>
          {children}
        </div>
      </Swipii>
    </div>
  )
}

export const CarouselItem: FC<JSX.IntrinsicElements['div']> = ({ style, ...props }) => {
  return <div style={{ ...styles.cell, ...style }} {...props} />
}

const display = (width = '100%'): CSSProperties => ({
  width,
  display: 'flex',
})

const styles: { [key: string]: CSSProperties } = {
  wrap: {
    justifyContent: 'center',
    flexDirection: 'row',
    overflow: 'hidden',
    width: '100%',
    display: 'flex',
  },
  tranck: {
    display: 'flex',
    width: '100%',
  },
  cell: {
    position: 'relative',
    flexShrink: 0,
    width: '100%',
  },
}
