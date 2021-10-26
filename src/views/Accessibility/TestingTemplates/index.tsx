import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Link as UswdsLink,
  SummaryBox
} from '@trussworks/react-uswds';

import RemediationPlanDoc from 'assets/files/CMS508RemediationPlanTemplate.pdf';
import TestPlanDoc from 'assets/files/Section508TestPlanTemplate.pdf';
import PageHeading from 'components/PageHeading';

import './index.scss';

const TestingTemplates = () => {
  const { t } = useTranslation('accessibility');
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

  const tableOfContents = (
    <div className="accessibility-testing-templates">
      <p className="margin-bottom-1">Page contents</p>
      <ul className="accessibility-testing-templates__table-of-contents">
        <li>
          <UswdsLink href="#vpat">
            {t('testingTemplates.vpatSection.heading')}
          </UswdsLink>
        </li>
        <li>
          <UswdsLink href="#test-plan">
            {t('testingTemplates.testPlanSection.heading')}
          </UswdsLink>
        </li>
        <li>
          <UswdsLink href="#remediation-plan">
            {t('testingTemplates.remediationPlanSection.heading')}
          </UswdsLink>
        </li>
      </ul>
    </div>
  );

  const testPlanSection = (
    <div>
      <h2 id="test-plan">{t('testingTemplates.testPlanSection.heading')}</h2>
      <p>{t('testingTemplates.testPlanSection.description')}</p>
      <ul className="accessibility-testing-templates__test-plan-list">
        {testPlanList.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <SummaryBox
        heading={t('testingTemplates.testPlanSection.download.heading')}
      >
        <UswdsLink href={TestPlanDoc} target="_blank">
          {t('testingTemplates.testPlanSection.download.link')}
        </UswdsLink>
      </SummaryBox>
    </div>
  );

  const remediationPlanSection = (
    <div>
      <h2 id="remediation-plan">
        {t('testingTemplates.remediationPlanSection.heading')}
      </h2>
      <p>{t('testingTemplates.remediationPlanSection.description')}</p>
      <ul className="accessibility-testing-templates__remediation-plan-list">
        {remediationPlanList.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <SummaryBox
        heading={t('testingTemplates.remediationPlanSection.download.heading')}
      >
        <UswdsLink href={RemediationPlanDoc} target="_blank">
          {t('testingTemplates.remediationPlanSection.download.link')}
        </UswdsLink>
      </SummaryBox>
    </div>
  );

  const downloadVPAT = (
    <SummaryBox
      heading={t(
        'testingTemplates.vpatSection.subSection.downloadVPAT.heading'
      )}
    >
      <p>
        <UswdsLink
          href="https://www.itic.org/policy/accessibility/vpat"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t(
            'testingTemplates.vpatSection.subSection.downloadVPAT.line1.linkText'
          )}
        </UswdsLink>
        {` `}
        {t(
          'testingTemplates.vpatSection.subSection.downloadVPAT.line1.otherText'
        )}
      </p>
      <p className="display-flex flex-row flex-align-center accessibility-testing-templates__alert-note">
        <i className="fa fa-exclamation-circle margin-right-1" />
        {` `}
        {t('testingTemplates.vpatSection.subSection.downloadVPAT.line2.text')}
      </p>
      <p>
        <UswdsLink
          href="https://www.youtube.com/watch?v=kAkSV9xiJ1A"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t(
            'testingTemplates.vpatSection.subSection.downloadVPAT.line3.linkText'
          )}
        </UswdsLink>
      </p>
    </SummaryBox>
  );

  const vpatSection = (
    <div>
      <h2 id="vpat">{t('testingTemplates.vpatSection.heading')}</h2>
      <p>{t('testingTemplates.vpatSection.description')}</p>
      <h3>{t('testingTemplates.vpatSection.subSection.heading')}</h3>
      <ul className="accessibility-testing-templates__vpat-list">
        <li>
          {t('testingTemplates.vpatSection.subSection.item1.text')}
          <div className="padding-left-2">
            <dl title="Conformance levels">
              {vpatConformanceLevels.map(level => (
                <div key={level.name}>
                  <dt className="text-bold display-inline">{level.name}</dt>{' '}
                  <dd className="margin-left-0 display-inline">
                    {level.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </li>
        <li>{t('testingTemplates.vpatSection.subSection.item2.text')}</li>
      </ul>
      {downloadVPAT}
    </div>
  );

  return (
    <div className="grid-container accessibility-testing-templates">
      <BreadcrumbBar variant="wrap">
        <Breadcrumb>
          <BreadcrumbLink asCustom={Link} to="/">
            <span>Home</span>
          </BreadcrumbLink>
        </Breadcrumb>
        <Breadcrumb current>Templates for 508 testing</Breadcrumb>
      </BreadcrumbBar>

      <div className="grid-row grid-gap-lg margin-top-6">
        <div className="grid-col-9 line-height-body-4">
          <div className="tablet:grid-col-10">
            <PageHeading className="margin-top-0">
              {t('testingTemplates.heading')}
            </PageHeading>
            {tableOfContents}
            {vpatSection}
            {testPlanSection}
            {remediationPlanSection}
          </div>
        </div>
        <div className="grid-col-3 accessibility-testing-templates__sidebar">
          <div>
            <h4>Need help? Contact the Section 508 team</h4>
            <UswdsLink href="mailto:CMS_Section508@cms.hhs.gov">
              CMS_Section508@cms.hhs.gov
            </UswdsLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestingTemplates;
