import React from 'react';
import { useTranslation } from 'react-i18next';
import { Footer as UswdsFooter, FooterNav } from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import cmsGovLogo from 'images/cmsGovLogo.png';
import hhsLogo from 'images/hhsLogo.png';

import './index.scss';

const Footer = () => {
  const { t } = useTranslation('footer');
  const footerNavLinks = [
    {
      label: t('labels.privacy'),
      link: '/privacy-policy'
    },
    {
      label: t('labels.cookies'),
      link: '/cookies'
    },
    {
      label: t('labels.terms'),
      link: '/terms-and-conditions'
    },
    {
      label: t('labels.accessibility'),
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
                <UswdsReactLink
                  className="usa-footer__primary-link"
                  link={item.link}
                  key={item.link}
                >
                  {item.label}
                </UswdsReactLink>
              ))}
            />
          </div>
        </div>
      }
      secondary={
        <div>
          <div className="easi-footer__secondary-logo-wrap">
            <img alt={t('altText.cmsLogo')} src={cmsGovLogo} />
            <img
              className="margin-left-1"
              alt={t('altText.hhsLogo')}
              src={hhsLogo}
            />
          </div>
          <span>{t('cmsTagline')}</span>
        </div>
      }
    />
  );
};

export default Footer;
