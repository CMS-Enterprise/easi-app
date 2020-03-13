import React from 'react';
import './index.scss';

type ActionBannerProps = {
  title: string;
  helpfulText: string;
  actionLabel: string;
  onClick?: () => void;
};

const ActionBanner = ({
  title,
  helpfulText,
  actionLabel,
  onClick
}: ActionBannerProps) => {
  return (
    <div className="action-banner usa-alert">
      <div className="action-banner__icon">
        <i className="fa fa-clock-o fa-3x" />
      </div>
      <span className="action-banner__text">
        <h2>{title}</h2>
        <p>{helpfulText}</p>
      </span>
      <div className="action-banner__button">
        {onClick ? (
          <button type="button" onClick={onClick} className="usa-button">
            {actionLabel}
          </button>
        ) : (
          <span className="action-banner__action-label">{actionLabel}</span>
        )}
      </div>
    </div>
  );
};

export default ActionBanner;
