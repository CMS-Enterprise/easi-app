import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  IconArrowForward,
  IconError,
  Link as UswdsLink,
  SummaryBox
} from '@trussworks/react-uswds';
import classNames from 'classnames';

import RemediationPlanDoc from 'assets/files/CMS508RemediationPlanTemplate.pdf';
import TestPlanDoc from 'assets/files/Section508TestPlanTemplate.pdf';
import HelpPageIntro from 'components/HelpPageIntro';
import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import Divider from 'components/shared/Divider';
import { ArticleComponentProps } from 'types/articles';

import './index.scss';

export default ({ helpArticle, className }: ArticleComponentProps) => {
  const { t } = useTranslation(['accessibility', 'templatesFor508Testing']);

  const vpatConformanceLevels: { name: string; description: string }[] = t(
    'testingTemplates.vpatSection.subSection.item1.levels',
    {
      returnObjects: true
    }
  );
  const testPlanList: string[] = t(
    'testingTemplates.testPlanSection.itemsToProvide',
    {
      returnObjects: true
    }
  );

  const remediationPlanList: string[] = t(
    'testingTemplates.remediationPlanSection.itemsToProvide',
    {
      returnObjects: true
    }
  );

  return (
    <div className={classNames('templates-for-508-testing', className)}>
      {!helpArticle ? (
        <PageHeading className="line-height-heading-2">
          {t('testingTemplates.heading')}
        </PageHeading>
      ) : (
        <HelpPageIntro
          type="Section 508"
          heading={t('testingTemplates.heading')}
          subheading={t('templatesFor508Testing:description')}
        />
      )}
      <div className="margin-bottom-6 padding-2 bg-base-lightest">
        <h3>{t('templatesFor508Testing:pageContents')}</h3>
        <ul className="usa-list usa-list--unstyled">
          <li className="margin-bottom-1">
            <UswdsLink href="#vpat">
              {t('testingTemplates.vpatSection.heading')}
              <IconArrowForward />
            </UswdsLink>
          </li>
          <li className="margin-bottom-1">
            <UswdsLink href="#test-plan">
              {t('testingTemplates.testPlanSection.heading')}
              <IconArrowForward />
            </UswdsLink>
          </li>
          <li>
            <UswdsLink href="#remediation-plan">
              {t('testingTemplates.remediationPlanSection.heading')}
              <IconArrowForward />
            </UswdsLink>
          </li>
        </ul>
      </div>
      <div className="templates-for-508-testing__section">
        <h2 id="vpat" className="margin-bottom-2">
          {t('testingTemplates.vpatSection.heading')}
        </h2>
        <p className="margin-bottom-4">
          {t('testingTemplates.vpatSection.description')}
        </p>
        <h3 className="margin-bottom-2">
          {t('testingTemplates.vpatSection.subSection.heading')}
        </h3>
        <p className="margin-bottom-1">
          {t('testingTemplates.vpatSection.subSection.item1.text')}
        </p>
        <ul className="usa-list usa-list--unstyled desktop:grid-col-8">
          {vpatConformanceLevels.map(level => (
            <li key={level.name} className="maxw-none margin-bottom-1">
              <span className="text-bold display-inline">{level.name}</span>{' '}
              {level.description}
            </li>
          ))}
        </ul>
        <p className="margin-bottom-4">
          {t('testingTemplates.vpatSection.subSection.item2.text')}
        </p>
        <SummaryBox
          heading={t(
            'testingTemplates.vpatSection.subSection.downloadVPAT.heading'
          )}
          className="desktop:grid-col-6 margin-bottom-6"
        >
          <p>
            <UswdsReactLink
              to="https://www.itic.org/policy/accessibility/vpat"
              target="_blank"
              rel="noopener noreferrer"
              variant="external"
            >
              {t(
                'testingTemplates.vpatSection.subSection.downloadVPAT.line1.linkText'
              )}
            </UswdsReactLink>
            {` `}
            {t(
              'testingTemplates.vpatSection.subSection.downloadVPAT.line1.otherText'
            )}
          </p>
          <p className="display-flex flex-row flex-align-center">
            <IconError className="margin-right-1" />
            {` `}
            {t(
              'testingTemplates.vpatSection.subSection.downloadVPAT.line2.text'
            )}
          </p>
          <p>
            <UswdsReactLink
              to="https://www.youtube.com/watch?v=kAkSV9xiJ1A"
              target="_blank"
              rel="noopener noreferrer"
              variant="external"
            >
              {t(
                'testingTemplates.vpatSection.subSection.downloadVPAT.line3.linkText'
              )}
            </UswdsReactLink>
          </p>
        </SummaryBox>
        <Divider className="margin-bottom-4" />
      </div>
      <div className="templates-for-508-testing__section">
        <h2 id="test-plan" className="margin-bottom-2">
          {t('testingTemplates.testPlanSection.heading')}
        </h2>
        <p className="margin-bottom-2 line-height-sans-5 desktop:grid-col-9">
          {t('testingTemplates.testPlanSection.description')}
        </p>
        <ul className="usa-list usa-list--unstyled desktop:grid-col-8">
          {testPlanList.map(item => (
            <li key={item} className="maxw-none margin-bottom-1">
              {item}
            </li>
          ))}
        </ul>
        <SummaryBox
          heading={t('testingTemplates.testPlanSection.download.heading')}
          className="desktop:grid-col-6 margin-bottom-6"
        >
          <UswdsReactLink to={TestPlanDoc} target="_blank" variant="external">
            {t('testingTemplates.testPlanSection.download.link')}
          </UswdsReactLink>
        </SummaryBox>
        <Divider className="margin-bottom-4" />
      </div>
      <div className="templates-for-508-testing__section">
        <h2 id="remediation-plan" className="margin-bottom-2">
          {t('testingTemplates.remediationPlanSection.heading')}
        </h2>
        <p className="margin-bottom-2 line-height-sans-5 desktop:grid-col-9">
          {t('testingTemplates.remediationPlanSection.description')}
        </p>
        <ul className="usa-list usa-list--unstyled desktop:grid-col-8">
          {remediationPlanList.map(item => (
            <li key={item} className="maxw-none margin-bottom-1">
              {item}
            </li>
          ))}
        </ul>
        <SummaryBox
          heading={t(
            'testingTemplates.remediationPlanSection.download.heading'
          )}
          className="desktop:grid-col-6 margin-bottom-6"
        >
          <UswdsReactLink
            to={RemediationPlanDoc}
            target="_blank"
            variant="external"
          >
            {t('testingTemplates.testPlanSection.download.link')}
          </UswdsReactLink>
        </SummaryBox>
      </div>
    </div>
  );
};
