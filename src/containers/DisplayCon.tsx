import React, { Component } from 'react';
import { Iui } from '../types/ui';
import { RootState } from '../store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import Display from '../components/Display';

export interface Idisplay {
  ui: Iui
}

class DisplayCon extends Component<Idisplay> {
  render() {
    return (
      <div style={{
        position: "absolute",
        left: "50px",
        top: "50px",
        width: "500px",
        height: "500px",
        backgroundColor: "#aaa"
      }}>
        <Display {...this.props}/>
      </div>
    )
  }
}

const mapStateToProps = (state:RootState) => ({
  ui: state.ui
})

const mapDispatchToProps = (dispatch:Dispatch) => ({

})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DisplayCon);
