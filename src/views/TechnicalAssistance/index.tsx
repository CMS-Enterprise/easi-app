import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Redirect,
  Route,
  Switch,
  useLocation,
  useRouteMatch
} from 'react-router-dom';

import MainContent from 'components/MainContent';
import { NotFoundPartial } from 'views/NotFound';

import Breadcrumbs from './Breadcrumbs';
import Homepage from './Homepage';
import RequestForm from './RequestForm';
import StartRequest from './StartRequest';
import Steps from './Steps';

/**
 * Check for `requestType` to be set in location state or else redirect to `/trb/start`.
 */
function RequestTypeRequired({ children }: { children: React.ReactNode }) {
  const { state } = useLocation<{ requestType: string }>();
  const requestType = state?.requestType;
  if (!requestType) return <Redirect to="/trb/start" />;
  return <>{children}</>;
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

        {/* Create new or edit exisiting request */}
        <Route exact path={`${path}/requests/:id/:step?/:view?`}>
          <RequestForm />
        </Route>

        <Route path="*">
          <NotFoundPartial />
        </Route>
      </Switch>
    </MainContent>
  );
}

export default TechnicalAssistance;
