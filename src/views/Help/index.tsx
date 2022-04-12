import React from 'react';
import { Route, Switch } from 'react-router-dom';

import MainContent from 'components/MainContent';
import NotFound from 'views/NotFound';

import StepsInvolved from './Section508/StepsInvolved';
import AllHelp from './All';
import HelpHome from './HelpHome';
import ITGovernance from './ITGovernance';
import Section508 from './Section508';

const Help = () => {
  return (
    <>
      <MainContent className="grid-container">
        <Switch>
          {/* Home */}
          <Route path="/help" exact render={() => <HelpHome />} />

          {/* All Articles Search */}
          <Route path="/help/all-articles" render={() => <AllHelp />} />

          {/* IT Governance Help Routes */}
          <Route
            path="/help/it-governance"
            exact
            render={() => <ITGovernance />}
          />

          {/* Section 508 Help Routes */}
          <Route path="/help/section-508" exact render={() => <Section508 />} />
          <Route
            path="/help/section-508/steps-involved"
            render={() => <StepsInvolved />}
          />

          {/* 404 */}
          <Route path="*" render={() => <NotFound />} />
        </Switch>
      </MainContent>
    </>
  );
};

export default Help;
