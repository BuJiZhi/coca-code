import { 
  EditorAtionTypes,
  CompilerActionTypes,
  StyleActionTypes,
  MirrorActionTypes,
  Tokens,
  UPDATE_CODE, 
  UPDATE_TOKENS,
  UPDATE_FONTWIDTH,
  SET_OFFSET,
  UPDATE_CLICKPOS,
  UPDATE_DOC,
  UPDATE_INDEX,
  UPDATE_CURSOR,
  UPDATE_AST,
  CLEAR_AST,
  UPDATE_SCOPE,
  CLEAR_SCOPE,
  UPDATE_MIRROR_SCOPE,
  CLEAR_MIRROR_SCOPE,
  ADD_OPERATION,
  CLEAR_OPERATION,
  UPDATE_CURRENT,
  CLEAR_KEYS,
  UPDATE_OPERATION,
  UPDATE_RENDERESULT,
  ADD_TRACK,
  CLEAR_TRACKS
} from '../types/store';

import {
  Iscope,
  Ioperation
} from '../types/compiler';

import { IrenderResult, Itrack } from '../types/animate';

export function updateCode(code: string): EditorAtionTypes {
  return {
    type: UPDATE_CODE,
    payload: code
  }
}

export function updateTokens(tokens: Tokens): EditorAtionTypes {
  return {
    type: UPDATE_TOKENS,
    payload: tokens
  }
}

export function clearKeys(): EditorAtionTypes {
  return {
    type: CLEAR_KEYS
  }
}

export function updateRenderResult(result: IrenderResult): EditorAtionTypes {
  return {
    type: UPDATE_RENDERESULT,
    payload: result
  }
}

export function addTrack(track: Itrack[]) {
  return {
    type: ADD_TRACK,
    payload: track
  }
}

export function clearTracks() {
  return {
    type: CLEAR_TRACKS
  }
}

/**
 * styles
 */
export function updateFontWidth(width:number): StyleActionTypes {
  return {
    type: UPDATE_FONTWIDTH,
    payload: width
  }
}

export function setOffset(cor: [number, number]): StyleActionTypes {
  return {
    type: SET_OFFSET,
    payload: cor
  }
}

export function updateClickpos(cor: [number, number]) {
  return {
    type: UPDATE_CLICKPOS,
    payload: cor
  }
}

export function updateDoc(text: string[]) {
  return {
    type: UPDATE_DOC,
    payload: text
  }
}

export function updateIndex(index: [number, number]) {
  return {
    type: UPDATE_INDEX,
    payload: index
  }
}

export function updateCursor(cor: [number, number]) {
  return {
    type: UPDATE_CURSOR,
    payload: cor
  }
}

export function updateCurrent(index: number) {
  return {
    type: UPDATE_CURRENT,
    payload: index
  }
}

/**
 * compiler
 */

export function updateMirrorScope(scope: Iscope) {
  return {
    type: UPDATE_MIRROR_SCOPE,
    payload: scope
  }
}

export function clearMirrorScope() {
  return {
    type: CLEAR_MIRROR_SCOPE
  }
}

export function addOperation(operation: Ioperation[]) {
  return {
    type: ADD_OPERATION,
    payload: operation
  }
}

export function clearOperation() {
  return {
    type: CLEAR_OPERATION
  }
}

export function updateAst(ast: object) {
  return {
    type: UPDATE_AST,
    payload: ast
  }
}

export function clearAst() {
  return {
    type: CLEAR_AST
  }
}

export function updateScope(scope: object): CompilerActionTypes {
  return {
    type: UPDATE_SCOPE,
    payload: scope
  }
}

export function clearScope(): CompilerActionTypes {
  return {
    type: CLEAR_SCOPE
  }
}

export function updateOperation(operations: Ioperation[]): MirrorActionTypes {
  return {
    type: UPDATE_OPERATION,
    payload: operations
  }
}
