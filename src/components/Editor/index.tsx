import React, { useState, useEffect } from "react";
import { Controlled as Mirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';

interface Iprops {
  code: string,
  handleUpdateCode(code: string): void
  updateWidthAndHeight(width:number, height:number): void
}

const Editor:React.FC<Iprops> = ({
  code,
  handleUpdateCode,
  updateWidthAndHeight
}) => {
  const [fontWidth, setWidth] = useState(7);
  const [lineHeight, setHeight ] = useState(13);
  const handleMirrorBeforeChange = (editor:any, data:any, value:string) => {
    const height = editor.defaultTextHeight();
    const width = editor.defaultCharWidth();
    setWidth(width);
    setHeight(height)
    handleUpdateCode(value);
  }

  useEffect(() => {
    updateWidthAndHeight(fontWidth, lineHeight);
  }, [lineHeight]);

  return (
    <Mirror
      value={code}
      onBeforeChange={handleMirrorBeforeChange}
      options={{
        mode: "javascript",
        theme: "material",
        lineNumbers: true
      }}
    />
  )
}

export default Editor;