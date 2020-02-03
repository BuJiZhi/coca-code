import { 
  Styles,
  StyleActionTypes,
  UPDATE_FONTWIDTH,
  SET_OFFSET,
  UPDATE_CLICKPOS,
  UPDATE_INDEX,
  UPDATE_CURSOR
} from '../types/store';

const initialState: Styles = {
  containerOffset: [0, 0],
  currenIndex: [0, 0],
  fontWidth: 20,
  fontSize: 25,
  lineHeight: 30,
  color: [0, 0, 0],
  clickPos: [0, 0],
  cursorPos: [0, 0],
}

export function styleReducer(
  state=initialState,
  action: StyleActionTypes
) {
  switch (action.type) {
    case UPDATE_FONTWIDTH:
      return {
        ...state,
        fontWidth: action.payload
      }
    case SET_OFFSET:
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
