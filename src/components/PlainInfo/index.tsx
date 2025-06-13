import React from 'react';
import { Icon } from '@trussworks/react-uswds';
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

  return (
    <div className={classes}>
      <Icon.Info
        aria-hidden
        size={small ? 3 : 5}
        className="easi-plain-info__icon"
      />
      <p className="line-height-body-5">{children}</p>
    </div>
  );
};

export default PlainInfo;
