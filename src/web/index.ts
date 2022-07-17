import { Point } from '../Point'
const getPage = (page: string, event: any): number =>
  event.changedTouches ? event.changedTouches[0][page] : event[page]

export const getPoint = (e: any): Point =>
  new Point(getPage('pageX', e), getPage('pageY', e))
