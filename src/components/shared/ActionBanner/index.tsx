import React from 'react';
import { Button } from '@trussworks/react-uswds';

import './index.scss';

type ActionBannerProps = {
  title: string;
  helpfulText: string;
  label: any;
  buttonUnstyled?: boolean;
  onClick?: () => void;
};

const ActionBanner = ({
  title,
  helpfulText,
  label,
  buttonUnstyled,
  onClick,
  ...remainingProps
}: ActionBannerProps) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div className="action-banner usa-alert" {...remainingProps}>
      <div className="action-banner__icon">
        <i className="fa fa-clock-o fa-3x" />
      </div>
      <span className="action-banner__text">
        <h2>{title}</h2>
        <p>{helpfulText}</p>
      </span>
      <div className="action-banner__button">
        {onClick ? (
          <Button
            type="button"
            onClick={onClick}
            className="usa-button"
            unstyled={buttonUnstyled}
          >
            {label}
          </Button>
        ) : (
          <span className="action-banner__action-label">{label}</span>
        )}
      </div>
    </div>
  );
};

export default ActionBanner;
