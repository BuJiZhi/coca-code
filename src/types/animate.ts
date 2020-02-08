type Position = [number, number];
type SpringTypes =  't0' | 't1' | 't2' | 't3' | 't4' | 't5';
type Process = 'enter' | 'stay' | 'leave';

export interface Itrack {
  begin: number,
  end: number,
  content: Icontent
}

export interface Icontent {
  type: SpringTypes,
  startpos: Position,
  endpos: Position,
  process?: Process,
  key: string,
  value: any,
  width?: number
}

export interface Ispring {
  key: string,
  value: any,
  process?: Process,
  style: any
}

export type Iframe = Icontent[];
export type IrenderResult = Iframe[];
