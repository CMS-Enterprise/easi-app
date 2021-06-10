import React from 'react';
import classnames from 'classnames';

import './index.scss';

type PlainInfoProps = {
  className?: string;
  children: React.ReactNode;
  small?: boolean;
};

/**
 * This is a custom "info" component inspired by USWDS's Alert component.
 * The main difference is that this is plain with no background.
 */
const PlainInfo = ({ className, children, small }: PlainInfoProps) => {
  const classes = classnames('easi-plain-info', className);

  const iconClasses = classnames('easi-plain-info__icon', {
    'easi-plain-info__icon--small': small
  });

  return (
    <div className={classes}>
      <div className={iconClasses}>
        <i className="fa fa-info" />
      </div>
      <p className="line-height-body-5">{children}</p>
    </div>
  );
};

export default PlainInfo;
