import { getPoint } from '../web'
import { Swiped } from '../Swiped'

const $app = document.getElementById('vanilla')
const $swipe = document.createElement('div')
$swipe.classList.add('swipe')
const $button = document.createElement('button')
$button.append('vanilla')
const $style = document.createElement('style')
const style = `
  .swipe {
    width: 100vw;
    height: 300px;
    transition: all 400ms;
    background-color: rgba(0,0,0,0.3);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    cursor: grab;
  }
`
$style.append(style)
$app?.append($style, $swipe, $button)

$button.addEventListener('click', () => {
  $swipe.style.transform = `translate(${0}px, ${0}px)`
})

const sw = new Swiped({
  onGrabbedMove({ offset, willEmitSwipe }) {
    $swipe.style.cursor = 'grabbing'
    $swipe.style.transition = 'background-color 400ms'
    if (willEmitSwipe) {
      $swipe.style.backgroundColor = 'rgba(0,0,0,0.1)'
    } else {
      $swipe.style.backgroundColor = 'rgba(0,0,0,0.4)'
    }

    $swipe.style.transform = `translate(${offset.x}px, 0)`
  },
  onGrabbedRelease() {
    $swipe.style.cursor = ''
    $swipe.style.backgroundColor = ''
    $swipe.style.transition = ''
  },
  onSwiped({ offset, axis }) {
    if (axis === 'x') {
      if (offset.x > 0) {
        $swipe.style.transform = `translate(100%, 0)`
      } else {
        $swipe.style.transform = `translate(-100%, 0)`
      }
    }
  },
  onSwipedNot() {
    $swipe.style.transform = `translate(${0}px, ${0}px)`
  },
})

$swipe.addEventListener('touchstart', (e) => {
  sw.start(getPoint(e))
})
$swipe.addEventListener(
  'touchmove',
  (e) => {
    if (sw.grabbing(getPoint(e))) {
      e.preventDefault()
    }
  },
  { passive: false }
)
$swipe.addEventListener('touchend', () => {
  sw.release()
})
