import { 
  Ianimation,
  animationActionTypes,
  UPDATE_CURRENT,
  UPDATE_FRAMES,
  UPDATE_TRACKS,
  CLEAR_FRAMES,
  CLEAR_TRACKS
} from '../types/animation';

const initialState:Ianimation = {
  current: 0,
  tracks: [{
    begin: 0,
    end: 0,
    effect: {
      type: 'default',
      startpos: [0, 0],
      endpos: [0, 0],
      process: 'enter',
      key: 'sp-0',
      value: '',
      valueType: '[object String]'
    }
  }],
  frames: [[{
    type: 'default',
    startpos: [0, 0],
    endpos: [1, 0],
    process: 'enter',
    key: 'sp-0',
    value: '',
    valueType: '[object String]'
  }]],
  defaultFrame: {
    type: 'default',
    startpos: [0, 0],
    endpos: [0, 0],
    process: 'enter',
    key: 'sp-0',
    value: '',
    valueType: '[object String]'
  }
}

export const animationReducer = (
  state=initialState,
  action:animationActionTypes
) => {
  switch(action.type) {
    case UPDATE_TRACKS:
      return {
        ...state,
        tracks: action.payload
      }
    case UPDATE_FRAMES:
      return {
        ...state,
        frames: action.payload
      }
    case UPDATE_CURRENT:
      return {
        ...state,
        current: action.payload
      }
    case CLEAR_TRACKS:
      return {
        ...state,
        tracks: []
      }
    case CLEAR_FRAMES:
      return {
        ...state,
        frames: []
      }
    default:
      return state;
  }
}