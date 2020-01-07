import React from 'react';
import './Line.css';
import './common.css';
import Element from './Element';

interface LineStyle {
  fontSize: string,
  lineHeight: string,
  height: string,
  color: string
}

type LineTokens = string[];

const Line: React.FC<{
  lineStyle: LineStyle,
  lineTokens: LineTokens
}> = ({
  lineStyle,
  lineTokens
}) => {
  return (
    <pre className="line measureLine" style={ lineStyle }>
      {lineTokens.map((token, index) => 
          <Element key={ index } content={ token }></Element>
        )
      }
    </pre>
  );
}

export default Line;
