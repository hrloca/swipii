// const degToRad = (degrees: number) => degrees * (Math.PI / 180)
const radToDeg = (rad: number) => rad / (Math.PI / 180)

export class Point {
  readonly x: number
  readonly y: number
  constructor(x?: number, y?: number) {
    this.x = x || 0
    this.y = y || 0
  }

  add(add: Point): Point {
    return new Point(this.x + add.x, this.y + add.y)
  }

  sub(diff: Point): Point {
    return new Point(this.x - diff.x, this.y - diff.y)
  }

  get abs(): Point {
    return new Point(this.absX, this.absY)
  }

  get distance(): number {
    return Math.hypot(this.x, this.y)
  }

  get angle(): number {
    return radToDeg(Math.atan2(this.absY, this.absX))
  }

  private get absX(): number {
    return Math.abs(this.x)
  }

  private get absY(): number {
    return Math.abs(this.y)
  }
}
