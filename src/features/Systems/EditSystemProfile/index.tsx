import React from 'react';
import { Switch, useParams } from 'react-router-dom';
import { SecureRoute } from '@okta/okta-react';
import NotFound from 'features/Miscellaneous/NotFound';
import { useGetCedarSystemQuery } from 'gql/generated/graphql';

import PageLoading from 'components/PageLoading';

import EditSystemProfileHome from './EditSystemProfileHome';
import Team from './Team';

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

      <SecureRoute path="/systems/:systemId/edit/team">
        <Team />
      </SecureRoute>

      <SecureRoute path="*" component={NotFound} />
    </Switch>
  );
};

export default EditSystemProfile;
