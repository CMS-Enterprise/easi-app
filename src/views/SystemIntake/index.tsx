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
    requestor: {
      name: '',
      component: ''
    },
    businessOwner: {
      name: '',
      component: ''
    },
    productManager: {
      name: '',
      component: ''
    },
    isso: {
      isPresent: null,
      name: ''
    },
    governanceTeams: {
      isPresent: null,
      teams: []
    },
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
        <Formik
          initialValues={initialData}
          onSubmit={(data: SystemIntakeForm) => {
            console.log('Submitted Data: ', data);
          }}
        >
          {(formikProps: FormikProps<SystemIntakeForm>) => (
            <>
              <Form>{renderPage(page, formikProps)}</Form>
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
