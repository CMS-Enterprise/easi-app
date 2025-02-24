import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import MainContent from 'components/MainContent';
import PrepareForGRBBase from 'components/PrepareForGRB';

import './index.scss';

const PrepareForGRB = () => {
  const { systemId } = useParams<{ systemId: string }>();
  const { t } = useTranslation('governanceReviewBoard');
  return (
    <MainContent className="easi-prepare-for-grb margin-bottom-5">
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
        <PrepareForGRBBase />
        <div className="margin-top-4">
          <UswdsReactLink
            to={`/governance-task-list/${systemId}`}
            className="text-ink"
          >
            Back
          </UswdsReactLink>
        </div>
      </div>
    </MainContent>
  );
};

export default PrepareForGRB;
