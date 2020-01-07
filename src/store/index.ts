import { editorReducer } from './editor';
import { compilerReducer } from './compiler';
import { styleReducer } from './ui';
import { combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

const rootReducer = combineReducers({
  editor: editorReducer,
  compiler: compilerReducer,
  ui: styleReducer
})

export type RootState = ReturnType<typeof rootReducer>;

export default createStore(
  rootReducer,
  composeWithDevTools()  
);