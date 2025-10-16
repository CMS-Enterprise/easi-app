import React from 'react';
import { Switch, useParams } from 'react-router-dom';
import { SecureRoute } from '@okta/okta-react';
import NotFound from 'features/Miscellaneous/NotFound';
import { useGetCedarSystemQuery } from 'gql/generated/graphql';

import PageLoading from 'components/PageLoading';

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
    <Switch>
      <SecureRoute exact path="/systems/:systemId/edit">
        <EditSystemProfileHome systemId={systemId} systemName={systemName} />
      </SecureRoute>

      <SecureRoute path="/systems/:systemId/edit/business-information">
        <BusinessInformation />
      </SecureRoute>

      <SecureRoute path="/systems/:systemId/edit/implementation-details">
        <ImplementationDetails />
      </SecureRoute>

      <SecureRoute path="/systems/:systemId/edit/data">
        <Data />
      </SecureRoute>

      <SecureRoute path="/systems/:systemId/edit/tools-and-software">
        <ToolsAndSoftware />
      </SecureRoute>

      <SecureRoute path="/systems/:systemId/edit/sub-systems">
        <SubSystems />
      </SecureRoute>

      <SecureRoute path="/systems/:systemId/edit/team">
        <Team />
      </SecureRoute>

      <SecureRoute path="/systems/:systemId/edit/contracts">
        <Contracts />
      </SecureRoute>

      <SecureRoute path="/systems/:systemId/edit/funding-and-budget">
        <FundingAndBudget />
      </SecureRoute>

      <SecureRoute path="/systems/:systemId/edit/ato-and-security">
        <AtoAndSecurity />
      </SecureRoute>

      <SecureRoute path="*" component={NotFound} />
    </Switch>
  );
};

export default EditSystemProfile;
