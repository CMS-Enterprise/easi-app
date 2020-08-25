import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { SecureRoute } from '@okta/okta-react';
import { FormikProps } from 'formik';
import { ObjectSchema } from 'yup';

import Header from 'components/Header';
import MainContent from 'components/MainContent';
import { defaultProposedSolution } from 'data/businessCase';
import usePrevious from 'hooks/usePrevious';
import { AppState } from 'reducers/rootReducer';
import { BusinessCaseModel } from 'types/businessCase';
import {
  clearBusinessCase,
  fetchBusinessCase,
  postBusinessCase,
  putBusinessCase
} from 'types/routines';
import BusinessCaseValidationSchema from 'validations/businessCaseSchema';

import AlternativeSolution from './AlternativeSolution';
import AsIsSolution from './AsIsSolution';
import Confirmation from './Confirmation';
import GeneralRequestInfo from './GeneralRequestInfo';
import PreferredSolution from './PreferredSolution';
import RequestDescription from './RequestDescription';
import Review from './Review';

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

  const dispatchSave = () => {
    const { current }: { current: FormikProps<BusinessCaseModel> } = formikRef;
    if (current && current.dirty && !isSaving) {
      dispatch(
        putBusinessCase({
          ...businessCase,
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
          <>
            <SecureRoute
              path="/business/:businessCaseId/general-request-info"
              render={() => (
                <GeneralRequestInfo
                  formikRef={formikRef}
                  dispatchSave={dispatchSave}
                  businessCase={businessCase}
                />
              )}
            />
            <SecureRoute
              path="/business/:businessCaseId/request-description"
              render={() => (
                <RequestDescription
                  formikRef={formikRef}
                  dispatchSave={dispatchSave}
                  businessCase={businessCase}
                />
              )}
            />
            <SecureRoute
              path="/business/:businessCaseId/as-is-solution"
              render={() => (
                <AsIsSolution
                  formikRef={formikRef}
                  dispatchSave={dispatchSave}
                  businessCase={businessCase}
                />
              )}
            />
            <SecureRoute
              path="/business/:businessCaseId/preferred-solution"
              render={() => (
                <PreferredSolution
                  formikRef={formikRef}
                  dispatchSave={dispatchSave}
                  businessCase={businessCase}
                />
              )}
            />
            <SecureRoute
              path="/business/:businessCaseId/alternative-solution-a"
              render={() => (
                <AlternativeSolution
                  formikRef={formikRef}
                  dispatchSave={dispatchSave}
                  businessCase={businessCase}
                  altLetter="A"
                  handleToggleAlternative={() => {
                    dispatch(
                      putBusinessCase({
                        ...businessCase,
                        alternativeB: defaultProposedSolution
                      })
                    );
                    history.push('alternative-solution-b');
                    window.scrollTo(0, 0);
                  }}
                />
              )}
            />
            {businessCase.alternativeB && (
              <SecureRoute
                path="/business/:businessCaseId/alternative-solution-b"
                render={() => (
                  <AlternativeSolution
                    formikRef={formikRef}
                    dispatchSave={dispatchSave}
                    businessCase={businessCase}
                    altLetter="B"
                    handleToggleAlternative={() => {
                      if (
                        window.confirm(
                          'Are you sure you want to remove Alternative B?'
                        )
                      ) {
                        history.replace(
                          `/business/${businessCaseId}/alternative-solution-a`
                        );
                        dispatch(
                          putBusinessCase({
                            ...businessCase,
                            alternativeB: undefined
                          })
                        );
                        window.scrollTo(0, 0);
                      }
                    }}
                  />
                )}
              />
            )}
            <SecureRoute
              path="/business/:businessCaseId/review"
              render={() => <Review businessCase={businessCase} />}
            />
            <SecureRoute
              path="/business/:businessCaseId/confirmation"
              render={() => <Confirmation />}
            />
          </>
        )}
      </MainContent>
    </div>
  );
};

export default BusinessCase;
