import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Alert, Link as UswdsLink } from '@trussworks/react-uswds';
import GetAccessibilityRequestsQuery from 'queries/GetAccessibilityRequestsQuery';
import { GetAccessibilityRequests } from 'queries/types/GetAccessibilityRequests';

import AccessibilityRequestsTable from 'components/AccessibilityRequestsTable';
import PageHeading from 'components/PageHeading';
import { NavLink, SecondaryNav } from 'components/shared/SecondaryNav';
import useMessage from 'hooks/useMessage';

const List = () => {
  const { t } = useTranslation('home');
  const { message } = useMessage();

  const { loading, error, data } = useQuery<GetAccessibilityRequests>(
    GetAccessibilityRequestsQuery,
    {
      variables: {
        first: 20
      },
      fetchPolicy: 'cache-and-network'
    }
  );

  if (loading) {
    return <div>Loading</div>;
  }

  if (error) {
    return <div>{JSON.stringify(error)}</div>;
  }

  const requests =
    data &&
    data.accessibilityRequests &&
    data.accessibilityRequests.edges.map(edge => {
      return edge.node;
    });

  return (
    <>
      <SecondaryNav>
        <NavLink to="/">
          {t('accessibility:tabs.accessibilityRequests')}
        </NavLink>
      </SecondaryNav>
      <div className="grid-container">
        {message && (
          <Alert className="margin-top-4" type="success" role="alert">
            {message}
          </Alert>
        )}
        <div className="display-flex flex-justify flex-wrap">
          <PageHeading>{t('accessibility.heading')}</PageHeading>
          <UswdsLink
            asCustom={Link}
            className="usa-button flex-align-self-center"
            variant="unstyled"
            to="/508/requests/new"
          >
            {t('accessibility.newRequest')}
          </UswdsLink>
        </div>
        <AccessibilityRequestsTable requests={requests || []} />
      </div>
    </>
  );
};

export default List;
