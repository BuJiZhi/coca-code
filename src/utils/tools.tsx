export function click2cursor(
  containerOffset: [number, number],
  clickPos: [number, number],
  fontWidth: number,
  lineHeight: number,
  ): [number, number] {
  return [
    Math.round((clickPos[0] - containerOffset[0]) / (fontWidth)) * fontWidth - 2,
    Math.round((clickPos[1] - containerOffset[1] - 10) / lineHeight) * lineHeight
  ]
}

export function click2index(
  containerOffset: [number, number],
  clickPos: [number, number],
  fontWidth: number,
  lineHeight: number,
):[number, number] {
  return [
    Math.round((clickPos[0] - containerOffset[0]) / fontWidth),
    Math.round((clickPos[1] - containerOffset[1]) / lineHeight)
  ]
}