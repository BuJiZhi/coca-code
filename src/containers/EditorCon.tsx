import React, { useEffect } from 'react';
import Editor from '../components/Editor';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {RootState} from '../store';
import { Ieditor } from '../types/editor';
import { 
  updateCodeAction,
  updateFontWidthAction,
  updateLineHeightAction
} from '../store/editor';

interface Iprops {
  editor: Ieditor,
  updateFontWidth(width:number): void,
  updateLineHeight(height:number): void,
  updateCode(code:string): void
}

const EditorCon:React.FC<Iprops> = props => {
  const { editor, updateFontWidth, updateLineHeight, updateCode } = props;
  const { code } = editor;
  const updateWidthAndHeight = (width:number, height:number) => {
    updateFontWidth(width);
    updateLineHeight(height);
  }
  return (
    <Editor 
      code={code}
      handleUpdateCode={(value:string) => updateCode(value)}
      updateWidthAndHeight={updateWidthAndHeight}
    />
  );
}

const mapStateToProps = (state:RootState) => ({
  editor: state.editor
});

const mapDispatchToProps = (dispatch:Dispatch) => ({
  updateFontWidth: (width:number) => dispatch(updateFontWidthAction(width)),
  updateLineHeight: (height:number) => dispatch(updateLineHeightAction(height)),
  updateCode: (code:string) => dispatch(updateCodeAction(code))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorCon);
