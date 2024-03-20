import React, { ReactNode } from 'react';
import classnames from 'classnames';

import './index.scss';

type SectionWrapperProps = {
  className?: string;
  children?: ReactNode;
  border?: boolean;
  borderBottom?: boolean;
  borderTop?: boolean;
  id?: string;
  style?: React.CSSProperties;
};

const SectionWrapper = ({
  className,
  children,
  border,
  borderBottom,
  borderTop,
  id,
  style
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
    <div
      id={id}
      data-testid="section-wrapper"
      className={classNames}
      style={style}
    >
      {children}
    </div>
  );
};

export default SectionWrapper;
