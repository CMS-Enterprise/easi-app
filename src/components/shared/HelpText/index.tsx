import React, { ReactNode } from 'react';
import classnames from 'classnames';

import './index.scss';

type HelpTextProps = {
  id?: string;
  children: ReactNode;
  className?: string;
  'data-testid'?: string;
};

const HelpText = ({
  id,
  children,
  className,
  'data-testid': datatestid
}: HelpTextProps) => {
  const classNames = classnames('easi-help-text', className);
  return (
    <div id={id} className={classNames} data-testid={datatestid}>
      {children}
    </div>
  );
};

export default HelpText;
