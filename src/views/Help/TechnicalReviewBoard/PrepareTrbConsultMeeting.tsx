import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, SummaryBox } from '@trussworks/react-uswds';

import HelpBreadcrumb from 'components/HelpBreadcrumb';
import HelpPageIntro from 'components/HelpPageIntro';
import MainContent from 'components/MainContent';
import RelatedArticles from 'components/RelatedArticles';
import { CMS_TRB_EMAIL, TRB_DECK_TEMPLATES } from 'constants/externalUrls';

import NeedHelpBox from '../InfoBox/NeedHelpBox';

function PrepareTrbConsultMeeting() {
  const { t } = useTranslation('technicalAssistance');
  return (
    <>
      <MainContent className="grid-container">
        <HelpBreadcrumb type="Close tab" />
        <HelpPageIntro
          type="Technical Review Board"
          heading={t('prepare.title')}
          subheading={t('prepare.description')}
        />

        <h2 className="font-heading-xl line-height-heading-2 margin-top-3 margin-bottom-2">
          {t('prepare.what.title')}
        </h2>
        <div className="line-height-body-5">
          {t('prepare.what.description')}
        </div>

        <h3 className="margin-top-3 margin-bottom-1">
          {t('prepare.whatToExpect.title')}
        </h3>
        <div className="line-height-body-5">
          {t('prepare.whatToExpect.description')}
        </div>

        <div className="bg-base-lightest margin-top-2 padding-2">
          <h3 className="margin-top-0 margin-bottom-1">
            {t('prepare.tips.title')}
          </h3>
          <ul className="easi-list line-height-body-5">
            <li>{t('prepare.tips.list.0')}</li>
            <li>{t('prepare.tips.list.1')}</li>
            <li>{t('prepare.tips.list.2')}</li>
            <li>{t('prepare.tips.list.3')}</li>
            <li>{t('prepare.tips.list.4')}</li>
            <li>{t('prepare.tips.list.5')}</li>
          </ul>
        </div>

        <h2 className="margin-top-6 margin-bottom-2">
          {t('prepare.whatToBring.title')}
        </h2>
        <div className="line-height-body-5 margin-bottom-1">
          {t('prepare.whatToBring.description')}
        </div>
        <ul className="easi-list line-height-body-5">
          <li>{t('prepare.whatToBring.list.0')}</li>
          <li>{t('prepare.whatToBring.list.1')}</li>
          <li>{t('prepare.whatToBring.list.2')}</li>
        </ul>

        <SummaryBox
          heading={t('prepare.downloadTemplates.title')}
          className="desktop:grid-col-6 margin-top-4"
        >
          <p>
            <Trans
              i18nKey="technicalAssistance:prepare.downloadTemplates.description"
              components={{
                a: <Link href={`mailto:${CMS_TRB_EMAIL}`}> </Link>,
                email: CMS_TRB_EMAIL
              }}
            />
          </p>
          <p>
            <Link href={TRB_DECK_TEMPLATES} variant="external">
              {t('prepare.downloadTemplates.link')}
            </Link>
          </p>
        </SummaryBox>

        <h2 className="margin-top-6 margin-bottom-2">
          {t('prepare.outcomes.title')}
        </h2>
        <div className="line-height-body-5 margin-bottom-1">
          {t('prepare.outcomes.description')}
        </div>
        <ul className="easi-list line-height-body-5">
          <li>{t('prepare.outcomes.list.0')}</li>
          <li>{t('prepare.outcomes.list.1')}</li>
          <li>{t('prepare.outcomes.list.2')}</li>
          <li>{t('prepare.outcomes.list.3')}</li>
        </ul>

        <NeedHelpBox
          className="desktop:grid-col-6 margin-top-6"
          content={t('prepare.help.text')}
          email={CMS_TRB_EMAIL}
        />
      </MainContent>

      <div className="margin-top-7">
        <RelatedArticles type="Technical Review Board" />
      </div>
    </>
  );
}

export default PrepareTrbConsultMeeting;
