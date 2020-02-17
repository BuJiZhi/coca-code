import { combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { editorReducer } from './editor';
import { animationReducer } from './animation';
import { compilerReducer } from './compiler';

const rootReducer = combineReducers({
  editor: editorReducer,
  animation: animationReducer,
  compiler: compilerReducer
})

export type RootState = ReturnType<typeof rootReducer>;

export default createStore(
  rootReducer,
  composeWithDevTools()
);