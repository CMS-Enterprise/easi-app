import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NotFound from 'features/Miscellaneous/NotFound';

import ReportAProblem from './Feedback/ReportAProblem/ReportAProblem';
import SendFeedback from './Feedback/SendFeedback';
import NewSystem from './ITGovernance/NewSystem';
import PrepareForGRB from './ITGovernance/PrepareForGRB';
import PrepareForGRT from './ITGovernance/PrepareForGRT';
import SampleBusinessCase from './ITGovernance/SampleBusinessCase';
import PrepareTrbConsultMeeting from './TechnicalReviewBoard/PrepareTrbConsultMeeting';
import StepsInProcess from './TechnicalReviewBoard/StepsInProcess';
import AllHelp from './All';
import HelpHome from './HelpHome';
import ITGovernance from './ITGovernance';
import TechnicalReviewBoard from './TechnicalReviewBoard';

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

      {/* TRB */}
      <Route path="/help/trb" exact>
        <TechnicalReviewBoard />
      </Route>
      <Route path="/help/trb/prepare-consult-meeting" exact>
        <PrepareTrbConsultMeeting />
      </Route>
      <Route path="/help/trb/steps-involved-trb" exact>
        <StepsInProcess />
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
