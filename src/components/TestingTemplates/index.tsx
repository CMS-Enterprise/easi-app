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
      {!helpArticle && (
        <PageHeading className="line-height-heading-2">
          {t('testingTemplates.heading')}
        </PageHeading>
      )}
      <div className="margin-bottom-6 padding-2 bg-base-lightest">
        <h3 className="margin-top-0 margin-bottom-2">
          {t('templatesFor508Testing:pageContents')}
        </h3>
        <ul className="usa-list usa-list--unstyled">
          <li className="margin-bottom-1">
            <UswdsLink href="#vpat">
              <span className="display-flex flex-align-center">
                {t('testingTemplates.vpatSection.heading')}
                <IconArrowForward className="margin-left-1" />
              </span>
            </UswdsLink>
          </li>
          <li className="margin-bottom-1">
            <UswdsLink href="#test-plan">
              <span className="display-flex flex-align-center">
                {t('testingTemplates.testPlanSection.heading')}
                <IconArrowForward className="margin-left-1" />
              </span>
            </UswdsLink>
          </li>
          <li className="">
            <UswdsLink href="#remediation-plan">
              <span className="display-flex flex-align-center">
                {t('testingTemplates.remediationPlanSection.heading')}
                <IconArrowForward className="margin-left-1" />
              </span>
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
            <li
              key={level.name}
              className="maxw-none margin-bottom-1  padding-left-2"
            >
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
        <ul className="usa-list desktop:grid-col-8 margin-bottom-4">
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
        <ul className="usa-list desktop:grid-col-8 margin-bottom-4">
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
          className="desktop:grid-col-6"
        >
          <UswdsReactLink
            to={RemediationPlanDoc}
            target="_blank"
            variant="external"
          >
            {t('testingTemplates.testPlanSection.download.link')}
          </UswdsReactLink>
        </SummaryBox>
        {!helpArticle && <Divider className="margin-bottom-4" />}
      </div>
    </div>
  );
};
