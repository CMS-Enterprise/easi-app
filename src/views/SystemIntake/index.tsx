import React from 'react';
import { Link, Route, Switch, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink
} from '@trussworks/react-uswds';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageLoading from 'components/PageLoading';
import PageWrapper from 'components/PageWrapper';
import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';
import {
  GetSystemIntake,
  GetSystemIntakeVariables
} from 'queries/types/GetSystemIntake';
import NotFound, { NotFoundPartial } from 'views/NotFound';

import Confirmation from './Confirmation';
import ContactDetails from './ContactDetails';
import ContractDetails from './ContractDetails';
import RequestDetails from './RequestDetails';
import Review from './Review';
import SystemIntakeView from './ViewOnly';

import './index.scss';

export const SystemIntake = () => {
  const { systemId } = useParams<{
    systemId: string;
    formPage: string;
  }>();

  const { loading, data } = useQuery<GetSystemIntake, GetSystemIntakeVariables>(
    GetSystemIntakeQuery,
    {
      nextFetchPolicy: 'cache-first',
      variables: {
        id: systemId
      }
    }
  );

  const systemIntake = data?.systemIntake;

  if (!loading && !systemIntake) {
    return <NotFound />;
  }

  return (
    <PageWrapper className="system-intake" data-testid="system-intake">
      <Header />
      <MainContent className="grid-container margin-bottom-5">
        <BreadcrumbBar variant="wrap">
          <Breadcrumb>
            <BreadcrumbLink asCustom={Link} to="/">
              <span>Home</span>
            </BreadcrumbLink>
          </Breadcrumb>
          <Breadcrumb>
            <BreadcrumbLink
              asCustom={Link}
              to={`/governance-task-list/${systemId}`}
            >
              <span>Get governance approval</span>
            </BreadcrumbLink>
          </Breadcrumb>
          <Breadcrumb current>Intake Request</Breadcrumb>
        </BreadcrumbBar>
        {loading && <PageLoading />}
        {!!systemIntake && (
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
      <Footer />
    </PageWrapper>
  );
};

export default SystemIntake;
