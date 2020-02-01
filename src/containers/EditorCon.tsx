import React, { Component } from 'react';
import Editor from '../components/Editor';
import Shell from '../components/Shell';
import { connect } from 'react-redux';
import { RootState } from '../store/index';
import { Dispatch } from 'redux';
import Doc, { DocType } from '../utils/doc';
import Compiler from '../utils/compiler/index';
import { click2index } from '../utils/tools';
import { EditorState, Styles,Tokens } from '../types/store';
import { Iscope, Ioperation, Icompiler, IstateHandler } from '../types/compiler';
import { IrenderResult, Itrack } from '../types/animate';
import { deepCopy } from '../utils/tools';
import { 
  updateCode, 
  updateTokens,
  updateFontWidth,
  setOffset,
  updateClickpos,
  updateDoc,
  updateIndex,
  updateCursor,
  updateAst,
  clearAst,
  updateScope,
  clearScope,
  updateMirrorScope,
  clearMirrorScope,
  addOperation,
  clearOperation,
  updateCurrent,
  clearKeys,
  updateRenderResult,
  addTrack,
  clearTracks
} from '../store/action';

// 自定义选项
export interface CustomOptions {
  doc: EditorState,
  style: Styles,
  compiler: Icompiler,
  updateFontWidth?: (n: number) => void,
  setOffset?: (cor: [number, number]) => void,
  updateClickpos?: (cor: [number, number]) => void,
  handleKeyPress?: (e: React.KeyboardEvent) => void,
  handleKeyDown?: (e: React.KeyboardEvent) => void,
  updateDoc?: (doc: string[]) => string[],
  updateTokens?: (tokens: string[][]) => string[][],
  updateIndex?: (index:[number, number]) => void,
  updateCursor?: (cor: [number, number]) => void,
  handleRootClick?:(e: React.MouseEvent) => void,
  clearKeys?:() => void,
  updateCurrent?: (index: number) => void,
  updateRenderResult?: (result: IrenderResult) => void,
  addTrack?: (track: Itrack) => void
}

interface Options {
  code?: string,
}

const options: Options = {};

class EditorCon extends Component<CustomOptions & IstateHandler> {

  doc: DocType;

  constructor(props: CustomOptions & IstateHandler) {
    super(props);
    this.doc = new Doc(
      this.props.doc.code || ""
    );
    this.doc.init();
  }

  handleKeyPress = (e: React.KeyboardEvent): void => {
    e.preventDefault()
    const { updateDoc, updateTokens, updateIndex } = this.props;
    this.doc.keyPressHandler(e);
    if (updateDoc && updateTokens && updateIndex) {
      updateDoc(this.doc.doc);
      updateTokens(this.doc.tokens);
      updateIndex(this.doc.currentIndex);
    }
  }

  handleKeyDown = (e: React.KeyboardEvent) => {
    const { updateDoc, updateTokens, updateIndex } = this.props;
    this.doc.keyDownHandler(e);
    if (updateDoc && updateTokens && updateIndex) {
      updateDoc(this.doc.doc);
      updateTokens(this.doc.tokens);
      updateIndex(this.doc.currentIndex);
    }
  }

  // 更新位置
  handleRootClick = (e: React.MouseEvent):void => {
    const { updateClickpos, updateIndex, style } = this.props;
    const idx = click2index(style.containerOffset, [e.pageX, e.pageY], style.fontWidth, style.lineHeight)
    this.doc.setIndex(idx);
    if (updateClickpos && updateIndex) {
      updateClickpos([e.pageX, e.pageY]);
      updateIndex(idx);
    }
  }

  // 运行
  handleRunClick = () => {
    const value = this.doc.getValue();
    const {
      updateAst,
      clearAst,
      updateScope,
      clearScope,
      updateMirrorScope,
      clearMirrorScope,
      addOperation,
      clearOperation,
      updateCurrent,
      clearKeys,
      updateRenderResult,
      addTrack,
      clearTracks
    } = this.props;
    const compiler = new Compiler(value, {
      updateAst,
      clearAst,
      updateScope,
      clearScope,
      updateMirrorScope,
      clearMirrorScope,
      addOperation,
      clearOperation,
      updateCurrent,
      clearKeys,
      updateRenderResult,
      addTrack,
      clearTracks
    })
    compiler.init();
    compiler.run();
    this.animateInit();
    // this.animateRender();
  }

  handleNextClick = () => {
    const { current, renderResult } = this.props.doc;
    if (current < renderResult.length - 1) {
      const newIdx = current + 1;
      this.props.compiler.operations[newIdx]();
      this.props.updateCurrent(newIdx);
    }
  }

  handleRenderClick = ():void => {
    this.animateInit();
    // this.animateRender();
  }

  animateInit = (): void => {
    const { tracks, initialTrack } = this.props.doc;
    let end = 0;
    let newRenderResult = [];
    // 计算轨道长度
    for (let i = 0; i < tracks.length; i++) {
      if (tracks[i].end > end) {
        end = tracks[i].end;
      }
    }
    // 轨道初始化
    for (let j = 0; j < end; j++) {
      newRenderResult[j] = [initialTrack];
    }
    for (let i = 0; i < tracks.length; i++) {
      const { begin, end, content } = tracks[i];
      let newContent = deepCopy(content);
      // 轨道切割
      for (let j = begin; j < end; j++) {
        if (j === begin) {
          newContent.process = 'enter';
        } else {
          newContent.process = 'stay';
        }
        newRenderResult[j].push(newContent);
      }
      // this.props.updateRenderResult(newRenderResult);
    }
    this.props.updateRenderResult(newRenderResult);
  }
  
  // 每个帧一个key，还是每个轨道一个key？
  // animateRender = (): void => {
  //   const { tracks, renderResult } = this.props.doc;
  //   let newRenderResult: IrenderResult = renderResult;
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

  render() {
    return (
      <div>
        <Editor {
          ...{
            ...this.props,
            ...options,
            handleKeyPress: this.handleKeyPress,
            handleKeyDown: this.handleKeyDown,
            handleRootClick: this.handleRootClick
          }}/>
          <Shell
            compiler = { this.props.compiler }
            handleRunClick={ this.handleRunClick }
            handleNexClick={ this.handleNextClick }
            handleRenderClick={this.handleRenderClick}
          />
      </div>
    )
  }
}

const mapStateToProps = (state: RootState): CustomOptions => ({
  doc: state.editor,
  style: state.ui,
  compiler: state.compiler
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  updateCode: (code: string) => dispatch(updateCode(code)),
  updateTokens: (tokens: Tokens) => dispatch(updateTokens(tokens)),
  updateFontWidth: (width: number) => dispatch(updateFontWidth(width)),
  setOffset: (cor: [number, number]) => dispatch(setOffset(cor)),
  updateClickpos: (cor: [number, number]) => dispatch(updateClickpos(cor)),
  updateDoc: (doc: string[]) => dispatch(updateDoc(doc)),
  updateIndex: (index: [number, number]) => dispatch(updateIndex(index)),
  updateCursor: (cor: [number, number]) => dispatch(updateCursor(cor)),
  updateAst: (ast: object) => dispatch(updateAst(ast)),
  clearAst: () => dispatch(clearAst()),
  updateScope: (scope: Iscope) => dispatch(updateScope(scope)),
  clearScope: () => dispatch(clearScope()),
  updateMirrorScope: (scope: Iscope) => dispatch(updateMirrorScope(scope)),
  clearMirrorScope: () => dispatch(clearMirrorScope()),
  addOperation: (op: Ioperation) => dispatch(addOperation(op)),
  clearOperation: () => dispatch(clearOperation()),
  updateCurrent: (current: number) => dispatch(updateCurrent(current)),
  clearKeys: () => dispatch(clearKeys()),
  updateRenderResult: (result: IrenderResult) => dispatch(updateRenderResult(result)),
  addTrack: (track: Itrack) => dispatch(addTrack(track)),
  clearTracks: () => dispatch(clearTracks())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorCon);
