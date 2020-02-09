import {
  EditorState,
  EditorAtionTypes,
  UPDATE_CODE,
  UPDATE_TOKENS,
  UPDATE_DOC,
  UPDATE_TRACKS,
  UPDATE_CURRENT,
  UPDATE_RENDERESULT,
  ADD_TRACK,
  CLEAR_TRACKS
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
      valueType: '[object String]'
    }
  }],
  renderResult: [[{
    type: 't0',
    startpos: [0, 0],
    endpos: [1, 0],
    process: 'enter',
    key: 'sp-0',
    value: '',
    valueType: '[object String]'
  }]],
  initialTrack: {
    type: 't0',
    startpos: [0, 0],
    endpos: [0, 0],
    process: 'enter',
    key: 'sp-0',
    value: '',
    valueType: '[object String]'
  }
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
    case ADD_TRACK:
      const newTracks = [...state.tracks, ...action.payload];
      return {
        ...state,
        tracks: newTracks
      }
    case CLEAR_TRACKS:
      return {
        ...state,
        tracks: initialState.tracks
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
