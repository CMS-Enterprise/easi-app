import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink
} from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import PrepareForGRTBase from 'components/PrepareForGRT';

const PrepareForGRT = () => {
  const { systemIntakeID } = useParams<{ systemIntakeID: string }>();
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
              to={`/governance-task-list/${systemIntakeID}`}
            >
              <span>{t('taskList:navigation.governanceTaskList')}</span>
            </BreadcrumbLink>
          </Breadcrumb>
          <Breadcrumb current>{t('prepare.breadcrumb')}</Breadcrumb>
        </BreadcrumbBar>
        <PrepareForGRTBase />
        <div className="margin-top-4">
          <Link
            to={`/governance-task-list/${systemIntakeID}`}
            className="text-ink"
          >
            Back
          </Link>
        </div>
      </div>
    </MainContent>
  );
};

export default PrepareForGRT;
