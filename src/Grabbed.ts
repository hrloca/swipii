import { Point } from './Point'

export interface GrabbedOption {
  onGrab?: (offset: Point) => void
  onGrabMove?: (offset: Point) => void
  onGrabRelease?: (offset: Point) => void
}

export class Grabbed {
  // mutable
  #startPoint: Point | null = null
  #grabbedPoint: Point | null = null
  #offset: Point | null = null

  #isOverGrabRange = false
  #onGrabHandler?: (offset: Point) => void
  #onGrabMoveHandler?: (offset: Point) => void
  #onGrabReleaseHandler?: (offset: Point) => void

  constructor(opt: GrabbedOption = {}) {
    this.#onGrabHandler = opt.onGrab
    this.#onGrabMoveHandler = opt.onGrabMove
    this.#onGrabReleaseHandler = opt.onGrabRelease

    this.#init()
  }

  set onGrabbed(handler: (offset: Point) => void) {
    this.#onGrabHandler = handler
  }

  set onGrabMove(handler: (offset: Point) => void) {
    this.#onGrabMoveHandler = handler
  }

  set onGrabRelease(handler: (offset: Point) => void) {
    this.#onGrabReleaseHandler = handler
  }

  #init(): void {
    this.#startPoint = null
    this.#grabbedPoint = null
    this.#offset = null
    this.#isOverGrabRange = false
  }

  start(fromTheReferencePoint: Point): void {
    this.#init()
    this.#startPoint = fromTheReferencePoint
  }

  move(point: Point, threshold: number): void {
    if (!this.#startPoint) return
    const offset = point.sub(this.#startPoint)

    if (offset.distance >= threshold) {
      if (!this.#isOverGrabRange) {
        this.#isOverGrabRange = true
        this.#grabbedPoint = offset
        this.#onGrabHandler?.(offset)
      }
    }

    if (this.#isOverGrabRange) {
      // NOTE: grabbedPoint is confirmed.
      this.#offset = offset
      this.#onGrabMoveHandler?.(offset.sub(this.#grabbedPoint as Point))
    }
  }

  end(): void {
    if (!this.#startPoint) return

    if (this.#isOverGrabRange && this.#offset) {
      this.#onGrabReleaseHandler?.(this.#offset)
    }

    this.#init()
  }
}
