import React, { Component } from 'react';
import EditorCon from './containers/EditorCon';
import Toolbar from './components/Toolbar';
import ShellCon from './containers/ShellCon';
import FrameCon from './containers/FrameCon';
import { Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    top: theme.spacing(1),
    right: theme.spacing(1),
    bottom: theme.spacing(1),
    left: theme.spacing(1),
    padding: 0,
    backgroundColor: "rgb(51, 56, 66)"
  },
  runbox: {
    position: "absolute",
    display: "flex",
    left: 0,
    top: theme.spacing(8),
    right: 0,
    bottom: 0
  },
  editor: {
    position: "relative",
    flex: ".6 .5",
    minWidth: "500px",
    height: "100%",
    overflow: "auto"
  },
  resizer: {
    width: theme.spacing(1),
    height: "100%",
    // backgroundColor: "grey"
  },
  shell: {
    position: "relative",
    flex: ".4 .5",
    minWidth: "500px"
  }
}));
const App:React.FC = () => {
  const classes = useStyles();
  return (
      <Container className={classes.root}>
        {/* <div><Toolbar /></div> */}
        <div className={classes.runbox}>
          <div className={classes.editor}>
            <EditorCon />
            <FrameCon />
          </div>
          <div className={classes.resizer}></div>
          <div className={classes.shell}>
            <ShellCon />
          </div>
        </div>
      </Container>
  )
}

export default App;
