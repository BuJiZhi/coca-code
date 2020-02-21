import React, { useEffect } from 'react';
import Editor from '../components/Editor';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {RootState} from '../store';
import { Ieditor } from '../types/editor';
import { 
  updateCodeAction,
  updateFontWidthAction,
  updateLineHeightAction,
  updateHeightAction
} from '../store/editor';

interface Iprops {
  editor: Ieditor,
  updateFontWidth(width:number): void,
  updateLineHeight(height:number): void,
  updateCode(code:string): void,
  updateHeight(height:number): void
}

const EditorCon:React.FC<Iprops> = props => {
  const { editor, updateFontWidth, updateLineHeight, updateHeight, updateCode } = props;
  const { code } = editor;
  const updateWidthAndHeight = (width:number, lineHeight:number) => {
    updateFontWidth(width);
    updateLineHeight(lineHeight);
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
  updateCode: (code:string) => dispatch(updateCodeAction(code)),
  updateHeight: (height:number) => dispatch(updateHeightAction(height))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditorCon);
