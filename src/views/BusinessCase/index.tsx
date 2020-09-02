import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation, useParams } from 'react-router-dom';
import { SecureRoute } from '@okta/okta-react';
import { FormikProps } from 'formik';

import BreadcrumbNav from 'components/BreadcrumbNav';
import Header from 'components/Header';
import MainContent from 'components/MainContent';
import usePrevious from 'hooks/usePrevious';
import { AppState } from 'reducers/rootReducer';
import { BusinessCaseModel } from 'types/businessCase';
import {
  clearBusinessCase,
  fetchBusinessCase,
  postBusinessCase,
  putBusinessCase
} from 'types/routines';
import { NotFoundPartial } from 'views/NotFound';

import {
  AlternativeSolutionA,
  AlternativeSolutionB
} from './AlternativeSolution';
import AsIsSolution from './AsIsSolution';
import Confirmation from './Confirmation';
import GeneralRequestInfo from './GeneralRequestInfo';
import PreferredSolution from './PreferredSolution';
import RequestDescription from './RequestDescription';
import Review from './Review';

import './index.scss';

export const BusinessCase = () => {
  const history = useHistory();
  const { businessCaseId, formPage } = useParams();
  const formikRef: any = useRef();
  const dispatch = useDispatch();
  const location = useLocation<any>();

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

  useEffect(() => {
    if (businessCase.id) {
      history.replace(`/business/${businessCase.id}/${formPage}`);
    }
  }, [history, businessCase.id, formPage]);

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
        <div className="grid-container">
          {!['local', 'dev', 'impl'].includes(
            process.env.REACT_APP_APP_ENV || ''
          ) && (
            <BreadcrumbNav className="margin-y-2">
              <li>
                <Link to="/">Home</Link>
                <i className="fa fa-angle-right margin-x-05" aria-hidden />
              </li>
              <li>Business Case</li>
            </BreadcrumbNav>
          )}
          {['local', 'dev', 'impl'].includes(
            process.env.REACT_APP_APP_ENV || ''
          ) && (
            <BreadcrumbNav className="margin-y-2">
              <li>
                <Link to="/">Home</Link>
                <i className="fa fa-angle-right margin-x-05" aria-hidden />
              </li>
              <li>
                <Link
                  to={`/governance-task-list/${businessCase.systemIntakeId}`}
                >
                  Get governance approval
                </Link>
                <i className="fa fa-angle-right margin-x-05" aria-hidden />
              </li>
              <li>Business Case</li>
            </BreadcrumbNav>
          )}
        </div>
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
                <AlternativeSolutionA
                  formikRef={formikRef}
                  dispatchSave={dispatchSave}
                  businessCase={businessCase}
                />
              )}
            />
            <SecureRoute
              path="/business/:businessCaseId/alternative-solution-b"
              render={() => (
                <AlternativeSolutionB
                  formikRef={formikRef}
                  dispatchSave={dispatchSave}
                  businessCase={businessCase}
                />
              )}
            />
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
        <div className="grid-container">
          <SecureRoute path="*" render={() => <NotFoundPartial />} />
        </div>
      </MainContent>
    </div>
  );
};

export default BusinessCase;
