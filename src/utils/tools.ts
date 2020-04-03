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

export function value2arr(value:any) {
  let arr:any[] = [];
  if (typeof value === 'string') {
    for (let i = 0; i < value.length; i++) {
      arr.push(value.charAt(i));
    }
  } else if (typeof value === 'object') {
    for (let key in value) {
      arr.push(value[key]);
    }
  } 
  return arr;
}

export function valueConvert(value: any, type: ValueType):{value: string[],charNums:number}  {
  switch(type) {
    case "[object String]":
      const val = value2arr(value);
      return {
        value: val,
        charNums: val.length
      }
    case "[object Number]":
      const numval = value2arr(value.toString());
      return {
        value: numval,
        charNums: numval.length
      }
    case "[object Boolean]":
      const boolval = value ? ["True"] : ["False"]
      return {
        value: boolval,
        charNums: boolval[0].length 
      }
    case "[object Function]":
      const fnval = [`[fn]${value.name}`];
      return {
        value: fnval,
        charNums: fnval.length
      };
    case "[object Array]":
      // 从那边传过来的数组会被从Array转成object
      const arrval = value2arr(value);
      return {
        value: arrval,
        charNums: JSON.stringify(arrval).length
      }
    case "[object Object]":
      const objval = ['obj'];
      return {
        value: objval,
        charNums: 0
      }
    default:
      console.log(typeof value);
      return {
        value: ["unknow"],
        charNums: 0
      };
  }
}
