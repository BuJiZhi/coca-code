import {
  EditorState,
  EditorAtionTypes,
  UPDATE_CODE,
  UPDATE_TOKENS,
  UPDATE_DOC,
  UPDATE_KEYS,
  CLEAR_KEYS,
  UPDATE_CURRENT
} from '../types/store';

const initialState: EditorState = {
  code: '//hello world',
  doc: ['//hello world'],
  current: 0,
  animate: [{
    on: false, 
    type: 'varibleDeclare',
    pos: [[0, 0], [100, 100]],
    payload: {
      name: 'a', 
      value: '1',
      to: [0, 0]
  }}], 
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
      const newArr = state.animate;
      newArr.push(action.payload);
      return {
        ...state,
        animate: newArr
      }
    case CLEAR_KEYS:
      return {
        ...state,
        animate: []
      }
    case UPDATE_CURRENT:
      return {
        ...state,
        current: action.payload
      }
    default:
      return state;
  }
}
