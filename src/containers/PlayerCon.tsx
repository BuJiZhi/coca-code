import React, { Component } from 'react';
import { Itrack, Icontent, Iframe } from '../types/animate';
import { deepCopy } from '../utils/tools';
import { connect } from 'react-redux';
import { RootState } from '../store';
import { Dispatch } from 'redux';
import { EditorState } from '../types/store';
import Frame from '../components/Editor/Frame';
import {
  updateCurrent
} from '../store/action';

export interface Iprops {
  editor: EditorState
}

class Player extends Component<Iprops> {

  // currentUpdate = (idx: number): void => {
  //   const { renderResult, updateCurrent } = this.props;
  //   if (idx < 0) idx = 0;
  //   if (idx > renderResult.length - 1) idx = renderResult.length - 1;
  //   updateCurrent(idx);
  // }

  init = (): void => {
    const { tracks, renderResult, initialTrack } = this.props.editor;
    let end = 0;
    // 计算轨道长度
    for (let i = 0; i < tracks.length; i++) {
      if (tracks[i].end > end) {
        end = tracks[i].end;
      }
    }
    // 轨道初始化
    for (let j = 0; j < end; j++) {
      renderResult[j] = [initialTrack];
    }
  }
  
  // 每个帧一个key，还是每个轨道一个key？
  animateRender = (): void => {
    const { tracks, renderResult } = this.props.editor;
    for (let i = 0; i < tracks.length; i++) {
      const { begin, end, content } = tracks[i];
      // 轨道切割
      for (let j = begin; j < end; j++) {
        if (j === begin) {
          content.process = 'enter';
        } else {
          content.process = 'stay';
        }
        const newContent = deepCopy(content);
        renderResult[j].push(newContent);
      }
    }
  }

  getCurrentFrame(): Iframe {
    const { editor } = this.props;
    const { renderResult, current } = editor;
    return renderResult[current]; 
  }

  render() {
    const { editor } = this.props;
    return (
      <Frame
        currentFrame={ this.getCurrentFrame() }
        editor={ editor }
      />
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  editor: state.editor
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateCurrent: (idx: number) => dispatch(updateCurrent(idx))
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
