import React from 'react';
import {Icompiler, Iscope} from '../../types/compiler';
import {Button, Paper, Card, makeStyles} from '@material-ui/core';
import {valueConvert, typeOf} from '../../utils/tools';

interface ShellProps {
  compiler: Icompiler
  handleRunClick(e:React.MouseEvent):void,
  handleNexClick(e:React.MouseEvent):void,
  handleRenderClick(e:React.MouseEvent):void
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    '& > *': {
      paddingRight: theme.spacing(1)
    }
  },
  showArea: {
    display: 'flex',
    flexDirection: 'row'
  }
}));

const Shell: React.FC<ShellProps> = props => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div>
        <Button
          onClick={props.handleRunClick}
          color="primary"
          size="small"
        >RUN</Button>
        <Button
          onClick={props.handleRenderClick}
          color="primary"
          size="small"
        > RENDER
        </Button>
        <Button
          onClick={props.handleNexClick}
          color="primary"
          size="small"
        > NEXT
        </Button>
      </div>
    </div>
  );
}

export default Shell;
