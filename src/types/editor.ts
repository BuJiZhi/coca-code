export type Position = [number, number];
export interface Ieditor {
  fontWidth: number,
  lineHeight: number,
  code: string
}
export const UPDATE_FONTWIDTH = 'UPDATE_FONTWIDTH';
export const UPDATE_LINEHEIGHT = 'UPDATE_LINEHEIGHT';
export const UPDATE_CODE = 'UPDATE_CODE';
interface IupdateFontWidth {
  type: typeof UPDATE_FONTWIDTH,
  payload: number
}
interface IupdateLineHeight {
  type: typeof UPDATE_LINEHEIGHT,
  payload: Position
}
interface IupdateCode {
  type: typeof UPDATE_CODE,
  payload: string
}
export type editorActionTypes = 
IupdateFontWidth |
IupdateLineHeight |
IupdateCode;