import React, {useState, useEffect} from "react";
import {Controlled as Mirror} from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material-ocean.css';
import 'codemirror/mode/python/python';

interface Iprops {
  code: string,
  handleUpdateCode(code: string): void
  updateWidthAndHeight(width:number, lineHeight:number): void
}

const Editor:React.FC<Iprops> = ({
  code,
  handleUpdateCode,
  updateWidthAndHeight
}) => {
  const [fontWidth, setWidth] = useState(7);
  const [lineHeight, setLineHeight] = useState(13);
  const handleMirrorBeforeChange = (editor:any, data:any, value:string) => {
    const newHineHeight = editor.defaultTextHeight();
    const newWidth = editor.defaultCharWidth();
    setWidth(newWidth);
    setLineHeight(newHineHeight);
    handleUpdateCode(value);
  }

  useEffect(() => {
    updateWidthAndHeight(fontWidth, lineHeight);
  }, [lineHeight]);

  return (
    <div style={{fontSize: "23px"}}>
      <Mirror
        value={code}
        onBeforeChange={handleMirrorBeforeChange}
        options={{
          mode: "python",
          theme: "material-ocean",
          lineNumbers: true
        }}
      />
    </div>
  )
}

export default Editor;