import React from 'react';
import Toolbar from '../Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import {Icompiler} from '../../types/compiler';
import Scope from './Scope';

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
    position: 'relative',
    height: '50%',
    overflow: 'hidden'
  },
  resizer: {
    height: theme.spacing(2),
    backgroundColor: "rgb(51, 56, 66)"
  }
}));

interface Iprops {
  compiler: Icompiler;
}

const Shell:React.FC<Iprops> = ({compiler}) => {
  const {mirrorScopes} = compiler;
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Toolbar />
      <div className={classes.shell}>
        <div className={classes.scopes}>
          <Scope scopes={mirrorScopes}/>
        </div>
        <div className={classes.resizer}></div>
        <div></div>
      </div>
    </div>
  )
}

export default Shell;
