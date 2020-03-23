import React, { useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Formik, Form, FormikProps } from 'formik';

import Header from 'components/Header';
import Button from 'components/shared/Button';
import PageNumber from 'components/PageNumber';
import { BusinessCaseModel } from 'types/businessCase';
import GeneralProjectInfo from './GeneralProjectInfo';
import ProjectDescription from './ProjectDescription';
import AsIsSolution from './AsIsSolution';
import './index.scss';

export type BusinessCaseRouterProps = {
  profileId: string;
};

type BusinessCaseProps = RouteComponentProps<BusinessCaseRouterProps>;
export const BusinessCase = ({ match }: BusinessCaseProps) => {
  const pages = [
    {
      type: 'FORM',
      validation: null,
      view: GeneralProjectInfo
    },
    {
      type: 'FORM',
      validation: null,
      view: ProjectDescription
    },
    {
      type: 'FORM',
      validation: null,
      view: AsIsSolution
    }
  ];

  const [page, setPage] = useState(3);
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
    successIndicators: '',
    asIsSolution: {
      title: '',
      summary: '',
      pros: '',
      cons: '',
      estimatedLifecycleCost: {
        year1: [{ phase: '', cost: '' }],
        year2: [{ phase: '', cost: '' }],
        year3: [{ phase: '', cost: '' }],
        year4: [{ phase: '', cost: '' }],
        year5: [{ phase: '', cost: '' }]
      }
    }
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
          validateOnBlur={false}
          validateOnChange={false}
          validateOnMount={false}
        >
          {(formikProps: FormikProps<BusinessCaseModel>) => {
            const {
              values,
              validateForm,
              setErrors,
              isSubmitting
            } = formikProps;
            return (
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
                      // TODO: DELETE NEXT LINE WHEN VALIDATIONS ARE IMPLEMENTED
                      setPage(prev => prev + 1);
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
