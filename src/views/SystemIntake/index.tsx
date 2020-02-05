import React from 'react';
import { withRouter } from 'react-router-dom';
import Header from 'components/Header';
import './index.scss';
import HeaderWrapper from '../../components/Header/HeaderWrapper';

type SystemProfileProps = {
  match: any;
};

export const SystemIntake = ({ match }: SystemProfileProps) => {
  return (
    <div className="system-profile">
      <Header activeNavListItem={match.params.profileId} name="INTAKE">
        <HeaderWrapper className="grid-container margin-bottom-3">
          <button
            type="button"
            className="easi-header__save-button usa-button"
            id="save-button"
          >
            <span>Save & Exit</span>
          </button>
        </HeaderWrapper>
      </Header>
      <div className="grid-container">
        <p className="system-profile__text">
          The EASi System Intake process can guide you through all stages of
          your project, connecting you with the resources, people and services
          that you need. Please complete and submit this CMS IT Intake form to
          engage with the CMS IT Governance review process. This is the first
          step to receive a CMS IT LifeCycle ID. Upon submission, you will
          receive an email promptly from the IT_Governance mailbox, and an IT
          Governance Team member will reach out regarding next steps.
        </p>
      </div>
    </div>
  );
};

export default withRouter(SystemIntake);
