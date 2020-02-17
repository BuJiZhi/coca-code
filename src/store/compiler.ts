import {
  Icompiler,
  Iscope,
  Istep,
  compilerActionTypes,
  UPDATE_AST,
  UPDATE_SCOPE,
  UPDATE_MIRRORSCOPE,
  UPDATE_STEPS,
  CLEAR_STEPS
} from '../types/compiler';

const initialState:Icompiler = {
  ast: Object.create(null),
  scope: Object.create(null),
  mirrorScope: Object.create(null),
  steps: []
}

export const updateAstAction = (ast:object) => {
  return {
    type: UPDATE_AST,
    payload: ast
  }
}

export const updateScopeAction = (scope:Iscope) => {
  return {
    type: UPDATE_SCOPE,
    payload: scope
  }
}

export const updateMirrorscopeAction = (scope:Iscope) => {
  return {
    type: UPDATE_SCOPE,
    payload: scope
  }
}

export const updateStepsAction = (steps:Istep[]) => {
  return {
    type: UPDATE_STEPS,
    payload: steps
  }
}

export const clearStepsAction = () => {
  return {
    type: CLEAR_STEPS
  }
}

export const compilerReducer = (
  state=initialState,
  action:compilerActionTypes
) => {
  switch(action.type) {
    case UPDATE_AST:
      return {
        ...state,
        ast: action.payload
      }
    case UPDATE_SCOPE:
      return {
        ...state,
        scope: action.payload
      }
    case UPDATE_MIRRORSCOPE:
      return {
        ...state,
        mirrorScope: action.payload
      }
    case UPDATE_STEPS:
      return {
        ...state,
        steps: action.payload
      }
    case CLEAR_STEPS:
      return {
        ...state,
        steps: []
      }
    default:
      return state;
  }
}