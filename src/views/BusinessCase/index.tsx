import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
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
import AsIsSolution from './AsIsSolution';
import PreferredSolution from './PreferredSolution';
import AlternativeSolution from './AlternativeSolution';
import Review from './Review';
import './index.scss';

// Default data for estimated lifecycle costs
const defaultEstimatedLifecycle = {
  year1: [{ phase: '', cost: '' }],
  year2: [{ phase: '', cost: '' }],
  year3: [{ phase: '', cost: '' }],
  year4: [{ phase: '', cost: '' }],
  year5: [{ phase: '', cost: '' }]
};

// Default data for a proposed solution
export const defaultProposedSolution = {
  title: '',
  summary: '',
  acquisitionApproach: '',
  pros: '',
  cons: '',
  estimatedLifecycleCost: defaultEstimatedLifecycle,
  costSavings: ''
};

export const BusinessCase = () => {
  const [pages, setPages] = useState<any[]>([
    {
      name: 'GeneralProjectInfo',
      type: 'FORM',
      validation: BusinessCaseValidationSchema.generalProjectInfo
    },
    {
      name: 'ProjectDescription',
      type: 'FORM',
      validation: BusinessCaseValidationSchema.projectDescription
    },
    {
      name: 'AsIsSolution',
      type: 'FORM',
      validation: BusinessCaseValidationSchema.asIsSolution
    },
    {
      name: 'PreferredSolution',
      type: 'FORM',
      validation: BusinessCaseValidationSchema.preferredSolution
    },
    {
      name: 'AlternativeSolutionA',
      type: 'FORM',
      validation: BusinessCaseValidationSchema.alternativeA
    },
    {
      name: 'Review',
      type: 'REVIEW'
    }
  ]);
  const [page, setPage] = useState(1);
  const pageObj = pages[page - 1];

  const initialData: BusinessCaseModel = {
    projectName: '',
    requester: {
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
      estimatedLifecycleCost: defaultEstimatedLifecycle,
      costSavings: ''
    },
    preferredSolution: defaultProposedSolution,
    alternativeA: defaultProposedSolution
  };

  const renderPage = (formikProps: FormikProps<BusinessCaseModel>) => {
    switch (pageObj.name) {
      case 'GeneralProjectInfo':
        return <GeneralProjectInfo formikProps={formikProps} />;
      case 'ProjectDescription':
        return <ProjectDescription formikProps={formikProps} />;
      case 'AsIsSolution':
        return <AsIsSolution formikProps={formikProps} />;
      case 'PreferredSolution':
        return <PreferredSolution formikProps={formikProps} />;
      case 'AlternativeSolutionA':
        return (
          <AlternativeSolution
            formikProps={formikProps}
            altLetter="A"
            handleToggleAlternative={() => {
              formikProps.validateForm().then(err => {
                if (Object.keys(err).length === 0) {
                  if (!formikProps.values.alternativeB) {
                    formikProps.setFieldValue(
                      'alternativeB',
                      defaultProposedSolution
                    );

                    const updatedPages = pages
                      .slice(0, pages.length - 1)
                      .concat([
                        {
                          name: 'AlternativeSolutionB',
                          type: 'FORM',
                          validation: BusinessCaseValidationSchema.alternativeB
                        },
                        {
                          name: 'Review',
                          type: 'Review'
                        }
                      ]);
                    setPages(updatedPages);
                  }
                  setPage(prev => prev + 1);
                }
                window.scrollTo(0, 0);
              });
            }}
          />
        );
      case 'AlternativeSolutionB':
        return (
          <AlternativeSolution
            formikProps={formikProps}
            altLetter="B"
            handleToggleAlternative={() => {
              if (
                window.confirm('Are you sure you want to remove Alternative B?')
              ) {
                setPages(prevArray =>
                  prevArray.filter(p => p.name !== 'AlternativeSolutionB')
                );
                setPage(prev => prev - 1);
                formikProps.setFieldValue('alternativeB', undefined);
                formikProps.setErrors({});
                window.scrollTo(0, 0);
              }
            }}
          />
        );
      case 'Review':
        return <Review />;
      default:
        return null;
    }
  };

  return (
    <div className="business-case">
      <Header name="BUSINESS">
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
                        } else {
                          setPage(prev => prev + 1);
                        }
                        window.scrollTo(0, 0);
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
