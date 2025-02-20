import React from 'react';
import classnames from 'classnames';

import './index.scss';

type DividerProps = {
  id?: string;
  className?: string;
};

const Divider = ({ id, className }: DividerProps) => {
  const classNames = classnames('easi-divider', className);
  return <div id={id} className={classNames} />;
};

export default Divider;
