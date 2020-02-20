/**
 * ui of editor
 */
export type Position = [number, number];
export interface Iui {
  containerOffset: Position,
  fontWidth: number,
  currenIndex: Position,
  fontSize?: number,
  lineHeight: number,
  clickPos: Position,
  cursorPos?: Position
}
export const UPDATE_FONTWIDTH = 'UPDATE_FONTWIDTH';
export const UPDATE_OFFSET = 'UPDATE_OFFSET';
export const UPDATE_CLICKPOS = 'UPDATE_CLICKPOS'
export const UPDATE_INDEX = 'UPDATE_INDEX';
export const UPDATE_CURSOR = 'UPDATE_CURSOR';
export interface UpdateFontWidth {
  type: typeof UPDATE_FONTWIDTH,
  payload: number
}
export interface SetOffsetAction {
  type: typeof UPDATE_OFFSET,
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
export type UiActionTypes = 
UpdateFontWidth |
SetOffsetAction |
UpdateClickposAction |
UpdateIndexAction |
UpdateCursorAction;
