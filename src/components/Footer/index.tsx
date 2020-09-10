import React from 'react';
import { Footer as UswdsFooter, FooterNav } from '@trussworks/react-uswds';

import cmsGovLogo from 'images/cmsGovLogo.png';
import hhsLogo from 'images/hhsLogo.png';

import './index.scss';

const Footer = () => {
  const footerNavLinks = [
    {
      label: 'Privacy policy',
      link: '/privacy'
    },
    {
      label: 'Cookies',
      link: '/cookies'
    },
    {
      label: 'Terms and Conditions',
      link: '/terms-and-conditions'
    },
    {
      label: 'Accessibility Statement',
      link: '/accessibility-statement'
    }
  ];
  return (
    <UswdsFooter
      size="slim"
      primary={
        <div className="usa-footer__primary-container grid-row">
          <div className="mobile-lg:grid-col-8">
            <FooterNav
              size="slim"
              links={footerNavLinks.map(item => (
                <a className="usa-footer__primary-link" href={item.link}>
                  {item.label}
                </a>
              ))}
            />
          </div>
        </div>
      }
      secondary={
        <div>
          <div className="easi-footer__secondary-logo-wrap">
            <img alt="CMS.gov Logo" src={cmsGovLogo} />
            <img
              className="margin-left-1"
              alt="Department of Health and Human Services USA"
              src={hhsLogo}
            />
          </div>
          <span>
            A federal government website managed and paid for by the U.S.
            Centers for Medicare & Medicaid Services. 7500 Security Boulevard,
            Baltimore, MD 2124
          </span>
        </div>
      }
    />
  );
};

export default Footer;
