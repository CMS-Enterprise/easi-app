import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from '@trussworks/react-uswds';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageWrapper from 'components/PageWrapper';
import CollapsableLink from 'components/shared/CollapsableLink';
import { Step, StepBody, StepHeading, StepList } from 'components/StepList';

import './index.scss';

const AccessibilityTestingStepsOverview = () => {
  const { t } = useTranslation('accessibility');

  const exceptionReasons: string[] = t(
    'testingStepsOverview.exception.reasons',
    {
      returnObjects: true
    }
  );

  return (
    <PageWrapper className="accessibility-testing-overview">
      <Header />
      <MainContent className="margin-bottom-5">
        <div className="grid-container">
          <div className="tablet:grid-col-10">
            <PageHeading>{t('testingStepsOverview.heading')}</PageHeading>
            <p className="accessibility-testing-overview__description">
              {t('testingStepsOverview.description')}
            </p>
          </div>
          <div className="tablet:grid-col-8 margin-top-6">
            <h2>{t('testingStepsOverview.stepListHeading')}</h2>
            <StepList>
              <Step>
                <StepHeading>
                  {t('testingStepsOverview.fillForm.heading')}
                </StepHeading>
                <StepBody>
                  <p className="margin-0">
                    {t('testingStepsOverview.fillForm.description')}
                  </p>
                </StepBody>
              </Step>
              <Step>
                <StepHeading>
                  {t('testingStepsOverview.prepareVPAT.heading')}
                </StepHeading>
                <StepBody>
                  <Trans
                    i18nKey="accessibility:testingStepsOverview.prepareVPAT.fillOutVPAT"
                    className="margin-0"
                  >
                    <Link
                      href="/vpat/link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      vpatFormLink
                    </Link>
                    indexOne
                  </Trans>
                  <p className="margin-bottom-0">
                    {t('testingStepsOverview.prepareVPAT.changesVPAT')}
                  </p>
                </StepBody>
              </Step>
              <Step>
                <StepHeading>
                  {t('testingStepsOverview.testingSession.heading')}
                </StepHeading>
                <StepBody>
                  <p className="margin-0">
                    {t('testingStepsOverview.testingSession.description')}
                  </p>
                </StepBody>
              </Step>
              <Step>
                <StepHeading>
                  {t('testingStepsOverview.results.heading')}
                </StepHeading>
                <StepBody>
                  <p className="margin-0">
                    {t('testingStepsOverview.results.description')}
                  </p>
                  <dl title="508 test scores">
                    <dt className="text-bold margin-bottom-1">
                      {t('testingStepsOverview.results.score.above99.heading')}
                    </dt>
                    <dd className="margin-left-0 margin-bottom-2">
                      {t(
                        'testingStepsOverview.results.score.above99.description'
                      )}
                    </dd>
                    <dt className="text-bold margin-bottom-1">
                      {t(
                        'testingStepsOverview.results.score.interval75.heading'
                      )}
                    </dt>
                    <dd className="margin-left-0 margin-bottom-2">
                      <Trans i18nKey="accessibility:testingStepsOverview.results.score.interval75.description">
                        indexZero
                        <Link
                          href="/external"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          remediationPlan
                        </Link>
                        indexTwo
                      </Trans>
                    </dd>
                    <dt className="text-bold margin-bottom-1">
                      {t('testingStepsOverview.results.score.below75.heading')}
                    </dt>
                    <dd className="margin-left-0">
                      {t(
                        'testingStepsOverview.results.score.below75.description'
                      )}
                    </dd>
                  </dl>
                </StepBody>
              </Step>
            </StepList>
            <CollapsableLink
              id="easi-508-testing-exception"
              label={t('testingStepsOverview.exception.label')}
              styleLeftBar={false}
            >
              <div className="line-height-body-5">
                <p className="margin-top-0">
                  {t('testingStepsOverview.exception.description')}
                </p>
                <ul>
                  {exceptionReasons.map(reason => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
                <p>{t('testingStepsOverview.exception.exceptionFineprint')}</p>
                <p>
                  <Trans i18nKey="accessibility:testingStepsOverview.exception.contact">
                    indexZero
                    <Link href="mailto:CMS_Section508@cms.hhs.gov">email</Link>
                    indexTwo
                  </Trans>
                </p>
              </div>
            </CollapsableLink>
          </div>
        </div>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default AccessibilityTestingStepsOverview;
