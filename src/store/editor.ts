import { 
  Ieditor, 
  editorActionTypes,
  UPDATE_CODE, 
  UPDATE_HEIGHT,
  UPDATE_FONTWIDTH, 
  UPDATE_LINEHEIGHT 
} from '../types/editor';

export const updateFontWidthAction = (width:number) => {
  return {
    type: UPDATE_FONTWIDTH,
    payload: width
  }
}

export const updateLineHeightAction = (height:number) => {
  return {
    type: UPDATE_LINEHEIGHT,
    payload: height
  }
}

export const updateHeightAction = (height:number) => {
  return {
    type: UPDATE_HEIGHT,
    payload: height
  }
}

export const updateCodeAction = (code:string) => {
  return {
    type: UPDATE_CODE,
    payload: code
  }
}

const initialState: Ieditor = {
  code: "# hello world",
  fontWidth: 7,
  lineHeight: 15,
  height: 15
}

export function editorReducer(
  state=initialState,
  action: editorActionTypes
) {
  switch (action.type) {
    case UPDATE_FONTWIDTH:
      return {
        ...state,
        fontWidth: action.payload
      }
    case UPDATE_LINEHEIGHT:
      return {
        ...state,
        lineHeight: action.payload
      }
    case UPDATE_HEIGHT:
      return {
        ...state,
        height: action.payload
      }
    case UPDATE_CODE:
      return {
        ...state,
        code: action.payload
      }
    default:
      return state;
  }
}
