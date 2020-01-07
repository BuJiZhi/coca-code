import React from 'react';
import './Cursor.css';

interface Icursor {
  style: any
}

const Cursor: React.FC<Icursor> = (props) => {
  let pos:[number, number];
  const { currenIndex, fontWidth, lineHeight } = props.style;
  if (currenIndex) {
    pos = [
      currenIndex[0] * fontWidth - 2,
      currenIndex[1] * lineHeight
    ];
  } else {
    pos = [0, 0]
  }
  return (
    <pre 
      className="cursor"
      style={{
        left: `${pos[0]}px`,
        top: `${pos[1]}px`
      }}
    ></pre>
  );
}

export default Cursor;
