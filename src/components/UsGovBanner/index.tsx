import React, { useState } from 'react';
import dotGovSvg from 'uswds/src/img/icon-dot-gov.svg';
import httpsSvg from 'uswds/src/img/icon-https.svg';
import flagImg from 'uswds/src/img/us_flag_small.png';

const UsGovBanner = () => {
  const [displayContent, setDisplayContent] = useState(false);
  return (
    <div className="usa-banner">
      <div className="usa-accordion">
        <div className="usa-banner__header">
          <div className="usa-banner__inner">
            <div className="grid-col-auto">
              <img
                className="usa-banner__header-flag"
                src={flagImg}
                alt="U.S. flag"
              />
            </div>
            <div className="grid-col-fill tablet:grid-col-auto">
              <p className="usa-banner__header-text">
                An official website of the United States government
              </p>
              <p className="usa-banner__header-action" aria-hidden="true">
                Here’s how you know
              </p>
            </div>
            <button
              type="button"
              className="usa-accordion__button usa-banner__button"
              aria-expanded={displayContent}
              aria-controls="gov-banner"
              onClick={() => setDisplayContent(prev => !prev)}
            >
              <span className="usa-banner__button-text">
                Here’s how you know
              </span>
            </button>
          </div>
        </div>
        <div
          className="usa-banner__content usa-accordion__content"
          id="gov-banner"
          hidden={!displayContent}
        >
          <div className="grid-row grid-gap-lg">
            <div className="usa-banner__guidance tablet:grid-col-6">
              <img
                className="usa-banner__icon usa-media-block__img"
                src={dotGovSvg}
                alt="Dot gov"
              />
              <div className="usa-media-block__body">
                <p>
                  <strong>The .gov means it’s official.</strong>
                  <br /> Federal government websites often end in .gov or .mil.
                  Before sharing sensitive information, make sure you’re on a
                  federal government site.
                </p>
              </div>
            </div>
            <div className="usa-banner__guidance tablet:grid-col-6">
              <img
                className="usa-banner__icon usa-media-block__img"
                src={httpsSvg}
                alt="Https"
              />
              <div className="usa-media-block__body">
                <p>
                  <strong>The site is secure.</strong>
                  <br /> The <strong>https://</strong> ensures that you are
                  connecting to the official website and that any information
                  you provide is encrypted and transmitted securely.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsGovBanner;
