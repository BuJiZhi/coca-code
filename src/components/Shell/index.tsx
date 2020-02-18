import React from 'react';
import Toolbar from '../Toolbar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    height: "100%"
  },
  shell: {
    borderRadius: "3px",
    height: "100%",
    backgroundColor: "rgb(33, 37, 43)",
    color: "#eee"
  },
  scopes: {
    height: "50%"
  },
  resizer: {
    height: theme.spacing(2),
    backgroundColor: "rgb(51, 56, 66)"
  }
}))

const Shell:React.FC = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Toolbar />
      <div className={classes.shell}>
        <div className={classes.scopes}></div>
        <div className={classes.resizer}></div>
        <div></div>
      </div>
    </div>
  )
}

export default Shell;
