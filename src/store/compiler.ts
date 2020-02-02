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
  UPDATE_CURRENT,
  UPDATE_OPERATION
} from '../types/store';

const initialState:CompilerState = {
  ast: {},
  scope: Object.create(null),
  mirrorScope: Object.create(null),
  operations: []
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
    case UPDATE_OPERATION:
      return {
        ...state,
        operations: action.payload
      }
    case ADD_OPERATION:
      const op = [...state.operations, ...action.payload];
      return {
        ...state,
        operations: op
      }
    case CLEAR_OPERATION:
      return {
        ...state,
        operations: []
      }
    default:
      return state;
  }
}