import React, { useEffect, useState } from 'react';
import { Parser } from 'acorn';
import Iterator from './Iterator';
import Scope from './Scope';
import { Node } from 'acorn';
import { Icompiler, Iiterator, Iscope, Istep, Inode } from '../../types/compiler';
import { Ieditor } from '../../types/editor';
import { Ianimation, Itrack } from '../../types/animation';
import { connect } from 'react-redux';
import { RootState } from '../../store';
import { Dispatch } from 'redux';
import {
  updateAstAction,
  updateScopeAction,
  updateMirrorscopeAction,
  updateStepsAction,
  clearStepsAction,
  clearScopeAction,
  clearMirrorscopeAction
} from '../../store/compiler';
import { 
  updateCurrentAction,
  updateFramesAction,
  updateTracksAction,
  clearFramesAction,
  clearTracksAction
} from '../../store/animation';
import { Iframes } from '../../types/animation';
import Cm from '../../components/Cm';

interface Iprops {
  compiler: Icompiler;
  editor: Ieditor;
  animation: Ianimation;
  updateAst(ast:Node): void;
  updateScope(scope:Iscope): void;
  updateMirrorScope(scope:Iscope): void;
  updateSteps(steps:Istep[]): void;
  clearSteps(): void;
  clearScope(): void;
  clearMirrorscope(): void;
  updateTracks(track:Itrack[]): void;
  updateFrames(frames:Iframes): void;
  clearTracks(): void;
  clearFrames(): void;
}

const Compiler:React.FC<Iprops> = props => {
  const { 
    compiler, 
    editor, 
    animation, 
    children,
    ...dispatches
  } = props;
  const { code } = editor;
  const run = () => {
    const { clearSteps, updateAst, updateScope, updateMirrorScope, clearScope, clearMirrorscope } = dispatches;

    clearSteps();
    clearScope();
    clearMirrorscope();
    
    const ast = Parser.parse(code);
    const scope = new Scope('function', null);
    const mirrorScope = new Scope('function', null);
    updateAst(ast);
    updateScope(scope);
    updateMirrorScope(mirrorScope);

    const iterator = new Iterator(Object.create(null), 
      scope, mirrorScope, dispatches, code, [], []);
    iterator.traverse(ast as Inode);
  }

  const handleNextclick = () => {}
  const handleRenderclick = () => {}
  const handleRunclick = () => {
    run();
  }

  return <Cm
    compiler={compiler}
    handleNexClick={handleNextclick}
    handleRenderClick={handleRenderclick}
    handleRunClick={handleRunclick}
  />;
}

const mapStateToProps = (state:RootState) => ({
  compiler: state.compiler,
  editor: state.editor,
  animation: state.animation
})

const mapDispatchToProps = (dispatch:Dispatch) => ({
  updateAst: (ast:object) => dispatch(updateAstAction(ast)),
  updateScope: (scope:Iscope) => dispatch(updateScopeAction(scope)),
  updateMirrorScope: (scope:Iscope) => dispatch(updateMirrorscopeAction(scope)),
  updateSteps: (steps:Istep[]) => dispatch(updateStepsAction(steps)),
  clearSteps: () => dispatch(clearStepsAction()),
  clearScope: () => dispatch(clearScopeAction()),
  clearMirrorscope: () => dispatch(clearMirrorscopeAction()),
  updateTracks: (track:Itrack[]) => dispatch(updateTracksAction(track)),
  updateFrames: (frames:Iframes) => dispatch(updateFramesAction(frames)),
  clearTracks: () => dispatch(clearTracksAction()),
  clearFrames: () => dispatch(clearFramesAction())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Compiler);
