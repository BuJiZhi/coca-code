type Position = [number, number];
type SpringTypes =  't0' | 't1' | 't2' | 't3' | 't4' | 't5';
type Process = 'enter' | 'stay' | 'leave';
export type ValueType = 
"[object Null]" | 
"[object Undefined]" | 
"[object String]" | 
"[object Number]" | 
"[object Boolean]" | 
"[object Function]" | 
"[object Array]" | 
"[object Date]" | 
"[object RegExp]" | 
"[object Object]";

export interface Itrack {
  begin: number,
  end: number,
  effect: Ieffect
}

export interface Ieffect {
  type: SpringTypes,
  startpos: Position,
  endpos: Position,
  process?: Process,
  key: string,
  value: any,
  valueType: ValueType,
  width?: number
}

export interface Ispring {
  key: string,
  value: any,
  valueType: ValueType,
  process?: Process,
  style: any
}

export type Iframe = Icontent[];
export type IrenderResult = Iframe[];
