import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Link as UswdsLink,
  ProcessList,
  ProcessListHeading,
  ProcessListItem
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import UswdsReactLink from 'components/LinkWrapper';
import CollapsableLink from 'components/shared/CollapsableLink';
import { ArticleComponentProps } from 'types/articles';

const AccessibilityTestingSteps = ({
  helpArticle,
  className
}: ArticleComponentProps) => {
  const { t } = useTranslation('accessibility');
  const exceptionReasons: string[] = t(
    'testingStepsOverview.exception.reasons',
    {
      returnObjects: true
    }
  );
  return (
    <div
      className={classNames(
        '508-steps-involved tablet:grid-col-6 margin-top-6',
        className
      )}
    >
      <ProcessList>
        <ProcessListItem>
          <ProcessListHeading type="h3">
            {t('testingStepsOverview.fillForm.heading')}
          </ProcessListHeading>
          <p>{t('testingStepsOverview.fillForm.description')}</p>
        </ProcessListItem>
        <ProcessListItem>
          <ProcessListHeading type="h3">
            {t('testingStepsOverview.prepareVPAT.heading')}
          </ProcessListHeading>
          <Trans
            i18nKey="accessibility:testingStepsOverview.prepareVPAT.fillOutVPAT"
            className="margin-0"
          >
            indexZero
            <UswdsReactLink
              to="/508/templates"
              target="_blank"
              rel="noopener noreferrer"
            >
              templatesLink
            </UswdsReactLink>
            indexTwo
          </Trans>
          <p className="margin-bottom-0">
            {t('testingStepsOverview.prepareVPAT.changesVPAT')}
          </p>
        </ProcessListItem>
        <ProcessListItem>
          <ProcessListHeading type="h3">
            {t('testingStepsOverview.testingSession.heading')}
          </ProcessListHeading>
          <p>{t('testingStepsOverview.testingSession.description')}</p>
        </ProcessListItem>
        <ProcessListItem>
          <ProcessListHeading type="h3">
            {t('testingStepsOverview.results.heading')}
          </ProcessListHeading>
          <p>{t('testingStepsOverview.results.description')}</p>
          <dl title="508 test scores">
            <dt className="text-bold margin-bottom-1">
              {t('testingStepsOverview.results.score.above99.heading')}
            </dt>
            <dd className="margin-left-0 margin-bottom-2">
              {t('testingStepsOverview.results.score.above99.description')}
            </dd>
            <dt className="text-bold margin-bottom-1">
              {t('testingStepsOverview.results.score.interval75.heading')}
            </dt>
            <dd className="margin-left-0 margin-bottom-2">
              {t('testingStepsOverview.results.score.interval75.description')}
            </dd>
            <dt className="text-bold margin-bottom-1">
              {t('testingStepsOverview.results.score.below75.heading')}
            </dt>
            <dd className="margin-left-0">
              {t('testingStepsOverview.results.score.below75.description')}
            </dd>
          </dl>
        </ProcessListItem>
      </ProcessList>
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
              <UswdsLink href="mailto:CMS_Section508@cms.hhs.gov">
                email
              </UswdsLink>
              indexTwo
            </Trans>
          </p>
        </div>
      </CollapsableLink>
    </div>
  );
};

export default AccessibilityTestingSteps;
