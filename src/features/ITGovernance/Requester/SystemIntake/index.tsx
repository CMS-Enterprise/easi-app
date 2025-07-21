import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, Route, Switch, useParams } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink
} from '@trussworks/react-uswds';
import DocumentUploadForm from 'features/ITGovernance/_components/DocumentUploadForm';
import NotFound, { NotFoundPartial } from 'features/Miscellaneous/NotFound';
import { useGetSystemIntakeQuery } from 'gql/generated/graphql';

import MainContent from 'components/MainContent';
import PageLoading from 'components/PageLoading';

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
  const { systemId, subPage } = useParams<{
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

  if (!loading && !systemIntake) {
    return <NotFound />;
  }

  return (
    <MainContent
      className="system-intake grid-container margin-bottom-5"
      data-testid="system-intake"
    >
      {subPage !== 'upload' && (
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
          <Breadcrumb current>Intake Request</Breadcrumb>
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
            render={() => <DocumentUploadForm type="requester" />}
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
            render={() => <Confirmation />}
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
