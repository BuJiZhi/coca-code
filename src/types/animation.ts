type Position = [number, number];
type AnimationTypes =  'default' | 'appear' | 'move' | 'compute' | 'function' | 't5';
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
  type: AnimationTypes,
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