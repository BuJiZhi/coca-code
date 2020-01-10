import { Dispatch } from 'redux';
import { Iscope } from './compiler';

export type Tokens = string[][];
export type DocType = string[]

/**
 * styles
 */
export interface Styles {
  containerOffset: [number, number],
  fontWidth: number,
  currenIndex: [number, number],
  fontSize?: number,
  lineHeight: number,
  color?: [number, number, number],
  clickPos: [number, number],
  cursorPos?: [number, number]
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
  payload: [number, number]
}
export interface UpdateClickposAction {
  type: typeof UPDATE_CLICKPOS,
  payload: [number, number]
}
export interface UpdateIndexAction {
  type: typeof UPDATE_INDEX,
  payload: [number, number]
}
export interface UpdateCursorAction {
  type: typeof UPDATE_CURSOR,
  payload: [number, number]
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
  animate: IanimateKey[]
}

export interface IanimateKey {
  on: boolean,
  type: string,
  pos: [number, number],
  payload: any
}

export const UPDATE_CODE = 'UPDATE_CODE';
export const UPDATE_TOKENS = 'UPDATE_TOKENS';
export const UPDATE_DOC = 'UPDATE_DOC';
export const UPDATE_KEYS = 'UPDATE_KEYS';
export const CLEAR_KEYS = 'CLEAR_KEYS';
export const UPDATE_CURRENT = 'UPDATE_CURRENT'

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

export interface UpdateKeysAction {
  type: typeof UPDATE_KEYS,
  payload: IanimateKey
}

export interface ClearKeysAction {
  type: typeof CLEAR_KEYS
}

export interface UpdateCurrentAction {
  type: typeof UPDATE_CURRENT,
  payload: number
}

export type EditorAtionTypes = 
UpdateCodeAction |
UpdateTokensAction |
UpdateDocAction |
UpdateKeysAction |
ClearKeysAction |
UpdateCurrentAction;

/**
 * mirror scope
 */

export interface MirrorState {
  mirrorScope: Iscope,
  operations: object[]
}

export interface ScopeState {
  ast: object,
  scope: Iscope
}

export const UPDATE_MIRROR_SCOPE = 'UPDATE_MIRROR_SCOPE';
export const CLEAR_MIRROR_SCOPE = 'CLEAR_MIRROR_SCOPE';
export const ADD_OPERATION = 'ADD_OPERATION';
export const CLEAR_OPERATION = 'CLEAR_OPERATION';

interface UpdateMirrorScopeAction {
  type: typeof UPDATE_MIRROR_SCOPE,
  payload: object
}

interface ClearMirrorScopeAction {
  type: typeof CLEAR_MIRROR_SCOPE
}

interface AddOperationAction {
  type: typeof ADD_OPERATION,
  payload: () => void
}

interface ClearOperationAction {
  type: typeof CLEAR_OPERATION
}

export type MirrorActionTypes = 
UpdateMirrorScopeAction |
AddOperationAction |
ClearOperationAction |
ClearMirrorScopeAction

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

