import React, { Component } from 'react';
import Editor from '../components/Editor';
import Shell from '../components/Shell';
import { connect } from 'react-redux';
import { RootState } from '../store/index';
import { Dispatch } from 'redux';
import Doc, { DocType } from '../utils/doc';
import Compiler from '../utils/compiler/index';
import { click2index } from '../utils/tools';
import { EditorState, Styles,Tokens, IanimateKey } from '../types/store';
import { Iscope, Ioperation, Icompiler, IstateHandler } from '../types/compiler';
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
  updateKeys
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
  updateKeys?:(keys: IanimateKey) => void,
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
    const { updateDoc, updateTokens, updateIndex, updateKeys } = this.props;
    this.doc.keyPressHandler(e);
    if (updateDoc && updateTokens && updateIndex && updateKeys) {
      updateDoc(this.doc.doc);
      updateTokens(this.doc.tokens);
      updateIndex(this.doc.currentIndex);
      updateKeys(this.doc.keyArr);
    }
  }

  handleKeyDown = (e: React.KeyboardEvent): void => {
    const { updateDoc, updateTokens, updateIndex, updateKeys } = this.props;
    this.doc.keyDownHandler(e);
    if (updateDoc && updateTokens && updateIndex && updateKeys) {
      updateDoc(this.doc.doc);
      updateTokens(this.doc.tokens);
      updateIndex(this.doc.currentIndex);
      updateKeys(this.doc.keyArr);
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
      updateCurrent
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
      updateCurrent
    })
    compiler.init();
    compiler.run();
  }

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
            handleRunClick={ this.handleRunClick }
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
  updateKeys: (keys: IanimateKey) => dispatch(updateKeys(keys))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorCon);
