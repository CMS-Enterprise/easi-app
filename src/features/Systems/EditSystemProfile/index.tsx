import React from 'react';
import {
  matchPath,
  Route,
  Switch,
  useLocation,
  useParams
} from 'react-router-dom';
import NotFound from 'features/Miscellaneous/NotFound';
import {
  useGetCedarSystemQuery,
  useGetSystemWorkspaceQuery
} from 'gql/generated/graphql';

import PageLoading from 'components/PageLoading';
import SystemSectionLockContextProvider from 'contexts/SystemSectionLockContext';

import SystemIDWrapper from '../Wrapper/SystemIDWrapper';

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
  const { pathname } = useLocation();

  const workspaceTeamPathMatch = matchPath(pathname, {
    path: '/systems/:systemId/edit/team/:action(team-member)?',
    exact: true
  });
  const isWorkspaceTeamRoute = !!workspaceTeamPathMatch;

  const {
    data: cedarSystemData,
    loading: cedarSystemLoading,
    error: cedarSystemError
  } = useGetCedarSystemQuery({
    variables: {
      id: systemId
    },
    skip: isWorkspaceTeamRoute
  });

  const {
    data: cedarSystemWorkspaceData,
    loading: cedarSystemWorkspaceLoading,
    error: cedarSystemWorkspaceError
  } = useGetSystemWorkspaceQuery({
    variables: {
      cedarSystemId: systemId
    },
    skip: !isWorkspaceTeamRoute
  });

  if (cedarSystemLoading || cedarSystemWorkspaceLoading) {
    return <PageLoading />;
  }

  const cedarSystemWorkspace = cedarSystemWorkspaceData?.cedarSystemWorkspace;

  if (isWorkspaceTeamRoute) {
    if (
      cedarSystemWorkspaceError ||
      !cedarSystemWorkspace?.cedarSystem ||
      !cedarSystemWorkspace.isMySystem
    ) {
      return <NotFound />;
    }
  } else if (cedarSystemError || !cedarSystemData?.cedarSystem) {
    return <NotFound />;
  }

  const systemName = isWorkspaceTeamRoute
    ? cedarSystemWorkspace?.cedarSystem?.name || ''
    : cedarSystemData?.cedarSystem?.name || '';

  return (
    <SystemSectionLockContextProvider>
      <SystemProfileLockWrapper>
        <Route
          path="/systems/:systemId"
          render={() => (
            <SystemIDWrapper>
              <Switch>
                <Route exact path="/systems/:systemId/edit">
                  <EditSystemProfileHome
                    systemId={systemId}
                    systemName={systemName}
                  />
                </Route>

                <Route path="/systems/:systemId/edit/business-information">
                  <BusinessInformation />
                </Route>

                <Route path="/systems/:systemId/edit/implementation-details">
                  <ImplementationDetails />
                </Route>

                <Route path="/systems/:systemId/edit/data">
                  <Data />
                </Route>

                <Route path="/systems/:systemId/edit/tools-and-software">
                  <ToolsAndSoftware />
                </Route>

                <Route path="/systems/:systemId/edit/sub-systems">
                  <SubSystems />
                </Route>

                <Route path="/systems/:systemId/edit/team/:action(team-member)?">
                  <Team
                    systemName={systemName}
                    roles={cedarSystemWorkspace?.roles || []}
                  />
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
            </SystemIDWrapper>
          )}
        />
      </SystemProfileLockWrapper>
    </SystemSectionLockContextProvider>
  );
};

export default EditSystemProfile;
