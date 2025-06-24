import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Route, Switch, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink
} from '@trussworks/react-uswds';
import NotFound, { NotFoundPartial } from 'features/Miscellaneous/NotFound';
import { useGetSystemIntakeQuery } from 'gql/generated/graphql';

import MainContent from 'components/MainContent';
import PageLoading from 'components/PageLoading';

import UploadForm from './Documents/UploadForm';
import Confirmation from './Confirmation';
import ContactDetails from './ContactDetails';
import ContractDetails from './ContractDetails';
import Documents from './Documents';
import RequestDetails from './RequestDetails';
import Review from './Review';
import SystemIntakeView from './ViewOnly';

import './index.scss';

export const SystemIntake = () => {
  const { t } = useTranslation();
  const { systemId, subPage, formPage } = useParams<{
    systemId: string;
    formPage: string;
    subPage: string;
  }>();

  const { loading, data } = useGetSystemIntakeQuery({
    nextFetchPolicy: 'cache-first',
    variables: {
      id: systemId
    }
  });

  const systemIntake = data?.systemIntake;

  const isConfirmationPage =
    formPage === 'confirmation' || formPage === 'confirmation-error';

  if (!loading && !systemIntake) {
    return <NotFound />;
  }

  return (
    <MainContent
      className={`system-intake  margin-bottom-5 ${!isConfirmationPage ? 'grid-container' : ''}`}
      data-testid="system-intake"
    >
      {subPage !== 'upload' && !isConfirmationPage && (
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
          <Breadcrumb current>
            {t('taskList:navigation.intakeRequest')}
          </Breadcrumb>
        </BreadcrumbBar>
      )}
      {loading && <PageLoading />}
      {!loading && !!systemIntake && (
        <Switch>
          <Route
            path="/system/:systemId/contact-details"
            render={() => <ContactDetails systemIntake={systemIntake} />}
          />
          <Route
            path="/system/:systemId/request-details"
            render={() => <RequestDetails systemIntake={systemIntake} />}
          />
          <Route
            path="/system/:systemId/contract-details"
            render={() => <ContractDetails systemIntake={systemIntake} />}
          />
          <Route
            path="/system/:systemId/documents/upload"
            render={() => <UploadForm type="requester" />}
          />
          <Route
            path="/system/:systemId/documents"
            render={() => <Documents systemIntake={systemIntake} />}
          />
          <Route
            path="/system/:systemId/review"
            render={() => <Review systemIntake={systemIntake} />}
          />
          <Route
            path="/system/:systemId/confirmation"
            render={() => <Confirmation submissionSuccess />}
          />
          <Route
            path="/system/:systemId/confirmation-error"
            render={() => <Confirmation submissionSuccess={false} />}
          />
          <Route
            path="/system/:systemId/view"
            render={() => <SystemIntakeView systemIntake={systemIntake} />}
          />
          <Route path="*" render={() => <NotFoundPartial />} />
        </Switch>
      )}
    </MainContent>
  );
};

export default SystemIntake;
