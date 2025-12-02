import React from 'react';
import { Redirect, Route, Switch, useParams } from 'react-router-dom';
import NotFound from 'features/Miscellaneous/NotFound';
import { useGetCedarSystemQuery } from 'gql/generated/graphql';

import PageLoading from 'components/PageLoading';
import { convertToNewFormat, isOldFormat } from 'utils/cedarSystems';

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

export const EditSystemProfileWrapper = () => {
  const { systemId } = useParams<{ systemId: string }>();

  if (isOldFormat(systemId)) {
    return <Redirect to={`/systems/${convertToNewFormat(systemId)}/edit`} />;
  }

  return <EditSystemProfile />;
};

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
    <Switch>
      <Route exact path="/systems/:systemId/edit">
        <EditSystemProfileHome systemId={systemId} systemName={systemName} />
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

      <Route path="/systems/:systemId/edit/team">
        <Team />
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

      <Route path="*" component={NotFound} />
    </Switch>
  );
};

export default EditSystemProfile;
