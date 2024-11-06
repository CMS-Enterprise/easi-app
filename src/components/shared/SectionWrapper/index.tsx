import React, { ReactNode } from 'react';
import classnames from 'classnames';

import './index.scss';

type SectionWrapperProps = {
  className?: string;
  id?: string;
  children?: ReactNode;
  border?: boolean;
  borderBottom?: boolean;
  borderTop?: boolean;
};

const SectionWrapper = ({
  className,
  id,
  children,
  border,
  borderBottom,
  borderTop
}: SectionWrapperProps) => {
  const classNames = classnames(
    'easi-section',
    {
      'easi-section__border': border,
      'easi-section__border-bottom': borderBottom,
      'easi-section__border-top': borderTop
    },
    className
  );
  return (
    <div data-testid="section-wrapper" className={classNames} id={id}>
      {children}
    </div>
  );
};

export default SectionWrapper;
