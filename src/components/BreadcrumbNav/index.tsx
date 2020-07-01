import React from 'react';
import classnames from 'classnames';

import './index.scss';

type BreadcrumbNavProps = {
  children:
    | React.ReactElement<HTMLLIElement>
    | React.ReactElement<HTMLLIElement>[];
  className?: string;
};

const BreadcrumbNav = ({ className, children }: BreadcrumbNavProps) => {
  const classes = classnames('easi-breadcrumb-nav', className);
  return (
    <nav role="navigation" className={classes} aria-label="breadcrumbs">
      <ol>{children}</ol>
    </nav>
  );
};

export default BreadcrumbNav;
