import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Carousel, CarouselItem, useIndex } from '../react'

export const CarouselController = ({ data }: { data: any[] }) => {
  const { state, action } = useIndex(data.length, 0)

  return (
    <>
      <div style={impleStyles.container}>
        <div
          style={button(state.isStart)}
          onClick={state.isStart ? undefined : action.prev}
        >
          {'<'}
        </div>
        <Carousel
          displayWidth="90%"
          length={state.length}
          index={state.index}
          onPrev={action.prev}
          onNext={action.next}
        >
          {data.map((_, i) => {
            return (
              <CarouselItem style={impleStyles.box} key={String(i)}>
                {String(i)}
              </CarouselItem>
            )
          })}
        </Carousel>
        <div style={button(state.isEnd)} onClick={state.isEnd ? undefined : action.next}>
          {'>'}
        </div>
      </div>

      <div style={impleStyles.locator}>
        {data.map((_, i) => (
          <a
            style={{
              ...impleStyles.dot,
              ...(i === state.index ? impleStyles.activeDot : {}),
            }}
            onClick={() => action.setIndex(i)}
            key={i}
          />
        ))}
      </div>
    </>
  )
}

const button = (nonactive: boolean) => ({
  display: 'flex',
  alignContent: 'center',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#999',
  width: '48px',
  opacity: nonactive ? 0.5 : 1,
  flexGrow: 1,
  cursor: nonactive ? 'auto' : 'pointer',
})

const impleStyles = {
  container: {
    display: 'flex',
  },
  locator: {
    width: '100%',
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
  },
  dot: {
    background: '#eee',
    border: '1px solid #ddd',
    borderRadius: '100%',
    margin: '0 4px',
    width: '10px',
    height: '10px',
  },
  activeDot: {
    background: '#999',
    border: '1px solid #999',
  },
  box: {
    padding: '0 20px',
    width: '100%',
    height: '70vh',
    display: 'flex',
    fontSize: '4em',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee',
  },
}

export const Root = () => {
  const [data, setData] = useState([null, null, null, null])

  return (
    <>
      {data.length ? (
        <CarouselController data={data} />
      ) : (
        <CarouselItem style={impleStyles.box}>no data</CarouselItem>
      )}
      <button onClick={() => setData(data.concat([null]))}>add</button>
      <button onClick={() => setData(data.slice(0, -1))}>del</button>
    </>
  )
}

const $el = document.getElementById('react')
if ($el) {
  const root = createRoot($el)
  root.render(<Root />)
}
