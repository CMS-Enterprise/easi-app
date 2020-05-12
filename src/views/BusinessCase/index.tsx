import React, { useState } from 'react';
import { Formik, Form, FormikProps } from 'formik';
import Header from 'components/Header';
import Button from 'components/shared/Button';
import PageNumber from 'components/PageNumber';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import { BidnessCaseModel } from 'types/bidnessCase';
import {
  bidnessCaseInitalData,
  defaultProposedSolution
} from 'data/bidnessCase';
import BidnessCaseValidationSchema from 'validations/bidnessCaseSchema';
import flattenErrors from 'utils/flattenErrors';
import GeneralRequestInfo from './GeneralRequestInfo';
import RequestDescription from './RequestDescription';
import AsIsSolution from './AsIsSolution';
import PreferredSolution from './PreferredSolution';
import AlternativeSolution from './AlternativeSolution';
import Review from './Review';
import './index.scss';

export const BidnessCase = () => {
  const [pages, setPages] = useState<any[]>([
    {
      name: 'GeneralRequestInfo',
      type: 'FORM',
      validation: BidnessCaseValidationSchema.generalRequestInfo
    },
    {
      name: 'RequestDescription',
      type: 'FORM',
      validation: BidnessCaseValidationSchema.requestDescription
    },
    {
      name: 'AsIsSolution',
      type: 'FORM',
      validation: BidnessCaseValidationSchema.asIsSolution
    },
    {
      name: 'PreferredSolution',
      type: 'FORM',
      validation: BidnessCaseValidationSchema.preferredSolution
    },
    {
      name: 'AlternativeSolutionA',
      type: 'FORM',
      validation: BidnessCaseValidationSchema.alternativeA
    },
    {
      name: 'Review',
      type: 'REVIEW'
    }
  ]);
  const [page, setPage] = useState(1);
  const pageObj = pages[page - 1];

  const renderPage = (formikProps: FormikProps<BidnessCaseModel>) => {
    switch (pageObj.name) {
      case 'GeneralRequestInfo':
        return <GeneralRequestInfo formikProps={formikProps} />;
      case 'RequestDescription':
        return <RequestDescription formikProps={formikProps} />;
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
                          validation: BidnessCaseValidationSchema.alternativeB
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
        return <Review formikProps={formikProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="bidness-case">
      <Header name="CMS Bidness Case" />
      <main role="main">
        <Formik
          initialValues={bidnessCaseInitalData}
          // Empty onSubmit so the 'Next' buttons don't accidentally submit the form
          // Form will be manually submitted.
          onSubmit={() => {}}
          validationSchema={pageObj.validation}
          validateOnBlur={false}
          validateOnChange={false}
          validateOnMount={false}
        >
          {(formikProps: FormikProps<BidnessCaseModel>) => {
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
                <div className="grid-container">
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
                </div>
                <Form>
                  {renderPage(formikProps)}
                  <div className="grid-container">
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
                        Send my bidness case
                      </Button>
                    )}

                    {pageObj.type === 'FORM' && (
                      <div className="margin-y-3">
                        <Button
                          type="button"
                          unstyled
                          onClick={() => {
                            // dispatch save and exit function
                          }}
                        >
                          <span>
                            <i className="fa fa-angle-left" /> Save & Exit
                          </span>
                        </Button>
                      </div>
                    )}
                  </div>
                </Form>
              </>
            );
          }}
        </Formik>
        <div className="grid-container">
          {pageObj.type === 'FORM' && (
            <PageNumber
              currentPage={page}
              totalPages={pages.filter(p => p.type === 'FORM').length}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default BidnessCase;
