import React from 'react';
import { Route, Switch } from 'react-router-dom';

import NotFound from 'views/NotFound';

import NewSystem from './ITGovernance/NewSystem';
import PrepareForGRB from './ITGovernance/PrepareForGRB';
import PrepareForGRT from './ITGovernance/PrepareForGRT';
import SampleBusinessCase from './ITGovernance/SampleBusinessCase';
import StepsInvolved from './Section508/StepsInvolved';
import TestingTemplates from './Section508/TestingTemplate';
import ReportAProblem from './SendFeedback/ReportAProblem';
import PrepareTrbConsultMeeting from './TechnicalReviewBoard/PrepareTrbConsultMeeting';
import AllHelp from './All';
import HelpHome from './HelpHome';
import ITGovernance from './ITGovernance';
import Section508 from './Section508';
import SendFeedback from './SendFeedback';

const Help = () => {
  return (
    <Switch>
      {/* Home */}
      <Route path="/help" exact render={() => <HelpHome />} />

      {/* All Articles Search */}
      <Route path="/help/all-articles" render={() => <AllHelp />} />

      {/* IT Governance Help Routes */}
      <Route path="/help/it-governance" exact render={() => <ITGovernance />} />
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
      <Route
        path="/help/it-governance/sample-business-case"
        render={() => <SampleBusinessCase />}
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

      <Route path="/help/trb/prepare-consult-meeting">
        <PrepareTrbConsultMeeting />
      </Route>

      {/* Help feedback forms */}
      <Route path="/help/send-feedback" render={() => <SendFeedback />} />
      <Route path="/help/report-a-problem" render={() => <ReportAProblem />} />

      {/* 404 */}
      <Route path="*" render={() => <NotFound />} />
    </Switch>
  );
};

export default Help;
