import React from 'react';
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
    <div color="primary" className={classes.root}>
      <Compiler />
    </div>
  )
}

export default Tool;