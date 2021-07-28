import React from 'react';
import { Link, Switch, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { SecureRoute } from '@okta/okta-react';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink
} from '@trussworks/react-uswds';
import { DateTime } from 'luxon';

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
import { NotFoundPartial } from 'views/NotFound';

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
      variables: {
        id: systemId
      }
    }
  );
  const systemIntake = data?.systemIntake;

  if (loading) {
    return <PageLoading />;
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
              to={`/governance-task-list/${systemIntake.id || 'new'}`}
            >
              <span>Get governance approval</span>
            </BreadcrumbLink>
          </Breadcrumb>
          <Breadcrumb current>Intake Request</Breadcrumb>
        </BreadcrumbBar>
        {!loading && (
          <Switch>
            <SecureRoute
              path="/system/:systemId/contact-details"
              render={() => <ContactDetails systemIntake={systemIntake} />}
            />
            <SecureRoute
              path="/system/:systemId/request-details"
              render={() => <RequestDetails systemIntake={systemIntake} />}
            />
            <SecureRoute
              path="/system/:systemId/contract-details"
              render={() => <ContractDetails systemIntake={systemIntake} />}
            />
            <SecureRoute
              path="/system/:systemId/review"
              render={() => (
                <Review systemIntake={systemIntake} now={DateTime.local()} />
              )}
            />
            <SecureRoute
              path="/system/:systemId/confirmation"
              render={() => <Confirmation />}
            />
            <SecureRoute
              path="/system/:systemId/view"
              render={() => <SystemIntakeView systemIntake={systemIntake} />}
            />
            <SecureRoute path="*" render={() => <NotFoundPartial />} />
          </Switch>
        )}
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default SystemIntake;
