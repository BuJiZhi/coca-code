import { ValueType } from '../types/animation';

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
  let ln:number = 0;
  let ch:number = 0;
  let isEnd:boolean = false;
  for (let i = 0; i <= code.length && i <= num; i++) {
    if (code[i] === '\n') {
      isEnd = true;
    } else {
      if (isEnd) {
        ch = 0;
        ln += 1;
        isEnd = false;
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

export function typeOf(value: any): ValueType {
  return Object.prototype.toString.call(value) as ValueType;
}

export function objToArr(obj: any): Array<any> {
  const newArr = [];
  for (let i in obj) {
    newArr.push(obj[i]);
  }
  return newArr;
}

export function valueConvert(value: any, type: ValueType): any {
  switch(type) {
    case "[object String]":
      return value;
    case "[object Number]":
      return value;
    case "[object Boolean]":
      return value ? "true" : "false";
    case "[object Function]":
      return `[function]${value.name}`;
    case "[object Array]":
      // 从那边传过来的数组会被从Array转成object
      const arr = objToArr(value);
      return `[${arr.join(',')}]`;
    case "[object Object]":
      return 'obj';
    default:
      console.log(typeof value);
      return "unknow";
  }
}

