import React, { ReactNode } from 'react';
import classnames from 'classnames';
import './index.scss';

type HelpTextProps = {
  children: ReactNode;
  className?: string;
};

const HelpText = ({ children, className }: HelpTextProps) => {
  const classNames = classnames('easi-help-text', 'margin-bottom-2', className);
  return <span className={classNames}>{children}</span>;
};

export default HelpText;
