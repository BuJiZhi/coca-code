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