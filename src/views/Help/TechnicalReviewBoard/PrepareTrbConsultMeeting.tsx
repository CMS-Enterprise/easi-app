import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Link,
  SummaryBox,
  SummaryBoxContent,
  SummaryBoxHeading
} from '@trussworks/react-uswds';

import HelpBreadcrumb from 'components/HelpBreadcrumb';
import HelpPageIntro from 'components/HelpPageIntro';
import MainContent from 'components/MainContent';
import RelatedArticles from 'components/RelatedArticles';
import { CMS_TRB_EMAIL, TRB_DECK_TEMPLATES } from 'constants/externalUrls';
import useScrollToLocation from 'hooks/useScrollToLocation';

import NeedHelpBox from '../InfoBox/NeedHelpBox';

function PrepareTrbConsultMeeting() {
  const { t } = useTranslation('prepareTrbConsultMeeting');

  useScrollToLocation();

  return (
    <>
      <MainContent className="grid-container margin-bottom-7">
        <HelpBreadcrumb type="close" />
        <HelpPageIntro
          type="Technical Review Board"
          heading={t('title')}
          subheading={t('description')}
        />

        <h2 className="font-heading-xl line-height-heading-2 margin-top-3 margin-bottom-2">
          {t('what.title')}
        </h2>
        <p className="line-height-body-5">{t('what.description')}</p>

        <h3 className="margin-top-3 margin-bottom-1">
          {t('whatToExpect.title')}
        </h3>
        <div className="line-height-body-5">
          {t('whatToExpect.description')}
        </div>

        <div className="bg-base-lightest margin-top-2 padding-2">
          <h3 className="margin-top-0 margin-bottom-1">{t('tips.title')}</h3>
          <ul className="easi-list line-height-body-5">
            <li>{t('tips.list.0')}</li>
            <li>{t('tips.list.1')}</li>
            <li>{t('tips.list.2')}</li>
            <li>{t('tips.list.3')}</li>
            <li>{t('tips.list.4')}</li>
            <li>{t('tips.list.5')}</li>
          </ul>
        </div>

        <h2 className="margin-top-6 margin-bottom-2">
          {t('whatToBring.title')}
        </h2>
        <div className="line-height-body-5 margin-bottom-1">
          {t('whatToBring.description')}
        </div>
        <ul className="easi-list line-height-body-5">
          <li>{t('whatToBring.list.0')}</li>
          <li>{t('whatToBring.list.1')}</li>
          <li>{t('whatToBring.list.2')}</li>
        </ul>

        <div id="download-presentation-templates" />
        <SummaryBox className="desktop:grid-col-6 margin-top-4">
          <SummaryBoxHeading headingLevel="h3">
            {t('downloadTemplates.title')}
          </SummaryBoxHeading>
          <SummaryBoxContent>
            <p>
              <Trans
                i18nKey="prepareTrbConsultMeeting:downloadTemplates.description"
                components={{
                  a: <Link href={`mailto:${CMS_TRB_EMAIL}`}> </Link>,
                  email: CMS_TRB_EMAIL
                }}
              />
            </p>
            <div>
              <Link href={TRB_DECK_TEMPLATES} variant="external">
                {t('downloadTemplates.link')}
              </Link>
            </div>
          </SummaryBoxContent>
        </SummaryBox>

        <h2 className="margin-top-6 margin-bottom-2">{t('outcomes.title')}</h2>
        <div className="line-height-body-5 margin-bottom-1">
          {t('outcomes.description')}
        </div>
        <ul className="easi-list line-height-body-5">
          <li>{t('outcomes.list.0')}</li>
          <li>{t('outcomes.list.1')}</li>
          <li>{t('outcomes.list.2')}</li>
          <li>{t('outcomes.list.3')}</li>
        </ul>

        <NeedHelpBox
          className="desktop:grid-col-6 margin-top-6"
          content={t('help.text')}
          email={CMS_TRB_EMAIL}
        />
      </MainContent>

      <RelatedArticles articles={['stepsInTRBProcess']} />
    </>
  );
}

export default PrepareTrbConsultMeeting;
