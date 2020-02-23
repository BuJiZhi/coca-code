import React from 'react';
import {Iscope} from '../../types/compiler';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    left: theme.spacing(1),
    right: theme.spacing(1),
    top: theme.spacing(1),
    bottom: theme.spacing(1),
    padding: theme.spacing(1),
    overflow: 'auto',
    backgroundColor: '#eee'
  },
  block: {
    fontSize: '15px',
    width: '150px',
    height: 'auto',
    padding: theme.spacing(1),
    backgroundColor: 'rgb(92, 183, 18)',
    borderRadius: '3px 3px 0 0'
  },
  field: {
    color: "#333",
    display: 'flex',
    flexDirection: 'row'
  },
  key: {
    width: "30%",
    backgroundColor: "rgb(245, 245, 245)"
  },
  provider: {
    flexShrink: 0,
    width: theme.spacing(1)
  },
  value: {
    width: "70%",
    backgroundColor: "rgb(245, 245, 245)"
  }
}));

interface Iprops {
  scopes: Iscope[]
}

const Scope:React.FC<Iprops> = ({scopes}) => {

  const classes = useStyles();

  const ScopeElement = (scope:Iscope) => {
    if (scope) return (
      <div className={classes.block}>
        {Object.keys(scope.declartion).map((key, idx) => (
            <div key={idx} className={classes.field}>
              <div className={classes.key}>{key}</div>
              <div className={classes.provider} />
              <div className={classes.value}>{scope.get(key).value}</div>
            </div>
          ))
        }
        {scope.childScope.map((child:Iscope) => ScopeElement(child))}
      </div>
    )
  }

  return (<div className={classes.root}>{ScopeElement(scopes[0])}</div>);
}

export default Scope;