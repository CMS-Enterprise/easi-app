import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Formik, Form, FormikProps } from 'formik';
import Header from 'components/Header';
import HeaderWrapper from 'components/Header/HeaderWrapper';
import Button from 'components/shared/Button';
import PageNumber from 'components/PageNumber';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import { SystemIntakeForm } from 'types/systemIntake';
import SystemIntakeValidationSchema from 'validations/systemIntakeSchema';
import flattenErrors from 'utils/flattenErrors';
import ContactDetails from './ContactDetails';
import RequestDetails from './RequestDetails';
import Review from './Review';
import './index.scss';

export type SystemIntakeRouterProps = {
  profileId: string;
};
type SystemIntakeProps = RouteComponentProps<SystemIntakeRouterProps> & {};

export const SystemIntake = ({ match }: SystemIntakeProps) => {
  const pages = [
    {
      type: 'FORM',
      validation: SystemIntakeValidationSchema[1],
      view: ContactDetails
    },
    {
      type: 'FORM',
      view: RequestDetails
    },
    {
      type: 'REVIEW',
      view: Review
    }
  ];
  const [page, setPage] = useState(1);
  const initialData: SystemIntakeForm = {
    projectName: '',
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
    fundingSource: {
      isFunded: null,
      fundingNumber: ''
    },
    businessNeed: '',
    businessSolution: '',
    currentStage: '',
    needsEaSupport: null,
    hasContract: ''
  };

  const renderPage = (formikProps: FormikProps<SystemIntakeForm>) => {
    const Component = pages[page - 1].view;

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
          validationSchema={pages[page - 1].validation}
          validateOnBlur={false}
          validateOnChange={false}
          validateOnMount={false}
        >
          {(formikProps: FormikProps<SystemIntakeForm>) => {
            const { values, errors, validateForm } = formikProps;
            const flatErrors: any = flattenErrors(errors);
            return (
              <>
                {Object.keys(errors).length > 0 && (
                  <ErrorAlert heading="Please check and fix the following">
                    {Object.keys(flatErrors).map(key => {
                      return (
                        <ErrorAlertMessage
                          key={`Error.${key}`}
                          message={flatErrors[key]}
                        />
                      );
                    })}
                  </ErrorAlert>
                )}
                <Form>
                  {renderPage(formikProps)}
                  {/* validateForm needs to be called from inside of Form component and it cannot be type="button"; it must be type="submit" */}
                  {page > 1 && (
                    <Button
                      type="button"
                      outline
                      onClick={() => setPage(prev => prev - 1)}
                    >
                      Back
                    </Button>
                  )}

                  {page < pages.length && (
                    <Button
                      type="submit"
                      onClick={e => {
                        e.preventDefault();
                        console.log('hello');
                        if (pages[page - 1].validation) {
                          validateForm();
                          console.log(errors);
                        }
                        if (Object.keys(errors).length > 0) {
                          setPage(prev => prev + 1);
                        }
                      }}
                    >
                      Next
                    </Button>
                  )}

                  {page === pages.length && (
                    <Button
                      type="submit"
                      onClick={() => {
                        console.log('Submitting Data: ', values);
                      }}
                    >
                      Review and Send
                    </Button>
                  )}
                </Form>
              </>
            );
          }}
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
