import { 
  Ianimation,
  Itrack,
  Iframes,
  animationActionTypes,
  UPDATE_CURRENT,
  UPDATE_FRAMES,
  UPDATE_TRACKS,
  CLEAR_FRAMES,
  CLEAR_TRACKS,
} from '../types/animation';

const initialState:Ianimation = {
  current: -1,
  tracks: [{
    begin: 0,
    end: 0,
    loc: {
      start: {line: 0, column: 0},
      end: {line: 0, column: 0},
    },
    effect: {
      type: 'default',
      startpos: {line: 0, column: 0},
      endpos: {line: 0, column: 0},
      process: 'enter',
      key: 'sp-0',
      value: '',
      valueType: '[object String]'
    }
  }],
  frames: [[]],
  defaultFrame: {
    type: 'default',
    startpos: {line: 0, column: 0},
    endpos: {line: 0, column: 0},
    process: 'enter',
    key: 'sp-0',
    value: '',
    valueType: '[object String]'
  }
}

export const updateTracksAction = (tracks:Itrack[]) => {
  return {
    type: UPDATE_TRACKS,
    payload: tracks
  }
}

export const updateFramesAction = (frames:Iframes) => {
  return {
    type: UPDATE_FRAMES,
    payload: frames
  }
}

export const updateCurrentAction = (current:number) => {
  return {
    type: UPDATE_CURRENT,
    payload: current
  }
}

export const clearTracksAction = () => {
  return {
    type: CLEAR_TRACKS,
  }
}

export const clearFramesAction = () => {
  return {
    type: CLEAR_FRAMES
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
        tracks: [...state.tracks, ...action.payload]
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