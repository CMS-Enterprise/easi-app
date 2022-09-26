import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Link,
  Redirect,
  Route,
  RouteChildrenProps,
  Switch,
  useLocation,
  useRouteMatch
} from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink
} from '@trussworks/react-uswds';

import MainContent from 'components/MainContent';
import { NotFoundPartial } from 'views/NotFound';

import Homepage from './Homepage';
import StartRequest from './StartRequest';
import Steps from './Steps';

import './index.scss';

/**
 * Check for `requestType` to be set in location state or else redirect to `/trb/start`.
 */
function RequestTypeRequired({ children }: { children: React.ReactNode }) {
  const { state } = useLocation<{ requestType: string }>();
  const requestType = state?.requestType;
  if (!requestType) return <Redirect to="/trb/start" />;
  return <>{children}</>;
}

/**
 * Generate a `BreadcrumbBar` from links.
 */
function Breadcrumbs({ items }: { items: { text: string; url?: string }[] }) {
  return (
    <BreadcrumbBar className="padding-bottom-0">
      {items.map((link, idx) => {
        if (idx === items.length - 1) {
          return (
            <Breadcrumb key={link.text} current>
              <span>{link.text}</span>
            </Breadcrumb>
          );
        }
        return (
          <Breadcrumb key="last">
            <BreadcrumbLink asCustom={Link} to={link.url!}>
              <span>{link.text}</span>
            </BreadcrumbLink>
          </Breadcrumb>
        );
      })}
    </BreadcrumbBar>
  );
}

function TechnicalAssistance() {
  const { path, url } = useRouteMatch();
  const { t } = useTranslation('technicalAssistance');

  return (
    <MainContent className="technical-assistance grid-container margin-bottom-10">
      <Switch>
        <Route exact path={path}>
          <Homepage />
        </Route>

        {/* Start a request */}
        <Route exact path={`${path}/start`}>
          <Breadcrumbs
            items={[
              { text: t('heading'), url },
              { text: t('breadcrumbs.startTrbRequest') }
            ]}
          />
          <StartRequest />
        </Route>

        {/* Start request steps that require `requestType` to be set */}
        <Route exact path={`${path}/steps`}>
          <RequestTypeRequired>
            <Breadcrumbs
              items={[
                { text: t('heading'), url },
                { text: t('breadcrumbs.startTrbRequest') }
              ]}
            />
            <Steps />
          </RequestTypeRequired>
        </Route>

        {/* New request stub */}
        <Route exact path={`${path}/new`}>
          {({ location }: RouteChildrenProps<any, any>) => {
            const requestType = location.state?.requestType;
            return (
              <RequestTypeRequired>
                <>New TRB Request: {requestType}</>
              </RequestTypeRequired>
            );
          }}
        </Route>

        {/* View a request stub */}
        <Route exact path={`${path}/requests/:id`}>
          {({ match }) => {
            return <>View TRB Request {match?.params?.id}</>;
          }}
        </Route>

        <Route path="*">
          <NotFoundPartial />
        </Route>
      </Switch>
    </MainContent>
  );
}

export default TechnicalAssistance;
