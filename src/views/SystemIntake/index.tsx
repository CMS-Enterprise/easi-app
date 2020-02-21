import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Formik, Form, FormikProps } from 'formik';

import Header from 'components/Header';
import HeaderWrapper from 'components/Header/HeaderWrapper';
import BackNextButtons from 'components/shared/BackNextButtons';
import PageNumber from 'components/PageNumber';
import { SystemIntakeForm } from 'types/systemIntake';
import Page1 from './Page1';
import Page2 from './Page2';
import Review from './Review';
import './index.scss';

type SystemIntakeProps = {
  match: any;
};

export const SystemIntake = ({ match }: SystemIntakeProps) => {
  const pages = [
    {
      type: 'FORM',
      view: Page1
    },
    {
      type: 'FORM',
      view: Page2
    },
    {
      type: 'REVIEW',
      view: Review
    }
  ];
  const [page, setPage] = useState(1);
  const initialData: SystemIntakeForm = {
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
    hasContract: ''
  };

  const renderPage = (
    pageNum: number,
    formikProps: FormikProps<SystemIntakeForm>
  ) => {
    const Component = pages[pageNum - 1].view;

    if (Component) {
      return <Component formikProps={formikProps} />;
    }
    return null;
  };

  return (
    <div className="system-intake">
      <Header activeNavListItem={match.params.profileId} name="INTAKE">
        <HeaderWrapper className="grid-container margin-bottom-3">
          {pages[page - 1].type === 'FORM' && (
            <button
              type="button"
              className="easi-header__save-button usa-button"
              id="save-button"
            >
              <span>Save & Exit</span>
            </button>
          )}
        </HeaderWrapper>
      </Header>
      <div className="grid-container">
        <p className="line-height-body-6">
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
          onSubmit={(data: SystemIntakeForm) => {
            console.log('Submitted Data: ', data);
          }}
        >
          {(formikProps: FormikProps<SystemIntakeForm>) => (
            <>
              <Form className="margin-bottom-7">
                {renderPage(page, formikProps)}
              </Form>
              <BackNextButtons
                pageNum={page}
                totalPages={pages.length}
                setPage={setPage}
                onSubmit={() => {
                  console.log('Submitted: ', formikProps.values);
                }}
              />
            </>
          )}
        </Formik>
        {pages[page - 1].type === 'FORM' && (
          <PageNumber
            currentPage={page}
            totalPages={pages.filter(p => p.type === 'FORM').length}
          />
        )}
      </div>
    </div>
  );
};

export default withRouter(SystemIntake);
