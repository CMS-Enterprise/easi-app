import React from 'react';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import { Trans, useTranslation } from 'react-i18next';

const AccesibilityStatement = () => {
  const { t } = useTranslation();

  const communicationsHowToRequestListElem1SubList: string[] = t(
    'accessibilityStatement:communicationsHowToRequestListElem1SubList',
    { returnObjects: true }
  );
  const communicationsHowToRequestListCMSAddressList: string[] = t(
    'accessibilityStatement:communicationsHowToRequestListCMSAddressList',
    { returnObjects: true }
  );

  return (
    <div>
      <Header />
      <MainContent className="grid-container">
        {/* Surround in Trans tags to properly format embedded HTML tags in i18n file */}
        <Trans>
          <h1>{t('accessibilityStatement:mainTitle')}</h1>

          {/* Accessible Communications */}
          <h2>{t('accessibilityStatement:communicationsTitle')}</h2>
          <p>{t('accessibilityStatement:communicationsParagraph1')}</p>
          <p>{t('accessibilityStatement:communicationsParagraph2')}</p>

          <ol>
            <li>
              {t('accessibilityStatement:communicationsHowToRequestListElem1')}
              <ul>
                {communicationsHowToRequestListElem1SubList.map(k => (
                  <li key={k}>{k}</li>
                ))}
              </ul>
            </li>
            <li>
              {t('accessibilityStatement:communicationsHowToRequestListElem2')}
              <a href="mailto:altformatrequest@cms.hhs.gov">
                {t(
                  'accessibilityStatement:communicationsHowToRequestListElem2Email'
                )}
              </a>
            </li>
            <li>
              {t('accessibilityStatement:communicationsHowToRequestListElem3')}
            </li>
            <li>
              {t('accessibilityStatement:communicationsHowToRequestListElem4')}
              <ul list-style="list-style-type:none;">
                {communicationsHowToRequestListCMSAddressList.map(k => (
                  <p key={k}>{k}</p>
                ))}
              </ul>
            </li>
          </ol>

          <p>{t('accessibilityStatement:communicationsParagraph3')}</p>

          <p>{t('accessibilityStatement:communicationsParagraph4')}</p>

          {/* Non-Discrimination Notice */}
          <h2>{t('accessibilityStatement:nondiscriminationTitle')}</h2>
          <p>{t('accessibilityStatement:nondiscriminationParagraph')}</p>

          {/* How to File a Compliant */}
          <h2>{t('accessibilityStatement:fileComplaintHowToTitle')}</h2>
          <p>{t('accessibilityStatement:fileComplaintHowToParagraph1')}</p>
          <p>{t('accessibilityStatement:fileComplaintHowToParagraph2')}</p>

          <ol>
            <li>
              <a href="https://www.hhs.gov/civil-rights/filing-a-complaint/complaint-process/index.html">
                {t('accessibilityStatement:fileComplaintHowToListElem1')}
              </a>
            </li>
            <li>{t('accessibilityStatement:fileComplaintHowToListElem2')}</li>
            <li>{t('accessibilityStatement:fileComplaintHowToListElem3')}</li>
          </ol>

          {/* 508 Compliance */}
          <h2>{t('accessibilityStatement:complianceTitle')}</h2>

          <p>
            {t('accessibilityStatement:complianceParagraph1')}
            <a href="mailto:508Feedback@cms.hhs.gov">
              {t('accessibilityStatement:complianceEmail')}
            </a>
            {t('accessibilityStatement:complianceParagraph2')}
          </p>

          {/* Additional Information */}
          <h2>{t('accessibilityStatement:additionalInformationTitle')}</h2>

          <ul>
            <li>
              <a href="https://www.hhs.gov/web/section-508/what-is-section-504/index.html">
                {t('accessibilityStatement:additionalInformation508')}
              </a>
            </li>
            <li>
              <a href="https://www.hhs.gov/civil-rights/for-individuals/index.html">
                {t('accessibilityStatement:additionalInformationCivilRights')}
              </a>
            </li>
          </ul>
        </Trans>
      </MainContent>
    </div>
  );
};

export default AccesibilityStatement;
