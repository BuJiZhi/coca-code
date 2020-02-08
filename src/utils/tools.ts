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

function num2index(
  num: number,
  code: string
): [number, number]{
  let ln: number = 0;
  let ch: number = 0;
  let isbegin = 1;
  for (let i = 0; i <= code.length && i <= num; i++) {
    if (code[i] === '\n') {
      ln += 1;
      isbegin = 1;
      ch = 0;
    } else {
      if (isbegin) {
        ch = 0;
        isbegin = 0;
      } else {
        ch += 1;
      }
    }
  }
  return [ln, ch]
}

export function startend2Index(
  start: number, 
  end: number, 
  code: string
  ): [[number, number], [number, number]] {
  return [num2index(start, code), num2index(end, code)]
}

export function deepCopy<T>(obj: T): T {
  　　if ( typeof obj !== 'object' ){ // ( obj  instanceof Object || obj  instanceof Array )
  　　　　return obj;
  　　}
      let newobj: T = Object.create(null);
  　　for ( let attr in obj) {
  　　　　newobj[attr] = deepCopy(obj[attr]);
  　　}
  　　return newobj;
  }

export function valueConvert(value: any): any {
    switch(typeof value) {
      case "string":
        return value;
      case "number":
        return value;
      case "boolean":
        return value ? "true" : "false"
      case "function":
        return `[function]${value.name}`;
      default:
        return "unknow";
    }
  }

