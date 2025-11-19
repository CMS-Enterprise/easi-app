import React from 'react';
import { Route, Switch, useParams } from 'react-router-dom';
import NotFound from 'features/Miscellaneous/NotFound';
import { useGetCedarSystemQuery } from 'gql/generated/graphql';

import PageLoading from 'components/PageLoading';
import SystemSectionLockContextProvider from 'contexts/SystemSectionLockContext';

import LockedSystemProfileSection from './_components/LockedSystemProfileSection';
import SystemProfileLockWrapper from './_components/SystemProfileLockWrapper';
import AtoAndSecurity from './AtoAndSecurity';
import BusinessInformation from './BusinessInformation';
import Contracts from './Contracts';
import Data from './Data';
import EditSystemProfileHome from './EditSystemProfileHome';
import FundingAndBudget from './FundingAndBudget';
import ImplementationDetails from './ImplementationDetails';
import SubSystems from './SubSystems';
import Team from './Team';
import ToolsAndSoftware from './ToolsAndSoftware';

/**
 * Index file with routes for editable system profile.
 */
const EditSystemProfile = () => {
  const { systemId } = useParams<{
    systemId: string;
  }>();

  const { data, loading } = useGetCedarSystemQuery({
    variables: {
      id: systemId
    }
  });

  if (!data) return <NotFound />;

  if (loading) return <PageLoading />;

  const { name: systemName = '' } = data.cedarSystem || {};

  return (
    <SystemSectionLockContextProvider>
      <Switch>
        <Route exact path="/systems/:systemId/edit">
          <EditSystemProfileHome systemId={systemId} systemName={systemName} />
        </Route>

        <Route path="/systems/:systemId/edit/business-information">
          <SystemProfileLockWrapper>
            <BusinessInformation />
          </SystemProfileLockWrapper>
        </Route>

        <Route path="/systems/:systemId/edit/implementation-details">
          <SystemProfileLockWrapper>
            <ImplementationDetails />
          </SystemProfileLockWrapper>
        </Route>

        <Route path="/systems/:systemId/edit/data">
          <SystemProfileLockWrapper>
            <Data />
          </SystemProfileLockWrapper>
        </Route>

        <Route path="/systems/:systemId/edit/tools-and-software">
          <SystemProfileLockWrapper>
            <ToolsAndSoftware />
          </SystemProfileLockWrapper>
        </Route>

        <Route path="/systems/:systemId/edit/sub-systems">
          <SystemProfileLockWrapper>
            <SubSystems />
          </SystemProfileLockWrapper>
        </Route>

        <Route path="/systems/:systemId/edit/team">
          <SystemProfileLockWrapper>
            <Team />
          </SystemProfileLockWrapper>
        </Route>

        <Route path="/systems/:systemId/edit/contracts">
          <Contracts />
        </Route>

        <Route path="/systems/:systemId/edit/funding-and-budget">
          <FundingAndBudget />
        </Route>

        <Route path="/systems/:systemId/edit/ato-and-security">
          <AtoAndSecurity />
        </Route>

        <Route path="/systems/:systemId/edit/locked">
          <LockedSystemProfileSection />
        </Route>

        <Route path="*" component={NotFound} />
      </Switch>
    </SystemSectionLockContextProvider>
  );
};

export default EditSystemProfile;
