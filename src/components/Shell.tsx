import React from 'react';
import { Button } from '@material-ui/core';

interface ShellProps {
  handleRunClick(e: React.MouseEvent): void,
  handleNexClick(e: React.MouseEvent): void
}

const Shell: React.FC<ShellProps> = props => {
  return (
    <div>
      <Button
        onClick={ props.handleRunClick }
        color="primary"
      >RUN</Button>
      <Button
        onClick={ props.handleNexClick }
        color="primary"
      >
        NEXT
      </Button>
    </div>
  );
}

export default Shell;
