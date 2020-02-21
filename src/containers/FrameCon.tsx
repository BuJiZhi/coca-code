import React from 'react';
import {connect} from 'react-redux';
import {RootState} from '../store';
import {Dispatch} from 'redux';
import Frame from '../components/Frame';
import {Ieditor} from '../types/editor';
import {Ianimation} from '../types/animation';

interface Iprops {
  editor: Ieditor,
  animation: Ianimation
}

const FrameCon:React.FC<Iprops> = props => {
  const {editor, animation} = props;
  const {current, frames} = animation;
  const {fontWidth, lineHeight} = editor;

  return (
    <Frame 
      fontWidth={fontWidth}
      lineHeight={lineHeight}
      frame={frames[current]}
    />
  )
}

const mapStateToProps = (state:RootState) => ({
  editor: state.editor,
  animation: state.animation
});

const mapDispatchToProps = (dispatch:Dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FrameCon);
