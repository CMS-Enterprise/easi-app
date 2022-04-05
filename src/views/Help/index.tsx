import React from 'react';
import { Route, Switch } from 'react-router-dom';

import MainContent from 'components/MainContent';
import NotFound from 'views/NotFound';

import AllHelp from './All';
import HelpHome from './HelpHome';
import ITGovernance from './ITGovernance';
import Section508 from './Section508';

const Help = () => {
  return (
    <MainContent className="grid-container">
      <Switch>
        <Route path="/help" exact render={() => <HelpHome />} />
        <Route path="/help/all" render={() => <AllHelp />} />
        <Route path="/help/it-governance" render={() => <ITGovernance />} />
        <Route path="/help/section-508" render={() => <Section508 />} />
        {/* 404 */}
        <Route path="*" render={() => <NotFound />} />
      </Switch>
    </MainContent>
  );
};

export default Help;
