import { Point } from './Point'
import { Grabbed } from './Grabbed'

type Axis = 'x' | 'y'

export interface EventData {
  offset: Point
  axis: Axis | 'unknown'
  willEmitSwipe: boolean
}

export interface SwipedOption {
  onGrabbed?: () => void
  onGrabbedMove?: (e: EventData) => void
  onGrabbedRelease?: (e: EventData) => void
  onSwiped?: (e: EventData) => void
  onSwipedNot?: (e: EventData) => void
}

export class Swiped {
  readonly #ANGLE_THREHOLD: number = 45
  readonly #SWIPE_BORDER_THRESHOLD: number = 18
  readonly #RELEASE_THRESHOLD: number = 3
  readonly #GRABBED_THRESHOLD: number = 5

  #useX = true
  #useY = false

  #maxValue = 0
  #willEmitSwipe = false
  #swipeable = false
  #currentAxis: Axis | 'unknown' = 'unknown'

  // point state
  #offset: Point = new Point()

  // handler
  #onGrabbedHandler?: () => void
  #onGrabbedMoveHandler?: (e: EventData) => void
  #onGrabbedReleaseHandler?: (e: EventData) => void
  #onSwipedHandler?: (e: EventData) => void
  #onSwipedNotHandler?: (e: EventData) => void

  private grabbed: Grabbed

  constructor(opt: SwipedOption = {}) {
    this.#onGrabbedHandler = opt.onGrabbed
    this.#onGrabbedMoveHandler = opt.onGrabbedMove
    this.#onGrabbedReleaseHandler = opt.onGrabbedRelease
    this.#onSwipedHandler = opt.onSwiped
    this.#onSwipedNotHandler = opt.onSwipedNot

    this.resetState()
    this.grabbed = new Grabbed({
      onGrab: (offset) => {
        this.maybeGrabbed(offset)
      },
      onGrabMove: (offset) => {
        this.grabMove(offset)
      },
      onGrabRelease: () => {
        this.grabRelease()
      },
    })
  }

  set onGrabbed(handle: (() => void) | undefined) {
    this.#onGrabbedHandler = handle
  }
  set onGrabbedMove(handle: ((e: EventData) => void) | undefined) {
    this.#onGrabbedMoveHandler = handle
  }
  set onGrabbedRelease(handle: ((e: EventData) => void) | undefined) {
    this.#onGrabbedReleaseHandler = handle
  }
  set onSwiped(handle: ((e: EventData) => void) | undefined) {
    this.#onSwipedHandler = handle
  }
  set onSwipedNot(handle: ((e: EventData) => void) | undefined) {
    this.#onSwipedNotHandler = handle
  }

  start(fromTheReferencePoint: Point): void {
    this.resetState()
    this.grabbed.start(fromTheReferencePoint)
  }

  grabbing(point: Point, threshold?: number): boolean {
    this.grabbed.move(point, threshold ?? this.#GRABBED_THRESHOLD)
    return this.#swipeable
  }

  release(): void {
    this.grabbed.end()
    this.resetState()
  }

  private resetState() {
    this.#offset = new Point()
    this.#willEmitSwipe = false
    this.#currentAxis = 'unknown'
    this.#swipeable = false
    this.#maxValue = 0
  }

  private maybeGrabbed(offset: Point): void {
    const { angle } = offset
    const swipableX = this.#useX && angle < 90 - this.#ANGLE_THREHOLD
    const swipableY = this.#useY && angle > this.#ANGLE_THREHOLD

    this.#swipeable = swipableX || swipableY
    // swipe
    if (this.#swipeable) {
      this.#currentAxis = swipableX ? 'x' : 'y'
      this.#onGrabbedHandler?.()
    }
  }

  private grabMove(offset: Point) {
    if (this.#swipeable) {
      if (this.#currentAxis === 'unknown') return

      const prevPointAbs = this.#offset.abs
      const currentPointAbs = offset.abs
      const diff = currentPointAbs.sub(prevPointAbs)

      const axis = this.#currentAxis
      const currentValue = currentPointAbs[axis]
      const currentDiff = diff[axis]

      const shouldIncrease = currentDiff > 0
      if (shouldIncrease) this.#maxValue = currentValue

      const isOverSwipeableLimit = this.#SWIPE_BORDER_THRESHOLD < currentValue
      const withinRange = this.#maxValue < currentValue + this.#RELEASE_THRESHOLD
      this.#willEmitSwipe = isOverSwipeableLimit && withinRange
      this.#offset = offset

      this.#onGrabbedMoveHandler?.({
        offset: this.#offset,
        axis: this.#currentAxis,
        willEmitSwipe: this.#willEmitSwipe,
      })
    }
  }

  private grabRelease() {
    if (this.#swipeable) {
      const eventData = {
        offset: this.#offset,
        axis: this.#currentAxis,
        willEmitSwipe: this.#willEmitSwipe,
      }

      this.#onGrabbedReleaseHandler?.(eventData)
      if (this.#willEmitSwipe) {
        this.#onSwipedHandler?.(eventData)
      } else {
        this.#onSwipedNotHandler?.(eventData)
      }
    }
  }
}
