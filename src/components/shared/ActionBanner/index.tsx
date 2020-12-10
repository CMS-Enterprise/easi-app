import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@trussworks/react-uswds';

import './index.scss';

type ActionBannerProps = {
  title: string;
  requestType: string;
  helpfulText: string;
  label: any;
  buttonUnstyled?: boolean;
  onClick?: () => void;
};

const ActionBanner = ({
  title,
  requestType,
  helpfulText,
  label,
  buttonUnstyled,
  onClick,
  ...remainingProps
}: ActionBannerProps) => {
  const { t } = useTranslation('intake');

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div className="action-banner usa-alert" {...remainingProps}>
      <span className="text-base-dark font-body-3xs">
        {t(`requestTypeMap.${requestType}`)}
      </span>
      <div className="action-banner__content">
        <div className="action-banner__icon">
          <i className="fa fa-clock-o fa-3x" />
        </div>
        <span className="action-banner__text margin-right-2">
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
    </div>
  );
};

export default ActionBanner;
