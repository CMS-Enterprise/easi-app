import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Alert, Link as UswdsLink } from '@trussworks/react-uswds';
import axios from 'axios';
import { useFlags } from 'launchdarkly-react-client-sdk';

import AccessibilityRequestsTable from 'components/AccessibilityRequestsTable';
import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import { NavLink, SecondaryNav } from 'components/shared/SecondaryNav';
import useMessage from 'hooks/useMessage';
import GetAccessibilityRequestsQuery from 'queries/GetAccessibilityRequestsQuery';
import { GetAccessibilityRequests } from 'queries/types/GetAccessibilityRequests';
import { AppState } from 'reducers/rootReducer';
import { downloadBlob } from 'utils/downloadFile';
import user from 'utils/user';

const List = () => {
  const { t } = useTranslation('home');
  const { message } = useMessage();
  const userGroups = useSelector((state: AppState) => state.auth.groups);
  const flags = useFlags();
  const isAccessibilityAdmin = user.isAccessibilityAdmin(userGroups, flags);

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
    return <PageLoading />;
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

  function fetchCSV() {
    axios
      .request({
        url: `${process.env.REACT_APP_API_ADDRESS}/metrics/508`,
        responseType: 'blob',
        method: 'GET'
      })
      .then(response => {
        const blob = new Blob([response.data], { type: 'application/csv' });
        downloadBlob('EASiAccessibilityMetrics.csv', blob);
      })
      .catch(e => {
        // TODO add error handling: display a modal if things fail?
        console.error(e); // eslint-disable-line
      });
  }

  return (
    <>
      <SecondaryNav>
        <NavLink to="/">
          {t('accessibility:tabs.accessibilityRequests')}
        </NavLink>
      </SecondaryNav>
      <div
        className="grid-container"
        data-testid="accessibility-request-list-page"
      >
        {message && (
          <Alert className="margin-top-4" type="success" role="alert">
            {message}
          </Alert>
        )}
        <div className="display-flex flex-justify flex-wrap">
          <PageHeading>{t('accessibility.heading')}</PageHeading>
          <div className="flex-align-self-center">
            <button
              className="usa-button usa-button--unstyled easi-no-print display-block margin-bottom-3"
              type="button"
              onClick={fetchCSV}
            >
              <i className="fa fa-download" />
              &nbsp;{' '}
              <span className="text-underline">
                Download all requests as excel file
              </span>
            </button>
            {!isAccessibilityAdmin && (
              <UswdsLink
                asCustom={Link}
                className="usa-button display-block float-right"
                variant="unstyled"
                to="/508/making-a-request"
              >
                {t('accessibility.newRequest')}
              </UswdsLink>
            )}
          </div>
        </div>
        <AccessibilityRequestsTable requests={requests || []} />
      </div>
    </>
  );
};

export default List;
