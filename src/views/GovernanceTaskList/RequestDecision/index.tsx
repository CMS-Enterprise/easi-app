import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink,
  Link as UswdsLink
} from '@trussworks/react-uswds';

import Footer from 'components/Footer';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import PageWrapper from 'components/PageWrapper';
import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';
import {
  GetSystemIntake,
  GetSystemIntakeVariables
} from 'queries/types/GetSystemIntake';

import Approved from './Approved';
import Rejected from './Rejected';

import './index.scss';

const RequestDecision = () => {
  const { systemId } = useParams<{ systemId: string }>();

  const { loading, data } = useQuery<GetSystemIntake, GetSystemIntakeVariables>(
    GetSystemIntakeQuery,
    {
      variables: {
        id: systemId
      }
    }
  );

  const systemIntake = data?.systemIntake;

  return (
    <PageWrapper className="governance-task-list">
      <Header />
      <MainContent className="grid-container margin-bottom-7">
        <div className="grid-row">
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
            <Breadcrumb current>Decision and next steps</Breadcrumb>
          </BreadcrumbBar>
        </div>
        {loading && <PageLoading />}

        {data?.systemIntake && (
          <div className="grid-row">
            <div className="tablet:grid-col-9">
              <PageHeading>Decision and next steps</PageHeading>
              {systemIntake?.status === 'LCID_ISSUED' && (
                <Approved intake={systemIntake} />
              )}
              {systemIntake?.status === 'NOT_APPROVED' && (
                <Rejected intake={systemIntake} />
              )}
            </div>
            <div className="tablet:grid-col-1" />
            <div className="tablet:grid-col-2">
              <div className="sidebar margin-top-4">
                <h3 className="font-sans-sm">
                  Need help? Contact the Governance team
                </h3>
                <p>
                  <UswdsLink href="mailto:IT_Governance@cms.hhs.gov">
                    IT_Governance@cms.hhs.gov
                  </UswdsLink>
                </p>
              </div>
            </div>
          </div>
        )}
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default RequestDecision;
