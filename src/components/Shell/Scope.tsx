import React from "react";
import {Iscope} from "../../types/compiler";
import {makeStyles} from "@material-ui/core/styles";

const config = {
  height: 20,
  fontSize: 20
}

const useStyles = makeStyles(theme => ({
  root: {
    position: "absolute",
    width: "100%",
    left: theme.spacing(1),
    right: theme.spacing(1),
    top: theme.spacing(1),
    bottom: theme.spacing(1),
    padding: theme.spacing(1),
    overflow: "auto",
    backgroundColor: "#eee"
  },
  namespaceWrapper: {
    border: "1px solid black",
    float: "left",
    borderRadius: "3px"
  },
  RamWrapper: {
    float: "left"
  },
  namespace: {
    position: "relative",
    display: "flex",
    boxSizing: "border-box",
    flexDirection: "row",
    fontSize: "15px",
    height: "auto",
    // boxShadow: "2px 1px 1px rgba(22, 103, 144 .5)",
    // backgroundColor: "rgb(92, 177, 214)",
    // border: "1px solid rgba(230, 230, 230, .3)",
    borderRadius: "3px"
  },
  field: {
    position: "relative",
    boxSizing: "border-box",
    width: "100%",
    minWidth: "30px",
    maxWidth: "50px",
    height: `${config.height}px`,
    lineHeight: `${config.height}px`,
    color: "#333",
    backgroundColor: "#eee",
    display: "flex",
    flexDirection: "row",
    fontSize: `${config.fontSize - 10}px`,
    paddingLeft: "2px",
    paddingRight: "2px",
    borderBottom: "1px solid #ccc",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap"
  },
  key: {
    height: `${config.height}px`,
    lineHeight: `${config.height}px`,
    textAlign: "center",
    width: "100%",
    backgroundColor: "rgb(245, 245, 245)"
  },
  value: {
    height: `${config.height}px`,
    lineHeight: `${config.height}px`,
    width: "70%",
    backgroundColor: "rgb(245, 245, 245)"
  },
  scopetitle: {
    flexShrink: 0,
    width: `${config.fontSize - 10}px`,
    textAlign: "center",
    overflow: "hidden",
    backgroundColor: "rgb(76, 151, 255)",
    borderRadius: "3px",
  },
  scopecontent: {
    position: "relative",
    boxSizing: "border-box",
    flexGrow: 1,
    margin: 0,
  },
  contentwrapper: {
    position: "absolute",
    left: 0
  },
  titleinside: {
    position: "absolute",
    fontFamily: "Consolas,Monaco,monospace",
    fontSize: `${config.fontSize - 10}px`,
    width: `${config.fontSize - 10}px`,
    wordWrap: "break-word",
    margin: "0 auto",
    height: `${config.fontSize - 10}px`,
    lineHeight: `${config.fontSize - 10}px`,
  },
  childcontainer: {
    backgroundColor: "rgb(52, 133, 174)"
  },
  ram: {
    padding: "1px",
    marginLeft: theme.spacing(.5),
    backgroundColor: "rgb(0, 0, 0)",
    borderRadius: "3px"
  },
  ramchild: {
    position: "relative",
    boxSizing: "border-box",
    minWidth: "150px",
    height: `${config.height}px`,
    lineHeight: `${config.height}px`,
    color: "#333",
    backgroundColor: "#eee",
    display: "flex",
    flexDirection: "row",
    fontSize: `${config.fontSize - 10}px`,
    paddingLeft: "2px",
    paddingRight: "2px",
    borderBottom: "1px solid #ccc"
  }
}));

interface Iprops {
  scopes: Iscope[]
}

const Scope:React.FC<Iprops> = ({scopes}) => {
  const classes = useStyles();
  const NameSpace = (scope:Iscope) => {
    if (scope) return (
      <div className={classes.namespace}>
        <div className={classes.scopetitle}>
          <div className={classes.titleinside}>
            {scope.type}
          </div>
        </div>
        <div className={classes.scopecontent}>
            {Object.keys(scope.declartion).map((key, idx) => (
                <div key={idx} className={classes.field}>{key}</div>
              ))
            }
            {scope.childScope.length > 0
              ? <div className={classes.childcontainer}>
                  {scope.childScope.map((child:Iscope) => NameSpace(child))}
                </div>
              : ""
            }
          </div>
      </div>
    )
  }

  const RAM = (scope:Iscope) => {
    if (scope) {
      return (
        <div className={classes.ram}>
          {Object.keys(scope.declartion).map((key, idx) =>
            <div key={idx} className={classes.ramchild}>{scope.get(key).value}</div>
          )}
          {scope.childScope.map((child:Iscope, index:number) =>
            Object.keys(child.declartion).map((childkey, index) =>
              <div key={index} className={classes.ramchild}>{child.get(childkey).value}</div>
          ))}
        </div>
      )
  }}

  return (
    <div className={classes.root}>
      <div className={classes.namespaceWrapper}>
        {NameSpace(scopes[0])}
      </div>
      <div className={classes.RamWrapper}>
        {RAM(scopes[0])}
      </div>
    </div>);
}

export default Scope;