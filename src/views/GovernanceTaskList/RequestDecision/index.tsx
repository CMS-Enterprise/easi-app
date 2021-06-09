import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
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
import PageWrapper from 'components/PageWrapper';
import { AppState } from 'reducers/rootReducer';
import { fetchSystemIntake } from 'types/routines';

import Approved from './Approved';
import Rejected from './Rejected';

import './index.scss';

const RequestDecision = () => {
  const dispatch = useDispatch();
  const systemIntake = useSelector(
    (state: AppState) => state.systemIntake.systemIntake
  );

  const { systemId } = useParams<{ systemId: string }>();

  useEffect(() => {
    dispatch(fetchSystemIntake(systemId));
  }, [dispatch, systemId]);

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
        <div className="grid-row">
          <div className="tablet:grid-col-9">
            <PageHeading>Decision and next steps</PageHeading>
            {systemIntake.status === 'LCID_ISSUED' && (
              <Approved intake={systemIntake} />
            )}
            {systemIntake.status === 'NOT_APPROVED' && (
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
                <UswdsLink href="mailto:ITgovernance@cms.hhs.gov">
                  ITgovernance@cms.hhs.gov
                </UswdsLink>
              </p>
            </div>
          </div>
        </div>
      </MainContent>
      <Footer />
    </PageWrapper>
  );
};

export default RequestDecision;
