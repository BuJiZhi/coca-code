import React from 'react';
import { Toolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Compiler from '../../containers/compiler';

const useStyles = makeStyles(theme => ({
  root: {
    // position: "relative",
    // // backgroundColor: "grey"
  },
  options: {
    // width: "500px",
    height: "100%",
    backgroundColor: "#eee"
  }
}))

const Tool:React.FC = () => {
  const classes = useStyles();
  return (
    <Toolbar className={classes.root}>
      <div className={classes.options}>123</div>
      <Compiler />
    </Toolbar>
  )
}

export default Tool;