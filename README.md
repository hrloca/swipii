# swipii

Swipii is a tiny swipe module for safe scrolling.

> This is a pre-release version. Destructive changes will occur.

## Installation

```sh
npm i @hrloca/swipii
```

## On React(web)

Just extended the div

```js
<Swipii
  disable
  onGrabbedMove={({ offset }) => {
    // Process according to the amount of offset.
  }}
  onGrabbed={() => {
    // Processing at the time of grabbed.
  }}
  onGrabbedRelease={() => {
    // Processing at the time of released.
  }}
  onSwiped={() => {
    // When the swipe fired.
  }}
  onSwipedNot={() => {
    // When the swipe not fired.
  }}
></Swipii>
```

## License

MIT
