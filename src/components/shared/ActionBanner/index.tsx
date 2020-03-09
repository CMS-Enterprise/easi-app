import React from 'react';
import './index.scss';

type ActionBannerProps = {};

const ActionBanner = () => {
  return (
    <div className="action-banner usa-alert">
      <div className="action-banner-icon">
        <i className="fa fa-clock-o fa-3x" />
      </div>
      <span className="action-banner-text">
        <h3>Header</h3>
        <p>Here is some text</p>
      </span>
      <div className="action-banner-button">
        <button type="button" className="usa-button">
          Button name
        </button>
      </div>
    </div>
  );
};

export default ActionBanner;
