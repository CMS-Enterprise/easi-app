import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useFlags } from 'launchdarkly-react-client-sdk';

import NotFound from 'views/NotFound';

import NewSystem from './ITGovernance/NewSystem';
import PrepareForGRB from './ITGovernance/PrepareForGRB';
import PrepareForGRT from './ITGovernance/PrepareForGRT';
import StepsInvolved from './Section508/StepsInvolved';
import TestingTemplates from './Section508/TestingTemplate';
import AllHelp from './All';
import Footer from './Footer';
import HelpHome from './HelpHome';
import ITGovernance from './ITGovernance';
import Section508 from './Section508';

const Help = () => {
  const flags = useFlags();
  return (
    <>
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
        <Route
          path="/help/it-governance/prepare-for-grt"
          render={() => <PrepareForGRT />}
        />
        <Route
          path="/help/it-governance/prepare-for-grb"
          render={() => <PrepareForGRB />}
        />
        <Route
          path="/help/it-governance/steps-overview/new-system"
          render={() => <NewSystem />}
        />

        {/* Section 508 Help Routes */}
        <Route path="/help/section-508" exact render={() => <Section508 />} />
        <Route
          path="/help/section-508/steps-involved"
          render={() => <StepsInvolved />}
        />
        <Route
          path="/help/section-508/templates-for-508-testing"
          render={() => <TestingTemplates />}
        />

        {/* 404 */}
        <Route path="*" render={() => <NotFound />} />
      </Switch>

      {flags.helpFooter && <Footer />}
    </>
  );
};

export default Help;
