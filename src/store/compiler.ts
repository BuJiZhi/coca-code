import { 
  CompilerState,
  CompilerActionTypes,
  MirrorActionTypes,
  UPDATE_AST,
  CLEAR_AST,
  UPDATE_SCOPE,
  CLEAR_SCOPE,
  UPDATE_MIRROR_SCOPE,
  CLEAR_MIRROR_SCOPE,
  ADD_OPERATION,
  CLEAR_OPERATION,
  UPDATE_CURRENT
} from '../types/store';

const initialState:CompilerState = {
  ast: {},
  scope: Object.create(null),
  mirrorScope: Object.create(null),
  operations: [],
  current: 0
}

export function compilerReducer(
  state=initialState,
  action: CompilerActionTypes | MirrorActionTypes
) {
  switch (action.type) {
    case UPDATE_AST:
      return {
        ...state,
        ast: action.payload
      }
    case CLEAR_AST:
      return {
        ...state,
        ast: {}
      }
    case UPDATE_SCOPE:
      return {
        ...state,
        scope: action.payload
      }
    case CLEAR_SCOPE:
      return {
        ...state,
        scope: {}
      }
    case UPDATE_MIRROR_SCOPE:
      return {
        ...state,
        mirrorScope: action.payload
      }
    case CLEAR_MIRROR_SCOPE:
      return {
        ...state,
        mirrorScope: {}
      }
    case ADD_OPERATION:
      const op = state.operations;
      op.push(action.payload)
      return {
        ...state,
        operations: op
      }
    case CLEAR_OPERATION:
      return {
        ...state,
        operations: []
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