import React from 'react';
import './Element.css';

type Content = string;

const Element: React.FC<{content: Content}> = ({content}) => {
  let text = content.replace(/\s/g, '&ensp;');
  return (
    <span className="element" dangerouslySetInnerHTML={{__html: text}} />
  );
}

export default Element;
