import React, { ReactNode } from 'react';
import classnames from 'classnames';

import './index.scss';

type HelpTextProps = {
  children: ReactNode;
  className?: string;
};

const HelpText = ({ children, className }: HelpTextProps) => {
  const classNames = classnames('easi-help-text', className);
  return <div className={classNames}>{children}</div>;
};

export default HelpText;
