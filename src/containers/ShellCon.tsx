import React, { useEffect } from 'react';
import Shell from '../components/Shell';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {RootState} from '../store';
import { Ianimation } from '../types/animation';
import { Icompiler} from '../types/compiler';

interface Iprops {
  animation: Ianimation,
  compiler: Icompiler
}

const ShellCon:React.FC<Iprops> = props => {
  const {compiler} = props;
  return (
    <Shell 
      compiler={compiler}
    />
  );
}

const mapStateToProps = (state:RootState) => ({
  animation: state.animation,
  compiler: state.compiler
});

const mapDispatchToProps = (dispatch:Dispatch) => ({

});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShellCon);
