import React, { useState, useEffect, useRef } from 'react';
import { Formik, Form, FormikProps } from 'formik';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SecureRoute } from '@okta/okta-react';
import { Button } from '@trussworks/react-uswds';
import isUUID from 'validator/lib/isUUID';
import { ObjectSchema } from 'yup';
import MainContent from 'components/MainContent';
import Header from 'components/Header';
import PageNumber from 'components/PageNumber';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';
import AutoSave from 'components/shared/AutoSave';
import {
  fetchBusinessCase,
  postBusinessCase,
  putBusinessCase,
  submitBusinessCase,
  clearBusinessCase
} from 'types/routines';
import { BusinessCaseModel } from 'types/businessCase';
import { defaultProposedSolution } from 'data/businessCase';
import { AppState } from 'reducers/rootReducer';
import BusinessCaseValidationSchema from 'validations/businessCaseSchema';
import flattenErrors from 'utils/flattenErrors';
import usePrevious from 'hooks/usePrevious';
import GeneralRequestInfo from './GeneralRequestInfo';
import RequestDescription from './RequestDescription';
import AsIsSolution from './AsIsSolution';
import PreferredSolution from './PreferredSolution';
import AlternativeSolution from './AlternativeSolution';
import Review from './Review';
import Confirmation from './Confirmation';
import './index.scss';

type Page = {
  name: string;
  type: string;
  slug: string;
  validation?: ObjectSchema;
};

export const BusinessCase = () => {
  const history = useHistory();
  const { businessCaseId, formPage } = useParams();
  const formikRef: any = useRef();
  const dispatch = useDispatch();
  const location = useLocation<any>();
  const [pages, setPages] = useState<Page[]>([
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
    },
    {
      name: 'Confirmation',
      type: 'CONFIRMATION',
      slug: 'confirmation'
    }
  ]);

  const businessCase = useSelector(
    (state: AppState) => state.businessCase.form
  );

  const isSaving = useSelector(
    (state: AppState) => state.businessCase.isSaving
  );

  const isSubmitting = useSelector(
    (state: AppState) => state.businessCase.isSubmitting
  );

  const error = useSelector((state: AppState) => state.businessCase.error);
  const prevIsSubmitting = usePrevious(isSubmitting);

  const [pageIndex, setPageIndex] = useState(0);
  const pageObj = pages[pageIndex];

  const dispatchSave = () => {
    const { current }: { current: FormikProps<BusinessCaseModel> } = formikRef;
    if (current && current.dirty && !isSaving) {
      dispatch(
        putBusinessCase({
          businessCase,
          ...current.values
        })
      );
      current.resetForm({ values: current.values, errors: current.errors });
    }
  };

  const updateAvailablePages = () => {
    const updatedPages = pages.slice(0, pages.length - 2).concat([
      {
        name: 'AlternativeSolutionB',
        type: 'FORM',
        slug: 'alternative-solution-b',
        validation: BusinessCaseValidationSchema.alternativeB
      },
      {
        name: 'Review',
        type: 'REVIEW',
        slug: 'review'
      },
      {
        name: 'Confirmation',
        type: 'CONFIRMATION',
        slug: 'confirmation'
      }
    ]);
    setPages(updatedPages);
    const newUrl = updatedPages[pageIndex + 1].slug;
    history.push(newUrl);
  };

  // Start new business case or resume existing business case
  useEffect(() => {
    if (businessCaseId === 'new') {
      const systemIntakeId =
        (location.state && location.state.systemIntakeId) || '';
      dispatch(
        postBusinessCase({
          ...businessCase,
          systemIntakeId
        })
      );
    } else {
      dispatch(fetchBusinessCase(businessCaseId));
    }

    return () => {
      // if has valid uuid, autosave business case when unmounting
      if (isUUID(businessCaseId)) {
        const {
          current
        }: { current: FormikProps<BusinessCaseModel> } = formikRef;
        dispatch(
          putBusinessCase({
            businessCase,
            ...current.values
          })
        );
      }

      // clear business case when unmounting
      dispatch(clearBusinessCase());
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update the pages when there's an alternative b
  useEffect(() => {
    if (businessCase.alternativeB) {
      updateAvailablePages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessCase.alternativeB]);

  useEffect(() => {
    if (businessCase.id) {
      history.replace(`/business/${businessCase.id}/${formPage}`);
    }
  }, [history, businessCase.id, formPage]);

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

  // Handle submit
  useEffect(() => {
    if (prevIsSubmitting && !isSubmitting && !error) {
      history.push(`/business/${businessCaseId}/confirmation`);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting]);

  return (
    <div className="business-case margin-bottom-5">
      <Header />
      <MainContent>
        {businessCase.id && (
          <Formik
            initialValues={businessCase}
            onSubmit={values => {
              dispatch(submitBusinessCase(values));
            }}
            validationSchema={pageObj.validation}
            validateOnBlur={false}
            validateOnChange={false}
            validateOnMount={false}
            innerRef={formikRef}
            enableReinitialize
          >
            {(formikProps: FormikProps<BusinessCaseModel>) => {
              const { values, errors, validateForm, setErrors } = formikProps;
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
                              errorKey={key}
                              message={flatErrors[key]}
                            />
                          );
                        })}
                      </ErrorAlert>
                    )}
                  </div>
                  <Form>
                    <SecureRoute
                      path="/business/:businessCaseId/general-request-info"
                      render={() => (
                        <GeneralRequestInfo formikProps={formikProps} />
                      )}
                    />
                    <SecureRoute
                      path="/business/:businessCaseId/request-description"
                      render={() => (
                        <RequestDescription formikProps={formikProps} />
                      )}
                    />
                    <SecureRoute
                      path="/business/:businessCaseId/as-is-solution"
                      render={() => <AsIsSolution formikProps={formikProps} />}
                    />
                    <SecureRoute
                      path="/business/:businessCaseId/preferred-solution"
                      render={() => (
                        <PreferredSolution formikProps={formikProps} />
                      )}
                    />
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
                                  updateAvailablePages();
                                  window.scrollTo(0, 0);
                                }
                              }
                            });
                          }}
                        />
                      )}
                    />
                    {pages
                      .map((p: Page) => p.name)
                      .includes('AlternativeSolutionB') && (
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
                                  prevArray.filter(
                                    p => p.name !== 'AlternativeSolutionB'
                                  )
                                );
                                history.replace(
                                  `/business/${businessCaseId}/alternative-solution-a`
                                );
                                formikProps.setFieldValue(
                                  'alternativeB',
                                  undefined
                                );
                                formikProps.setErrors({});
                                window.scrollTo(0, 0);
                              }
                            }}
                          />
                        )}
                      />
                    )}
                    <SecureRoute
                      path="/business/:businessCaseId/review"
                      render={() => <Review formikProps={formikProps} />}
                    />
                    <SecureRoute
                      path="/business/:businessCaseId/confirmation"
                      render={() => <Confirmation />}
                    />
                    <div className="grid-container">
                      {pageIndex > 0 &&
                        pages[pageIndex].type !== 'CONFIRMATION' && (
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
                      {pageIndex < pages.length - 2 && (
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
                      {pages[pageIndex].type === 'REVIEW' && (
                        <Button type="submit" disabled={isSubmitting}>
                          Send my business case
                        </Button>
                      )}
                      {pageObj.type === 'FORM' && (
                        <div className="margin-y-3">
                          <Button
                            type="button"
                            unstyled
                            onClick={() => {
                              dispatchSave();
                              // TODO: We probably want to check whether save was sucessful
                              // then redirect.
                              history.push('/');
                            }}
                          >
                            <span>
                              <i className="fa fa-angle-left" /> Save & Exit
                            </span>
                          </Button>
                        </div>
                      )}
                    </div>
                    <AutoSave
                      values={values}
                      onSave={dispatchSave}
                      debounceDelay={1500}
                    />
                  </Form>
                </>
              );
            }}
          </Formik>
        )}
        <div className="grid-container">
          {pageObj.type === 'FORM' && (
            <PageNumber
              currentPage={pageIndex + 1}
              totalPages={pages.filter(p => p.type === 'FORM').length}
            />
          )}
        </div>
      </MainContent>
    </div>
  );
};

export default BusinessCase;
