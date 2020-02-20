import {
  Icompiler,
  Iscope,
  Istep,
  compilerActionTypes,
  UPDATE_AST,
  UPDATE_SCOPE,
  UPDATE_MIRRORSCOPE,
  UPDATE_STEPS,
  REPLACE_STEPS,
  CLEAR_STEPS,
  CLEAR_SCOPES,
  CLEAR_MIRRORSCOPES
} from '../types/compiler';

const initialState:Icompiler = {
  ast: Object.create(null),
  scopes: [],
  mirrorScopes: [],
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
    type: UPDATE_MIRRORSCOPE,
    payload: scope
  }
}

export const updateStepsAction = (steps:Istep[]) => {
  return {
    type: UPDATE_STEPS,
    payload: steps
  }
}

export const replaceStepsAction = (steps:Istep[]) => {
  return {
    type: REPLACE_STEPS,
    payload: steps
  }
}

export const clearStepsAction = () => {
  return {
    type: CLEAR_STEPS
  }
}

export const clearScopeAction = () => {
  return {
    type: CLEAR_SCOPES
  }
}

export const clearMirrorscopeAction = () => {
  return {
    type: CLEAR_MIRRORSCOPES
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
      let newScopes = [...state.scopes];
      newScopes.push(action.payload);
      return {
        ...state,
        scopes: newScopes
      }
    case UPDATE_MIRRORSCOPE:
      let newMirrorScopes = [...state.mirrorScopes];
      newMirrorScopes.push(action.payload);
      return {
        ...state,
        mirrorScopes: newMirrorScopes
      }
    case UPDATE_STEPS:
      return {
        ...state,
        steps: [...state.steps, ...action.payload]
      }
    case REPLACE_STEPS:
      return {
        ...state,
        steps: action.payload
      }
    case CLEAR_STEPS:
      return {
        ...state,
        steps: []
      }
    case CLEAR_SCOPES:
      return {
        ...state,
        scopes: []
      }
    case CLEAR_MIRRORSCOPES:
      return {
        ...state,
        mirrorScopes: []
      }
    default:
      return state;
  }
}