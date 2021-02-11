import React from 'react';

import './index.scss';

type PlainInfoProps = {
  children: React.ReactNode;
};

/**
 * This is a custom "info" component inspired by USWDS's Alert component.
 * The main difference is that this is plain with no background.
 */
const PlainInfo = ({ children }: PlainInfoProps) => {
  return (
    <div className="easi-plain-info">
      <div className="easi-plain-info__icon">
        <i className="fa fa-info" />
      </div>
      <p className="line-height-body-5">{children}</p>
    </div>
  );
};

export default PlainInfo;
