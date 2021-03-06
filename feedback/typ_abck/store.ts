import { Iscope, Ioperation } from './compiler';
import { IrenderResult, Icontent, Iframe, Itrack } from './animate';

export type Tokens = string[][];
export type DocType = string[];
export type Position = [number, number];

/**
 * styles
 */
export interface Styles {
  containerOffset: Position,
  fontWidth: number,
  currenIndex: Position,
  fontSize?: number,
  lineHeight: number,
  color?: [number, number, number],
  clickPos: Position,
  cursorPos?: Position
}
export const UPDATE_FONTWIDTH = 'UPDATE_FONTWIDTH';
export const SET_OFFSET = 'SET_OFFSET';
export const UPDATE_CLICKPOS = 'UPDATE_CLICKPOS'
export const UPDATE_INDEX = 'UPDATE_INDEX';
export const UPDATE_CURSOR = 'UPDATE_CURSOR';
export interface UpdateFontWidth {
  type: typeof UPDATE_FONTWIDTH,
  payload: number
}
export interface SetOffsetAction {
  type: typeof SET_OFFSET,
  payload: Position
}
export interface UpdateClickposAction {
  type: typeof UPDATE_CLICKPOS,
  payload: Position
}
export interface UpdateIndexAction {
  type: typeof UPDATE_INDEX,
  payload: Position
}
export interface UpdateCursorAction {
  type: typeof UPDATE_CURSOR,
  payload: Position
}
export type StyleActionTypes = 
UpdateFontWidth |
SetOffsetAction |
UpdateClickposAction |
UpdateIndexAction |
UpdateCursorAction;

/**
 * doc
 */
export interface EditorState {
  code: string,
  doc: DocType,
  tokens: Tokens,
  current: number,
  tracks: Itrack[],
  renderResult: IrenderResult,
  initialTrack: Icontent
}

export const UPDATE_CODE = 'UPDATE_CODE';
export const UPDATE_TOKENS = 'UPDATE_TOKENS';
export const UPDATE_DOC = 'UPDATE_DOC';
export const UPDATE_KEYS = 'UPDATE_KEYS';
export const CLEAR_KEYS = 'CLEAR_KEYS';
export const UPDATE_CURRENT = 'UPDATE_CURRENT';
export const UPDATE_TRACKS = 'UPDATE_TRACKS';
export const ADD_TRACK = 'ADD_TRACK';
export const CLEAR_TRACKS = 'CLEAR_TRACKS';
export const UPDATE_RENDERESULT = 'UPDATE_RENDERRESULT'

export interface UpdateCodeAction {
  type: typeof UPDATE_CODE,
  payload: string
}

export interface UpdateTokensAction {
  type: typeof UPDATE_TOKENS,
  payload: Tokens
}

export interface UpdateDocAction {
  type: typeof UPDATE_DOC,
  payload: string[]
}

export interface UpdateTracksAction {
  type: typeof UPDATE_TRACKS,
  payload: Itrack
}

export interface ClearKeysAction {
  type: typeof CLEAR_KEYS
}

export interface UpdateCurrentAction {
  type: typeof UPDATE_CURRENT,
  payload: number
}

export interface UpdateRenderResult {
  type: typeof UPDATE_RENDERESULT,
  payload: Iframe[]
}

export interface AddTrack {
  type: typeof ADD_TRACK,
  payload: Itrack[]
}

export interface ClearTracks {
  type: typeof CLEAR_TRACKS
}

export type EditorAtionTypes = 
UpdateCodeAction |
UpdateTokensAction |
UpdateDocAction |
UpdateTracksAction |
ClearKeysAction |
UpdateCurrentAction |
UpdateRenderResult |
AddTrack |
ClearTracks;

/**
 * mirror scope
 */

export interface MirrorState {
  mirrorScope: Iscope,
  operations: Ioperation[],
  // execOperations: Ioperation[]
}

export interface ScopeState {
  ast: object,
  scope: Iscope
}

export const UPDATE_MIRROR_SCOPE = 'UPDATE_MIRROR_SCOPE';
export const CLEAR_MIRROR_SCOPE = 'CLEAR_MIRROR_SCOPE';
export const ADD_OPERATION = 'ADD_OPERATION';
export const CLEAR_OPERATION = 'CLEAR_OPERATION';
export const UPDATE_OPERATION = 'UPDATE_OPRATION';
// export const CLEAR_EXECOPRATION = 'CLEAR_EXECOPRATION';
// export const UPDATE_EXECOPRATION = 'UPDATE_EXECOPRATION';

interface UpdateMirrorScopeAction {
  type: typeof UPDATE_MIRROR_SCOPE,
  payload: object
}

interface ClearMirrorScopeAction {
  type: typeof CLEAR_MIRROR_SCOPE
}

interface AddOperationAction {
  type: typeof ADD_OPERATION,
  payload: Ioperation[]
}

interface ClearOperationAction {
  type: typeof CLEAR_OPERATION
}

interface UpdateOperationAction {
  type: typeof UPDATE_OPERATION,
  payload: Ioperation[]
}

// interface ClearExecOperationAction {
//   type: typeof CLEAR_EXECOPRATION,
//   payload: Ioperation[]
// }

export type MirrorActionTypes = 
UpdateMirrorScopeAction |
AddOperationAction |
ClearOperationAction |
ClearMirrorScopeAction |
UpdateOperationAction;

/**
 * scope
 */

export interface CompilerState extends MirrorState {
  ast: object,
  scope: Iscope
}

export const UPDATE_AST = 'UPDATE_AST';
export const CLEAR_AST = 'CLEAR_AST';
export const UPDATE_SCOPE = 'UPDATE_SCOPE';
export const CLEAR_SCOPE = 'CLEAR_SCOPE';

interface UpdateAstAction {
  type: typeof UPDATE_AST,
  payload: object
}

interface ClearAstAction {
  type: typeof CLEAR_AST
}

interface UpdateScopeAction {
  type: typeof UPDATE_SCOPE,
  payload: object
}

interface ClearScopeAction {
  type: typeof CLEAR_SCOPE
}

export type CompilerActionTypes = 
UpdateAstAction |
ClearAstAction |
UpdateScopeAction |
ClearScopeAction;

export type IanimateKey = any