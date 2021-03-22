import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from '@trussworks/react-uswds';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageWrapper from 'components/PageWrapper';

const AccesibilityStatement = () => {
  const { t } = useTranslation();

  return (
    <PageWrapper>
      <Header />
      <MainContent className="grid-container line-height-body-5">
        <PageHeading>{t('accessibilityStatement:mainTitle')}</PageHeading>

        {/* Accessible Communications */}
        <div>
          <h2>{t('accessibilityStatement:communications.heading')}</h2>
          <p>{t('accessibilityStatement:communications.description')}</p>
          <p>
            {t('accessibilityStatement:communications.accessibleFormatRequest')}
          </p>

          <ol>
            <li>
              <strong>
                {t('accessibilityStatement:communications.phone.label')}
              </strong>
              <ul>
                <li>
                  {t('accessibilityStatement:communications.phone.medicare')}
                </li>
                <li>
                  {t(
                    'accessibilityStatement:communications.phone.healthInsuranceMarketplace'
                  )}
                </li>
              </ul>
            </li>
            <li>
              <strong>
                {t('accessibilityStatement:communications.email.label')}
              </strong>
              &nbsp;
              <Link href="mailto:altformatrequest@cms.hhs.gov">
                {t('accessibilityStatement:communications.email.address')}
              </Link>
            </li>
            <li>
              <strong>
                {t('accessibilityStatement:communications.fax.label')}
              </strong>
              &nbsp;
              <span>
                {t('accessibilityStatement:communications.fax.number')}
              </span>
            </li>
            <li>
              <strong>
                {t('accessibilityStatement:communications.physicalMail.label')}
              </strong>
              <address className="margin-left-2">
                {t(
                  'accessibilityStatement:communications.physicalMail.address.line1'
                )}
                <br />
                {t(
                  'accessibilityStatement:communications.physicalMail.address.line2'
                )}
                <br />
                {t(
                  'accessibilityStatement:communications.physicalMail.address.street'
                )}
                <br />
                {t(
                  'accessibilityStatement:communications.physicalMail.address.cityStateZip'
                )}
                <br />
                {t(
                  'accessibilityStatement:communications.physicalMail.address.attention'
                )}
              </address>
            </li>
          </ol>

          <p>
            {t('accessibilityStatement:communications.requestInstructions')}
          </p>

          <Trans i18nKey="accessibilityStatement:communications.note">
            <strong>indexZero</strong>&nbsp;indexOne
          </Trans>
        </div>

        {/* Non-Discrimination Notice */}
        <div>
          <h2>{t('accessibilityStatement:nondiscrimination.heading')}</h2>
          <p>{t('accessibilityStatement:nondiscrimination.description')}</p>
        </div>

        {/* How to File a Compliant */}
        <div>
          <h2>{t('accessibilityStatement:complaintFiling.heading')}</h2>
          <p>{t('accessibilityStatement:complaintFiling.contact')}</p>
          <p>{t('accessibilityStatement:complaintFiling.description')}</p>

          <ol>
            <li>
              <Link
                aria-label="Open a new tab to file a complaint"
                href="https://www.hhs.gov/civil-rights/filing-a-complaint/complaint-process/index.html"
                target="_blank"
                rel="noopener noreferrer"
                variant="external"
              >
                {t('accessibilityStatement:complaintFiling.online')}
              </Link>
            </li>
            <li>
              <strong>
                {t('accessibilityStatement:complaintFiling.phone.label')}
              </strong>
              &nbsp;
              <span>
                {t('accessibilityStatement:complaintFiling.phone.number')}
              </span>
            </li>
            <li>
              <strong>
                {t('accessibilityStatement:complaintFiling.physicalMail.label')}
              </strong>
              <address className="margin-left-2">
                {t('accessibilityStatement:complaintFiling.physicalMail.line1')}
                <br />
                {t('accessibilityStatement:complaintFiling.physicalMail.line2')}
                <br />
                {t(
                  'accessibilityStatement:complaintFiling.physicalMail.street1'
                )}
                <br />
                {t(
                  'accessibilityStatement:complaintFiling.physicalMail.street2'
                )}
                <br />
                {t(
                  'accessibilityStatement:complaintFiling.physicalMail.cityStateZip'
                )}
              </address>
            </li>
          </ol>
        </div>

        {/* 508 Compliance */}
        <div>
          <h2>{t('accessibilityStatement:compliance.heading')}</h2>
          <Trans i18nKey="accessibilityStatement:compliance.description">
            indexZero
            <Link href="mailto:508Feedback@cms.hhs.gov">localeLink</Link>
            indexTwo
          </Trans>
        </div>

        <div>
          <h2>{t('accessibilityStatement:additionalInformationTitle')}</h2>

          <ul>
            <li>
              <Link
                aria-label="Open 'What is 504' in a new tab"
                href="https://www.hhs.gov/web/section-508/what-is-section-504/index.html"
                target="_blank"
                rel="noopener noreferrer"
                variant="external"
              >
                {t('accessibilityStatement:additionalInformation508')}
              </Link>
            </li>
            <li>
              <Link
                aria-label="Open Civil Rights for Individuals and Advocates in a new tab"
                href="https://www.hhs.gov/civil-rights/for-individuals/index.html"
                target="_blank"
                rel="noopener noreferrer"
                variant="external"
              >
                {t('accessibilityStatement:additionalInformationCivilRights')}
              </Link>
            </li>
          </ul>
        </div>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default AccesibilityStatement;
