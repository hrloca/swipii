import { Point } from './Point'

export interface GrabbedOption {
  onGrab?: (offset: Point) => void
  onGrabMove?: (offset: Point) => void
  onGrabRelease?: (offset: Point) => void
}

export class Grabbed {
  // mutable
  private startPoint: Point | null = null
  private grabbedPoint: Point | null = null
  private offset: Point | null = null

  private isOverGrabRange = false
  private onGrabHandler?: (offset: Point) => void
  private onGrabMoveHandler?: (offset: Point) => void
  private onGrabReleaseHandler?: (offset: Point) => void

  constructor(opt: GrabbedOption = {}) {
    this.onGrabHandler = opt.onGrab
    this.onGrabMoveHandler = opt.onGrabMove
    this.onGrabReleaseHandler = opt.onGrabRelease

    this.init()
  }

  set onGrabbed(handler: (offset: Point) => void) {
    this.onGrabHandler = handler
  }

  set onGrabMove(handler: (offset: Point) => void) {
    this.onGrabMoveHandler = handler
  }

  set onGrabRelease(handler: (offset: Point) => void) {
    this.onGrabReleaseHandler = handler
  }

  private init() {
    this.startPoint = null
    this.grabbedPoint = null
    this.offset = null
    this.isOverGrabRange = false
  }

  start(fromTheReferencePoint: Point): void {
    this.init()
    this.startPoint = fromTheReferencePoint
  }

  move(point: Point, threshold: number): void {
    if (!this.startPoint) return
    const offset = point.sub(this.startPoint)

    if (offset.distance >= threshold) {
      if (!this.isOverGrabRange) {
        this.isOverGrabRange = true
        this.grabbedPoint = offset
        this.onGrabHandler?.(offset)
      }
    }

    if (this.isOverGrabRange) {
      // NOTE: grabbedPoint is confirmed.
      this.offset = offset
      this.onGrabMoveHandler?.(offset.sub(this.grabbedPoint as Point))
    }
  }

  end(): void {
    if (!this.startPoint) return

    if (this.isOverGrabRange && this.offset) {
      this.onGrabReleaseHandler?.(this.offset)
    }

    this.init()
  }
}
