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
import NotFound from 'views/NotFound';

import Summary from './Summary/Summary';
import AdviceLetter from './AdviceLetter';
import Feedback from './Feedback';
import InitialRequestForm from './InitialRequestForm';
import Notes from './Notes';
import RequestHome from './RequestHome';
import SupportingDocuments from './SupportingDocuments';

import './index.scss';

/** TRB admin home sub navigation items */
const trbAdminSubPages = (
  trbRequestId: string
): { route: string; translationKey: string; component: JSX.Element }[] => [
  {
    route: `/trb/${trbRequestId}`,
    translationKey: 'requestHome',
    component: <RequestHome trbRequestId={trbRequestId} />
  },
  {
    route: `/trb/${trbRequestId}/initial-request-form`,
    translationKey: 'initialRequestForm',
    component: <InitialRequestForm trbRequestId={trbRequestId} />
  },
  {
    route: `/trb/${trbRequestId}/documents`,
    translationKey: 'supportingDocuments',
    component: <SupportingDocuments trbRequestId={trbRequestId} />
  },
  {
    route: `/trb/${trbRequestId}/feedback`,
    translationKey: 'feedback',
    component: <Feedback trbRequestId={trbRequestId} />
  },
  {
    route: `/trb/${trbRequestId}/advice`,
    translationKey: 'adviceLetter',
    component: <AdviceLetter trbRequestId={trbRequestId} />
  },
  {
    route: `/trb/${trbRequestId}/notes`,
    translationKey: 'notes',
    component: <Notes trbRequestId={trbRequestId} />
  }
];

export default function TrbAdminHome() {
  /** Current user groups */
  const userGroups = useSelector((state: AppState) => state.auth.groups);
  /** Whether or not current user is set */
  const isUserSet = useSelector((state: AppState) => state.auth.isUserSet);

  const { t } = useTranslation('technicalAssistance');

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
        <div className="trb-admin-home" id="trbAdminHome">
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
                  requestType={trbRequest.form.needsAssistanceWith || ''}
                  requester={trbRequest.createdBy}
                  submissionDate="September 13, 2022"
                />
                <GridContainer>
                  <Grid row className="margin-y-5">
                    <Grid col desktop={{ col: 3 }}>
                      {/* Navigation */}
                      <nav>
                        <ul className="trb-admin-home__nav-list usa-list usa-list--unstyled">
                          <li className="margin-bottom-4">
                            <Link
                              to="/"
                              className="display-flex flex-align-center"
                            >
                              <IconArrowBack
                                className="margin-right-1"
                                aria-hidden
                              />
                              {t('adminHome.subnav.back')}
                            </Link>
                          </li>
                          {trbAdminSubPages(id).map(
                            ({ route, translationKey }) => {
                              const isActivePage: boolean =
                                route.split('/')[3] === activePage;
                              return (
                                <li
                                  key={`trb-sidenav-${translationKey}`}
                                  className={classNames(
                                    'padding-y-1',
                                    'trb-admin-home__nav-link',
                                    {
                                      'trb-admin-home__nav-link--active': isActivePage
                                    }
                                  )}
                                >
                                  <Link
                                    to={route}
                                    data-testid={`grt-nav-${translationKey}-link`}
                                    className={classNames(
                                      'text-no-underline',
                                      'padding-y-05',
                                      {
                                        'text-base-darkest': !isActivePage,
                                        'text-primary': isActivePage
                                      }
                                    )}
                                  >
                                    {t(`adminHome.subnav.${translationKey}`)}
                                  </Link>
                                </li>
                              );
                            }
                          )}
                        </ul>
                      </nav>
                    </Grid>
                    <Grid col desktop={{ col: 9 }}>
                      {trbAdminSubPages(id).map(({ route, component }) => (
                        <Route exact path={route}>
                          {component}
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
