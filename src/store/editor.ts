import {
  EditorState,
  EditorAtionTypes,
  UPDATE_CODE,
  UPDATE_TOKENS,
  UPDATE_DOC,
  UPDATE_KEYS
} from '../types/store';

const initialState: EditorState = {
  code: '//hello world',
  doc: ['//hello world'],
  animateKeys: [[0]], 
  tokens: [['//hello', ' ', 'world']]
}

export function editorReducer(
  state=initialState,
  action: EditorAtionTypes
) {
  switch (action.type) {
    case UPDATE_CODE:
      return {
        ...state,
        code: action.payload
      }
    case UPDATE_TOKENS:
      return {
        ...state,
        tokens: action.payload
      }
    case UPDATE_DOC:
      return {
        ...state,
        doc: action.payload
      }
    case UPDATE_KEYS:
      return {
        ...state,
        animateKeys: action.payload
      }
    default:
      return state;
  }
}
