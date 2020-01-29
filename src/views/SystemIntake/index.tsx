import React from 'react';
import { withRouter } from 'react-router-dom';
import Header from 'components/Header';
import './index.scss';

type SystemProfileProps = {
  match: any;
};

export const SystemIntake = ({ match }: SystemProfileProps) => {
  return (
    <div className="system-profile">
      <Header activeNavListItem={match.params.profileId} name="INTAKE" />
    </div>
  );
};

export default withRouter(SystemIntake);
