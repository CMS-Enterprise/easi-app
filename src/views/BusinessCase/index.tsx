import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Formik, Form, FormikProps } from 'formik';

import Header from 'components/Header';
import Button from 'components/shared/Button';
import PageNumber from 'components/PageNumber';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import { BusinessCaseModel } from 'types/businessCase';
import BusinessCaseValidationSchema from 'validations/businessCaseSchema';
import flattenErrors from 'utils/flattenErrors';
import GeneralProjectInfo from './GeneralProjectInfo';
import ProjectDescription from './ProjectDescription';
import './index.scss';

export type BusinessCaseRouterProps = {
  profileId: string;
};

type BusinessCaseProps = RouteComponentProps<BusinessCaseRouterProps>;
export const BusinessCase = ({ match }: BusinessCaseProps) => {
  const pages = [
    {
      type: 'FORM',
      validation: BusinessCaseValidationSchema.generalProjectInfo,
      view: GeneralProjectInfo
    },
    {
      type: 'FORM',
      validation: BusinessCaseValidationSchema.projectDescription,
      view: ProjectDescription
    }
  ];

  const [page, setPage] = useState(1);
  const pageObj = pages[page - 1];
  const initialData: BusinessCaseModel = {
    projectName: '',
    requestor: {
      name: '',
      phoneNumber: ''
    },
    budgetNumber: '',
    businessOwner: {
      name: ''
    },
    businessNeed: '',
    cmsBenefit: '',
    priorityAlignment: '',
    successIndicators: ''
  };
  const renderPage = (formikProps: FormikProps<BusinessCaseModel>) => {
    const Component = pageObj.view;

    if (Component) {
      return <Component formikProps={formikProps} />;
    }
    return null;
  };
  return (
    <div className="business-case">
      <Header activeNavListItem={match.params.profileId} name="INTAKE">
        <div className="margin-bottom-3">
          {pageObj.type === 'FORM' && (
            <button type="button" className="easi-button__save usa-button">
              <span>Save & Exit</span>
            </button>
          )}
        </div>
      </Header>
      <main className="grid-container" role="main">
        <Formik
          initialValues={initialData}
          // Empty onSubmit so the 'Next' buttons don't accidentally submit the form
          // Form will be manually submitted.
          onSubmit={() => {}}
          validationSchema={pageObj.validation}
          validateOnBlur={false}
          validateOnChange={false}
          validateOnMount={false}
        >
          {(formikProps: FormikProps<BusinessCaseModel>) => {
            const {
              values,
              errors,
              validateForm,
              setErrors,
              isSubmitting
            } = formikProps;
            const flatErrors: any = flattenErrors(errors);
            return (
              <>
                {Object.keys(errors).length > 0 && (
                  <ErrorAlert
                    classNames="margin-top-3"
                    heading="Please check and fix the following"
                  >
                    {Object.keys(flatErrors).map(key => {
                      return (
                        <ErrorAlertMessage
                          key={`Error.${key}`}
                          message={flatErrors[key]}
                          onClick={() => {
                            const field = document.querySelector(
                              `[data-scroll="${key}"]`
                            );

                            if (field) {
                              field.scrollIntoView();
                            }
                          }}
                        />
                      );
                    })}
                  </ErrorAlert>
                )}
                <Form>
                  {renderPage(formikProps)}
                  {page > 1 && (
                    <Button
                      type="button"
                      outline
                      onClick={() => {
                        setPage(prev => prev - 1);
                        setErrors({});
                        window.scrollTo(0, 0);
                      }}
                    >
                      Back
                    </Button>
                  )}

                  {page < pages.length && (
                    <Button
                      type="button"
                      onClick={() => {
                        if (pageObj.validation) {
                          validateForm().then(err => {
                            if (Object.keys(err).length === 0) {
                              setPage(prev => prev + 1);
                            }
                          });
                          window.scrollTo(0, 0);
                        }
                      }}
                    >
                      Next
                    </Button>
                  )}

                  {page === pages.length && (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
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
        {pageObj.type === 'FORM' && (
          <PageNumber
            currentPage={page}
            totalPages={pages.filter(p => p.type === 'FORM').length}
          />
        )}
      </main>
    </div>
  );
};

export default withRouter(BusinessCase);
