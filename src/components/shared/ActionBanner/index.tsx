import React from 'react';
import './index.scss';

type ActionBannerProps = {
  title: string;
  helpfulText: string;
  label: string;
  onClick?: () => void;
};

const ActionBanner = ({
  title,
  helpfulText,
  label,
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
            {label}
          </button>
        ) : (
          <span className="action-banner__action-label">{label}</span>
        )}
      </div>
    </div>
  );
};

export default ActionBanner;
