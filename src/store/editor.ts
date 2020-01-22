import {
  EditorState,
  EditorAtionTypes,
  UPDATE_CODE,
  UPDATE_TOKENS,
  UPDATE_DOC,
  UPDATE_TRACKS,
  UPDATE_CURRENT,
  UPDATE_RENDERESULT
} from '../types/store';

const initialState: EditorState = {
  code: '//hello world',
  doc: ['//hello world'],
  tokens: [['//hello', ' ', 'world']],
  current: 0,
  tracks: [{
    begin: 0,
    end: 0,
    content: {
      type: 't0',
      startpos: [0, 0],
      endpos: [0, 0],
      process: 'enter',
      key: 'sp-0',
      value: '',
    }
  }],
  renderResult: [[{
    type: 't1',
    startpos: [0, 0],
    endpos: [1, 0],
    process: 'enter',
    key: 'sp-0',
    value: 'hello'
  }]]
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
    case UPDATE_TRACKS:
      return {
        ...state,
        tracks: action.payload
      }
    case UPDATE_RENDERESULT:
      return {
        ...state,
        renderResult: action.payload
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
