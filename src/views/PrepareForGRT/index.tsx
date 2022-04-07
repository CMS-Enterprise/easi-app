import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Link as USWDSLink
} from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import SharedPrepareForGRT from 'components/PrepareForGRT';

import './index.scss';

const sidebar = (
  <div className="sidebar margin-top-4">
    <h3 className="font-sans-sm">Need help? Contact the Governance team</h3>
    <p>
      <USWDSLink href="mailto:IT_Governance@cms.hhs.gov">
        IT_Governance@cms.hhs.gov
      </USWDSLink>
    </p>
  </div>
);

const PrepareForGRT = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const { t } = useTranslation('governanceReviewTeam');
  return (
    <MainContent className="easi-prepare-for-grt margin-bottom-5">
      <div className="grid-container">
        <BreadcrumbBar variant="wrap">
          <Breadcrumb>
            <BreadcrumbLink asCustom={Link} to="/">
              <span>{t('taskList:navigation.home')}</span>
            </BreadcrumbLink>
          </Breadcrumb>
          <Breadcrumb>
            <BreadcrumbLink
              asCustom={Link}
              to={`/governance-task-list/${systemId}`}
            >
              <span>{t('taskList:navigation.governanceTaskList')}</span>
            </BreadcrumbLink>
          </Breadcrumb>
          <Breadcrumb current>{t('prepare.breadcrumb')}</Breadcrumb>
        </BreadcrumbBar>
      </div>
      <SharedPrepareForGRT sidebar={sidebar} />
      <div className="grid-container">
        <Link to={`/governance-task-list/${systemId}`} className="text-ink">
          Back
        </Link>
      </div>
    </MainContent>
  );
};

export default PrepareForGRT;
