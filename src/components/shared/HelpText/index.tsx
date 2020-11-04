import React, { ReactNode } from 'react';
import classnames from 'classnames';

import './index.scss';

type HelpTextProps = {
  id?: string;
  children: ReactNode;
  className?: string;
};

const HelpText = ({ id, children, className }: HelpTextProps) => {
  const classNames = classnames('easi-help-text', className);
  return (
    <div id={id} className={classNames}>
      {children}
    </div>
  );
};

export default HelpText;
