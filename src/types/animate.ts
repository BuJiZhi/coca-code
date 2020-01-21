type Position = [number, number];
type AnimateTypes =  't0' | 't1' | 't2' | 't3' | 't4';
type Process = 'enter' | 'stay' | 'leave';

export interface Itrack {
  begin: number,
  end: number,
  content: Icontent
}

export interface Icontent {
  type: AnimateTypes,
  startpos: Position,
  endpos: Position,
  process?: Process,
  key: string,
  value: any,
  payload?: any
}

export interface Ispring {
  key: string,
  value: any,
  process?: Process,
  style: any
}

export type Iframe = Icontent[];
export type IrenderResult = Iframe[];
