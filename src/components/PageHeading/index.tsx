import React, { useEffect, useRef } from 'react';
import classnames from 'classnames';

import './index.scss';

type PageHeadingProps = {
  children: React.ReactNode;
  className?: string;
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
} & JSX.IntrinsicElements['h1'];

/**
 * By default, this is h1 that belongs on every view page.
 * Design wants to standardize the margins around h1 that appear at the top of the page.
 * This gives the h1 element more room to breathe.
 * It can also be used as any heading level if it needs to be read on mount on assistive tech.
 */
const PageHeading = ({
  children,
  className,
  headingLevel,
  ...props
}: PageHeadingProps) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const Component = headingLevel || 'h1';
  const classes = classnames('easi-h1', className);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <Component className={classes} tabIndex={-1} ref={headingRef} {...props}>
      {children}
    </Component>
  );
};

export default PageHeading;
