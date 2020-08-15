import React from 'react';
import classnames from 'classnames';

import './index.scss';

type CharacterCounterProps = {
  id: string;
  characterCount: number;
  className?: string;
};

const CharacterCounter = ({
  id,
  characterCount,
  className
}: CharacterCounterProps) => {
  const classes = classnames(
    'easi-character-counter',
    'margin-top-1',
    className
  );
  return (
    <span
      id={id}
      className={classes}
      aria-live="polite"
      aria-atomic={false}
    >{`${characterCount} characters remaining`}</span>
  );
};

export default CharacterCounter;
