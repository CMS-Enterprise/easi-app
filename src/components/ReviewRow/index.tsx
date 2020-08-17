import React from 'react';
import classnames from 'classnames';

import './index.scss';

/**
 * This component wraps around rows on form review pages to align
 * content in the layout.
 */
const ReviewRow = ({ children, className }: any) => {
  const classes = classnames('easi-review-row', className);
  return <div className={classes}>{children}</div>;
};

export default ReviewRow;
