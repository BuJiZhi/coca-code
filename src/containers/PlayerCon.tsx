import React, { Component } from 'react';
import { Iframe, IrenderResult } from '../types/animate';
import { connect } from 'react-redux';
import { RootState } from '../store';
import { Dispatch } from 'redux';
import { EditorState, Styles } from '../types/store';
// import { Button } from '@material-ui/core';
import Frame from '../components/Editor/Frame';
import {
  updateCurrent,
  updateRenderResult
} from '../store/action';

export interface Iprops {
  editor: EditorState,
  ui: Styles,
  updateRenderResult(result: IrenderResult): void
}

// 动画播放组件
class Player extends Component<Iprops> {

  // currentUpdate = (idx: number): void => {
  //   const { renderResult, updateCurrent } = this.props;
  //   if (idx < 0) idx = 0;
  //   if (idx > renderResult.length - 1) idx = renderResult.length - 1;
  //   updateCurrent(idx);
  // }

  // init = (): void => {
  //   const { tracks, initialTrack } = this.props.editor;
  //   let end = 0;
  //   let newRenderResult = [];
  //   // 计算轨道长度
  //   for (let i = 0; i < tracks.length; i++) {
  //     if (tracks[i].end > end) {
  //       end = tracks[i].end;
  //     }
  //   }
  //   // 轨道初始化
  //   for (let j = 0; j < end; j++) {
  //     newRenderResult[j] = [initialTrack];
  //   }
  //   this.props.updateRenderResult(newRenderResult);
  // }
  
  // // 每个帧一个key，还是每个轨道一个key？
  // animateRender = (): void => {
  //   const { tracks } = this.props.editor;
  //   let newRenderResult: IrenderResult = [];
  //   for (let i = 0; i < tracks.length; i++) {
  //     const { begin, end, content } = tracks[i];
  //     let newContent = deepCopy(content);
  //     // 轨道切割
  //     for (let j = begin; j < end; j++) {
  //       if (j === begin) {
  //         newContent.process = 'enter';
  //       } else {
  //         newContent.process = 'stay';
  //       }
  //       newRenderResult[j].push(newContent);
  //     }
  //     this.props.updateRenderResult(newRenderResult);
  //   }
  // }

  getCurrentFrame(): Iframe {
    const { editor } = this.props;
    const { renderResult, current } = editor;
    return renderResult[current]; 
  }

  render() {
    const { editor, ui } = this.props;
    return (
      <Frame
        currentFrame={ this.getCurrentFrame() }
        editor={ editor }
        ui={ ui }
      />
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  editor: state.editor,
  ui: state.ui
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateCurrent: (idx: number) => dispatch(updateCurrent(idx)),
  updateRenderResult: (result: IrenderResult) => dispatch(updateRenderResult(result))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Player)

// class Player implements Iplayer {

//   tracks: Itrack[];
//   current: number;
//   renderResult: Icontent[][];
//   initTrack: Icontent;

//   constructor(tracks: Itrack[]) {
//     this.tracks = tracks;
//     this.current = 0;
//     this.renderResult = []
//   }

//   currentUpdate(idx: number): void {
//     if (idx < 0) idx = 0;
//     if (idx > this.renderResult.length - 1) idx=this.renderResult.length - 1;
//     this.current = idx;
//   }

//   init(): void {
//     let end = 0;
//     // 计算轨道长度
//     for (let i = 0; i < this.tracks.length; i++) {
//       if (this.tracks[i].end > end) {
//         end = this.tracks[i].end;
//       }
//     }
//     // 轨道初始化
//     for (let j = 0; j < end; j++) {
//       this.renderResult[j] = [initialTrack];
//     }
//   }
//   // 每个帧一个key，还是每个轨道一个key？
//   render(): void {
//     for (let i = 0; i < this.tracks.length; i++) {
//       const { begin, end, content } = this.tracks[i];
//       // 轨道切割
//       for (let j = begin; j < end; j++) {
//         if (j === begin) {
//           content.process = 'enter';
//         } else {
//           content.process = 'stay';
//         }
//         const newContent = deepCopy(content);
//         this.renderResult[j].push(newContent);
//       }
//     }
//   }

//   getCurrentFrame(): Iframe {
//     return this.renderResult[this.current];
//   }
// }
