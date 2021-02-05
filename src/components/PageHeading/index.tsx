import React from 'react';
import classnames from 'classnames';

type PageHeadingProps = {
  children: React.ReactNode;
  className?: string;
} & JSX.IntrinsicElements['h1'];

/**
 * This is h1 that belongs on every page.
 * Design wants to standardize the margins around h1 that appear at the top of the page.
 * This gives the h1 element more room to breathe.
 */
const PageHeading = ({ children, className, ...props }: PageHeadingProps) => {
  const classes = classnames('margin-top-6', 'margin-bottom-5', className);
  return (
    <h1 className={classes} {...props}>
      {children}
    </h1>
  );
};

export default PageHeading;
