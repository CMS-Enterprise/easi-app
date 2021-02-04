import React from 'react';
import classnames from 'classnames';

type PageHeadingProps = {
  children: React.ReactNode;
  className?: string;
} & JSX.IntrinsicElements['h1'];

/**
 * Default h1 used on views, primarily to standardize h1 spacing
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
