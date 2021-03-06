import React, { useEffect, useState } from 'react';
import Cm from '../../components/Cm';
import { Parser } from 'acorn';
import {parse} from 'sarama.js';
import Iterator from './Iterator';
import Scope from './Scope';
import { Node } from 'acorn';
import { deepCopy } from '../../utils/tools';
import { 
  Icompiler, 
  Iiterator, 
  Iscope, 
  Istep, 
  Inode 
} from '../../types/compiler';
import { Ieditor } from '../../types/editor';
import { Ianimation, Iframes, Itrack } from '../../types/animation';
import { connect } from 'react-redux';
import { RootState } from '../../store';
import { Dispatch } from 'redux';
import {
  updateAstAction,
  updateScopeAction,
  updateMirrorscopeAction,
  updateStepsAction,
  replaceStepsAction,
  clearStepsAction,
  clearScopeAction,
  clearMirrorscopeAction
} from '../../store/compiler';
import {
  updateCurrentAction,
  updateFramesAction,
  updateTracksAction,
  clearTracksAction,
  clearFramesAction
} from '../../store/animation';


interface Iprops {
  compiler: Icompiler;
  editor: Ieditor;
  animation: Ianimation;
  updateAst(ast:Node): void;
  updateScope(scope:Iscope): void;
  updateMirrorScope(scope:Iscope): void;
  updateSteps(steps:Istep[]): void;
  replaceSteps(steps:Istep[]): void;
  clearSteps(): void;
  clearScope(): void;
  clearMirrorscope(): void;
  updateTracks(track:Itrack[]): void;
  updateFrames(frames:Iframes): void;
  updateCurrent(current:number): void;
  clearTracks(): void;
  clearFrames(): void;
}

const Compiler:React.FC<Iprops> = props => {
  const { 
    compiler, 
    editor, 
    animation, 
    children,
    updateCurrent,
    replaceSteps,
    updateFrames,
    clearFrames,
    clearTracks,
    ...dispatches
  } = props;
  const { current, tracks, frames, defaultFrame } = animation;
  const { steps } = compiler;
  const { code } = editor;
  const run = () => {
    const { clearSteps, updateAst, updateScope, updateMirrorScope, clearScope, clearMirrorscope } = dispatches;
    
    clearSteps();
    clearScope();
    clearMirrorscope();
    clearTracks();
    clearFrames();
    updateCurrent(0);

    const ast = parse(code, {locations: true});
    const scope = new Scope('function', null);
    const mirrorScope = new Scope('function', null);
    updateAst(ast);
    updateScope(scope);
    updateMirrorScope(mirrorScope);

    const iterator = new Iterator(Object.create(null), 
      scope, mirrorScope, dispatches, code, [], []);
    iterator.traverse(ast as Inode);
  }

  const handleNextclick = () => {
    if (current < frames.length - 1) {
      const newIdx = current + 1;
      steps[newIdx].step();
      updateCurrent(newIdx);
    }
  }

  /**
   * 操作函数重新排序
   * 每个对象的key应该和索引一致
   */
  const stepsSort = ():void => {
    const oldStpes = [...steps];
    const sortedSteps: Istep[] = [];
    for (let op of oldStpes) {
      sortedSteps.push(Object.create(null));
    }
    for (let op of oldStpes) {
      sortedSteps[op.key] = op;
    }
    replaceSteps(sortedSteps);
  }

  const animationRender = ():void => {
    stepsSort();
    let end = 0;
    let newFrames = [];
    // 计算轨道长度
    for (let i = 0; i < tracks.length; i++) {
      if (tracks[i].end > end) {
        end = tracks[i].end;
      }
    }
    // 轨道初始化
    for (let j = 0; j < end; j++) {
      newFrames[j] = [defaultFrame];
    }
    for (let i = 0; i < tracks.length; i++) {
      const { begin, end, effect } = tracks[i];
      // 轨道切割
      for (let j = begin; j < end; j++) {
        let newContent = deepCopy(effect);
        if (j === begin) {
          newContent.process = 'enter';
        } else {
          newContent.process = 'stay';
        }
        newFrames[j].push(newContent);
      }
    }
    updateFrames(newFrames);
  }

  return <Cm
    compiler={compiler}
    handleNexClick={handleNextclick}
    handleRenderClick={animationRender}
    handleRunClick={run}
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
  clearFrames: () => dispatch(clearFramesAction()),
  updateCurrent: (current:number) => dispatch(updateCurrentAction(current)),
  replaceSteps: (steps:Istep[]) => dispatch(replaceStepsAction(steps)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Compiler);
