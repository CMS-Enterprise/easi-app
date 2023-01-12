import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, Route, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { Grid, GridContainer, IconArrowBack } from '@trussworks/react-uswds';
import classNames from 'classnames';

import PageLoading from 'components/PageLoading';
import GetTrbRequestQuery from 'queries/GetTrbRequestQuery';
import {
  GetTrbRequest,
  GetTrbRequestVariables
} from 'queries/types/GetTrbRequest';
import { AppState } from 'reducers/rootReducer';
import user from 'utils/user';
import AccordionNavigation from 'views/GovernanceReviewTeam/AccordionNavigation';
import NotFound from 'views/NotFound';

import subNavItems from './subNavItems';
import Summary from './Summary';

import './index.scss';

const SideNavigation = ({
  activePage,
  trbRequestId
}: {
  activePage: string;
  trbRequestId: string;
}) => {
  const { t } = useTranslation('technicalAssistance');
  return (
    <nav>
      <ul className="trb-admin__nav-list usa-list usa-list--unstyled">
        <li className="margin-bottom-4">
          <Link to="/" className="display-flex flex-align-center">
            <IconArrowBack className="margin-right-1" aria-hidden />
            {t('adminHome.subnav.back')}
          </Link>
        </li>
        {subNavItems(trbRequestId).map(({ route, text, groupEnd }) => {
          const isActivePage: boolean = route.split('/')[3] === activePage;
          return (
            <li
              key={text}
              className={classNames(
                'padding-y-1',
                'trb-admin__nav-link',
                'hover:bg-base-lightest',
                {
                  'trb-admin__nav-link--active': isActivePage,
                  'border-bottom-1px border-disabled-light': groupEnd
                }
              )}
            >
              <Link
                to={route}
                className={classNames('text-no-underline', 'padding-y-05', {
                  'text-base-darkest': !isActivePage,
                  'text-primary': isActivePage
                })}
              >
                {t(text)}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default function TrbAdminHome() {
  /** Current user groups */
  const userGroups = useSelector((state: AppState) => state.auth.groups);
  /** Whether or not current user is set */
  const isUserSet = useSelector((state: AppState) => state.auth.isUserSet);

  // Get url params
  const { id, activePage } = useParams<{
    id: string;
    activePage: string;
  }>();

  // TRB request query
  const { data, loading } = useQuery<GetTrbRequest, GetTrbRequestVariables>(
    GetTrbRequestQuery,
    {
      variables: { id }
    }
  );
  /** Current trb request */
  const trbRequest = data?.trbRequest;

  // If loading or no trb request, return page not found
  if (!loading && !trbRequest) {
    return <NotFound />;
  }

  // Check if current user is set
  if (isUserSet) {
    // Check if current user is TRB Admin
    if (user.isTrbAdmin(userGroups)) {
      return (
        <div className="trb-admin" id="trbAdminHome">
          {
            // TRB request loading
            loading && <PageLoading />
          }
          {
            // TRB admin home view
            !loading && !!trbRequest && (
              <>
                <Summary
                  trbRequestId={id}
                  name={trbRequest.name}
                  requestType={trbRequest.type}
                  createdAt={trbRequest.createdAt}
                  createdBy={trbRequest.createdBy}
                  status={trbRequest.status}
                  taskStatuses={trbRequest.taskStatuses}
                  trbLead={trbRequest.trbLead}
                />
                <AccordionNavigation
                  activePage={activePage}
                  subNavItems={subNavItems(id).map(
                    ({ route, text, groupEnd }) => ({
                      route,
                      text,
                      groupEnd
                    })
                  )}
                  defaultTitle="TRB Request"
                />
                <GridContainer>
                  <Grid row className="margin-y-5 grid-gap">
                    <Grid
                      col
                      desktop={{ col: 3 }}
                      className="display-none tablet:display-block"
                    >
                      <SideNavigation
                        activePage={activePage}
                        trbRequestId={id}
                      />
                    </Grid>
                    <Grid col desktop={{ col: 9 }}>
                      {subNavItems(id).map(subpage => (
                        <Route exact path={subpage.route} key={subpage.route}>
                          <subpage.component trbRequestId={id} />
                        </Route>
                      ))}
                    </Grid>
                  </Grid>
                </GridContainer>
              </>
            )
          }
        </div>
      );
    }

    // If current user is not trb admin, return page not found
    return <NotFound />;
  }

  // If current user is not set, return page loading
  return <PageLoading />;
}
