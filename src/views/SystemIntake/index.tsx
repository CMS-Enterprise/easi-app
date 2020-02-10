import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Formik, Form } from 'formik';

import Header from 'components/Header';
import HeaderWrapper from 'components/Header/HeaderWrapper';
import BackNextButtons from 'components/shared/BackNextButtons';
import Page1 from './Page1';
import './index.scss';

type SystemProfileProps = {
  match: any;
};

export const SystemIntake = ({ match }: SystemProfileProps) => {
  const TOTAL_PAGES = 3;
  const [page, setPage] = useState(1);
  const initialData: any = {
    name: '',
    acronym: '',
    requestor: '',
    requestorComponent: '',
    businessOwner: '',
    businessOwnerComponent: '',
    productManager: '',
    productManagerComponent: '',
    governanceTeams: [],
    description: '',
    currentStage: '',
    needsEaSupport: null,
    hasContract: null,
    isBusinessOwnerSameAsRequestor: null
  };

  const renderPage = (pageNum: number, values: any) => {
    switch (pageNum) {
      case 1:
        return <Page1 values={values} />;
      default:
        return null;
    }
  };

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

        <Formik
          initialValues={initialData}
          onSubmit={(data: any) => {
            console.log('Submitted Data: ', data);
          }}
        >
          {({ values }) => (
            <>
              <Form>
                <pre>{JSON.stringify(values, null, 2)}</pre>
                {renderPage(page, values)}
              </Form>
              <BackNextButtons
                pageNum={page}
                totalPages={TOTAL_PAGES}
                setPage={setPage}
                onSubmit={values}
              />
            </>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default withRouter(SystemIntake);
