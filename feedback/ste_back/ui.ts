import { 
  Iui,
  UiActionTypes,
  Position,
  UPDATE_FONTWIDTH,
  UPDATE_OFFSET,
  UPDATE_CLICKPOS,
  UPDATE_INDEX,
  UPDATE_CURSOR
} from '../../types/feedback/ui';

const initialState: Iui = {
  containerOffset: [0, 0],
  currenIndex: [0, 0],
  fontWidth: 20,
  fontSize: 20,
  lineHeight: 20,
  clickPos: [0, 0],
  cursorPos: [0, 0],
}

export function uiReducer(
  state=initialState,
  action: UiActionTypes
) {
  switch (action.type) {
    case UPDATE_FONTWIDTH:
      return {
        ...state,
        fontWidth: action.payload
      }
    case UPDATE_OFFSET:
      return {
        ...state,
        containerOffset: action.payload
      }
    case UPDATE_CLICKPOS:
      return {
        ...state,
        clickPos: action.payload
      }
    case UPDATE_INDEX:
      return {
        ...state,
        currenIndex: action.payload
      }
    case UPDATE_CURSOR:
      return {
        ...state,
        cursorPos: action.payload
      }
    default:
      return state;
  }
}

export function updateFontWidth(width:number): UiActionTypes {
  return {
    type: UPDATE_FONTWIDTH,
    payload: width
  }
}

export function updateOffset(cor: Position): UiActionTypes {
  return {
    type: UPDATE_OFFSET,
    payload: cor
  }
}

export function updateClickpos(cor: Position) {
  return {
    type: UPDATE_CLICKPOS,
    payload: cor
  }
}
