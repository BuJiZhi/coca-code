export type Position = [number, number];
export interface Ilocation {
  line: number;
  column: number;
}
export interface Ilocations {
  start: Ilocation,
  end: Ilocation
}
export type AnimationTypes =  
'default' | 
'base' | 
'appear' |
'move' |
'compute' |
'function' |
'block' |
'list_appear';
export type Process = 'enter' | 'stay' | 'leave';
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
  begin: number;
  end: number;
  loc: Ilocations;
  effect: Ieffect;
}
export interface Ieffect {
  type: AnimationTypes;
  startpos: Ilocation;
  endpos: Ilocation;
  process?: Process;
  key: string;
  value: any;
  valueType: ValueType;
  width?: number;
  idx?: number | undefined;
}
export interface Ispring {
  key: string;
  value: any;
  valueType: ValueType;
  process?: Process;
  idx?: number | undefined;
  style: any;
  fontWidth: number;
  lineHeight: number;
  highlight: {[index:string]:any};
}
/**
 * about store
 */
export type IsingleFrame = Ieffect[];
export type Iframes = IsingleFrame[];
export interface Ianimation {
  tracks: Itrack[],
  defaultFrame: Ieffect,
  frames: Iframes,
  current: number
}
export const UPDATE_TRACKS = 'UPDATE_TRACKS';
export const UPDATE_FRAMES = 'UPDATE_FRAMES';
export const UPDATE_CURRENT = 'UPDATE_CURRENT';
export const CLEAR_TRACKS = 'CLEAR_TRACKS';
export const CLEAR_FRAMES = 'CLEART_FRAMES';
export interface IupdateTracks {
  type: typeof UPDATE_TRACKS,
  payload: Itrack[]
}
interface IupdateFrames {
  type: typeof UPDATE_FRAMES,
  payload: Iframes
}
interface IclearTracks {
  type: typeof CLEAR_TRACKS
}
interface IclearFrames {
  type: typeof CLEAR_FRAMES
}
interface IupdateCurrent {
  type: typeof UPDATE_CURRENT,
  payload: number
}
export type animationActionTypes = 
IupdateTracks | 
IupdateFrames |
IclearTracks |
IclearFrames |
IupdateCurrent;