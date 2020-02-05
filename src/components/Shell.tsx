import React from 'react';
import { Icompiler, Iscope } from '../types/compiler';
import { Button, Paper, Card, makeStyles } from '@material-ui/core';

interface ShellProps {
  compiler: Icompiler
  handleRunClick(e: React.MouseEvent): void,
  handleNexClick(e: React.MouseEvent): void,
  handleRenderClick(e: React.MouseEvent): void
}

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    position: 'fixed',
    right: 0,
    top: 0,
    width: '20rem',
    flexDirection: 'column',
    '& > *': {
      margin: theme.spacing(1),
      padding: theme.spacing(1)
    }
  },
  showArea: {
    display: 'flex',
    flexDirection: 'row'
  },
  showCard: {
    width: '50%',
    minHeight: '10rem',
    margin: theme.spacing(1),
    padding: theme.spacing(1)
  }
}))

const Shell: React.FC<ShellProps> = props => {
  const classes = useStyles();
  const renderScope = (scope: Iscope) =>
    <Card className={ classes.showCard }>
      {scope.declartion
        ? Object.keys(scope.declartion).map((item, index) => (
            <div key={ index }>{ item }:{ scope.declartion[item].value === true 
              ? 'true' 
              : scope.declartion[item].value === false 
                ? 'false' 
                : scope.declartion[item].value 
            }</div>
          ))
        : <div></div>
      }
    </Card>
  return (
    <Paper className={ classes.root }>
      <div>
        <Button
          onClick={ props.handleRunClick }
          color="primary"
        >RUN</Button>
        <Button
          onClick={ props.handleRenderClick }
          color="primary"
        > RENDER
        </Button>
        <Button
          onClick={ props.handleNexClick }
          color="primary"
        > NEXT
        </Button>
      </div>
      <div className={ classes.showArea }>
        { renderScope(props.compiler.scope) }
        { renderScope(props.compiler.mirrorScope) }
      </div>
    </Paper>
  );
}

export default Shell;
