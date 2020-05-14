import React, { useState, useEffect } from 'react';
import { Formik, Form, FormikProps } from 'formik';
import { useHistory, useParams } from 'react-router-dom';
import { SecureRoute } from '@okta/okta-react';
import Header from 'components/Header';
import Button from 'components/shared/Button';
import PageNumber from 'components/PageNumber';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import { BusinessCaseModel } from 'types/businessCase';
import {
  businessCaseInitalData,
  defaultProposedSolution
} from 'data/businessCase';
import BusinessCaseValidationSchema from 'validations/businessCaseSchema';
import flattenErrors from 'utils/flattenErrors';
import GeneralRequestInfo from './GeneralRequestInfo';
import RequestDescription from './RequestDescription';
import AsIsSolution from './AsIsSolution';
import PreferredSolution from './PreferredSolution';
import AlternativeSolution from './AlternativeSolution';
import Review from './Review';
import './index.scss';

export const BusinessCase = () => {
  const history = useHistory();
  const { businessCaseId, formPage } = useParams();
  const [pages, setPages] = useState<any[]>([
    {
      name: 'GeneralRequestInfo',
      type: 'FORM',
      slug: 'general-request-info',
      validation: BusinessCaseValidationSchema.generalRequestInfo
    },
    {
      name: 'RequestDescription',
      type: 'FORM',
      slug: 'request-description',
      validation: BusinessCaseValidationSchema.requestDescription
    },
    {
      name: 'AsIsSolution',
      type: 'FORM',
      slug: 'as-is-solution',
      validation: BusinessCaseValidationSchema.asIsSolution
    },
    {
      name: 'PreferredSolution',
      type: 'FORM',
      slug: 'preferred-solution',
      validation: BusinessCaseValidationSchema.preferredSolution
    },
    {
      name: 'AlternativeSolutionA',
      type: 'FORM',
      slug: 'alternative-solution-a',
      validation: BusinessCaseValidationSchema.alternativeA
    },
    {
      name: 'Review',
      type: 'REVIEW',
      slug: 'review'
    }
  ]);
  const [pageIndex, setPageIndex] = useState(0);
  const pageObj = pages[pageIndex];

  const renderPage = (formikProps: FormikProps<BusinessCaseModel>) => {
    switch (pageObj.name) {
      case 'GeneralRequestInfo':
        return (
          <SecureRoute
            path="/business/:businessCaseId/general-request-info"
            render={() => <GeneralRequestInfo formikProps={formikProps} />}
          />
        );
      case 'RequestDescription':
        return (
          <SecureRoute
            path="/business/:businessCaseId/request-description"
            render={() => <RequestDescription formikProps={formikProps} />}
          />
        );
      case 'AsIsSolution':
        return (
          <SecureRoute
            path="/business/:businessCaseId/as-is-solution"
            render={() => <AsIsSolution formikProps={formikProps} />}
          />
        );
      case 'PreferredSolution':
        return (
          <SecureRoute
            path="/business/:businessCaseId/preferred-solution"
            render={() => <PreferredSolution formikProps={formikProps} />}
          />
        );
      case 'AlternativeSolutionA':
        return (
          <SecureRoute
            path="/business/:businessCaseId/alternative-solution-a"
            render={() => (
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
                              slug: 'alternative-solution-b',
                              validation:
                                BusinessCaseValidationSchema.alternativeB
                            },
                            {
                              name: 'Review',
                              type: 'Review'
                            }
                          ]);
                        setPages(updatedPages);
                        const newUrl = updatedPages[pageIndex + 1].slug;
                        history.push(newUrl);
                      }
                    }
                    window.scrollTo(0, 0);
                  });
                }}
              />
            )}
          />
        );
      case 'AlternativeSolutionB':
        return (
          <SecureRoute
            path="/business/:businessCaseId/alternative-solution-b"
            render={() => (
              <AlternativeSolution
                formikProps={formikProps}
                altLetter="B"
                handleToggleAlternative={() => {
                  if (
                    window.confirm(
                      'Are you sure you want to remove Alternative B?'
                    )
                  ) {
                    setPages(prevArray =>
                      prevArray.filter(p => p.name !== 'AlternativeSolutionB')
                    );
                    history.replace(
                      `/business/${businessCaseId}/alternative-solution-a`
                    );
                    formikProps.setFieldValue('alternativeB', undefined);
                    formikProps.setErrors({});
                    window.scrollTo(0, 0);
                  }
                }}
              />
            )}
          />
        );
      case 'Review':
        return <Review formikProps={formikProps} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    const pageSlugs: any[] = pages.map(p => p.slug);
    if (pageSlugs.includes(formPage)) {
      setPageIndex(pageSlugs.indexOf(formPage));
    } else {
      history.replace(`/business/${businessCaseId}/general-request-info`);
      setPageIndex(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages, businessCaseId, formPage]);

  return (
    <div className="business-case margin-bottom-5">
      <Header name="CMS Business Case" />
      <main role="main">
        <Formik
          initialValues={businessCaseInitalData}
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
                    {pageIndex > 0 && (
                      <Button
                        type="button"
                        outline
                        onClick={() => {
                          setErrors({});
                          const newUrl = pages[pageIndex - 1].slug;
                          history.push(newUrl);
                          window.scrollTo(0, 0);
                        }}
                      >
                        Back
                      </Button>
                    )}

                    {pageIndex < pages.length - 1 && (
                      <Button
                        type="button"
                        onClick={() => {
                          if (pageObj.validation) {
                            validateForm().then(err => {
                              if (Object.keys(err).length === 0) {
                                const newUrl = pages[pageIndex + 1].slug;

                                history.push(newUrl);
                              }
                            });
                          }
                          window.scrollTo(0, 0);
                        }}
                      >
                        Next
                      </Button>
                    )}

                    {pageIndex === pages.length - 1 && (
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        onClick={() => {
                          console.log('Submitting Data: ', values);
                        }}
                      >
                        Send my business case
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
              currentPage={pageIndex + 1}
              totalPages={pages.filter(p => p.type === 'FORM').length}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default BusinessCase;
