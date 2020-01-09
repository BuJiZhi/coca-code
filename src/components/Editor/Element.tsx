import React,{ useState } from 'react';
import './Element.css';

interface Ielement {
  content: string,
}

const Element: React.FC<Ielement> = ({content}) => {
  let text = content.replace(/\s/g, '&ensp;');
  return (
    <span 
      className="element" 
      dangerouslySetInnerHTML={{__html: text}} 
    />
  );
}

export default Element;
