import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  Link,
  Route,
  Switch,
  useHistory,
  useLocation,
  useParams
} from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbBar,
  BreadcrumbLink
} from '@trussworks/react-uswds';
import { FormikProps } from 'formik';

import MainContent from 'components/MainContent';
import PageLoading from 'components/PageLoading';
import useCacheQuery from 'hooks/useCacheQuery';
import usePrevious from 'hooks/usePrevious';
import GetGovernanceTaskListQuery from 'queries/GetGovernanceTaskListQuery';
import {
  GetGovernanceTaskList,
  GetGovernanceTaskListVariables
} from 'queries/types/GetGovernanceTaskList';
import { AppState } from 'reducers/rootReducer';
import { BusinessCaseModel } from 'types/businessCase';
import { SystemIntakeStep } from 'types/graphql-global-types';
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
import Confirmation from './Confirmation';
import GeneralRequestInfo from './GeneralRequestInfo';
import PreferredSolution from './PreferredSolution';
import RequestDescription from './RequestDescription';
import Review from './Review';
import BusinessCaseView from './ViewOnly';

import './index.scss';

export const BusinessCase = () => {
  const history = useHistory();
  const { businessCaseId, formPage } = useParams<{
    businessCaseId: string;
    formPage: string;
  }>();
  const formikRef: any = useRef();
  const dispatch = useDispatch();
  const location = useLocation<any>();
  const { t } = useTranslation('taskList');

  const businessCase = useSelector(
    (state: AppState) => state.businessCase.form
  );

  const isSubmitting = useSelector((state: AppState) => state.action.isPosting);

  const actionError = useSelector((state: AppState) => state.action.error);
  const prevIsSubmitting = usePrevious(isSubmitting);

  const dispatchSave = () => {
    const { current }: { current: FormikProps<BusinessCaseModel> } = formikRef;
    dispatch(
      putBusinessCase({
        ...businessCase,
        ...current.values
      })
    );
    current.resetForm({ values: current.values, errors: current.errors });
  };

  const { data, loading } = useCacheQuery<
    GetGovernanceTaskList,
    GetGovernanceTaskListVariables
  >(GetGovernanceTaskListQuery, {
    variables: {
      id: businessCase.systemIntakeId
    },
    skip: !businessCase?.systemIntakeId
  });

  const isFinal: boolean =
    data?.systemIntake?.step === SystemIntakeStep.FINAL_BUSINESS_CASE;

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
    if (prevIsSubmitting && !isSubmitting && !actionError) {
      history.push(`/business/${businessCaseId}/confirmation`);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting]);

  return (
    <MainContent className="business-case margin-bottom-5">
      <div className="grid-container">
        <BreadcrumbBar variant="wrap">
          <Breadcrumb>
            <BreadcrumbLink asCustom={Link} to="/">
              <span>Home</span>
            </BreadcrumbLink>
          </Breadcrumb>
          <Breadcrumb>
            <BreadcrumbLink
              asCustom={Link}
              to={`/governance-task-list/${businessCase.systemIntakeId}`}
            >
              <span>{t('navigation.governanceTaskList')}</span>
            </BreadcrumbLink>
          </Breadcrumb>
          <Breadcrumb current>Business Case</Breadcrumb>
        </BreadcrumbBar>
      </div>

      {loading && <PageLoading />}

      {businessCase.id && !loading && (
        <Switch>
          <Route
            path="/business/:businessCaseId/general-request-info"
            render={() => (
              <GeneralRequestInfo
                formikRef={formikRef}
                dispatchSave={dispatchSave}
                businessCase={businessCase}
                isFinal={isFinal}
              />
            )}
          />
          <Route
            path="/business/:businessCaseId/request-description"
            render={() => (
              <RequestDescription
                formikRef={formikRef}
                dispatchSave={dispatchSave}
                businessCase={businessCase}
                isFinal={isFinal}
              />
            )}
          />
          <Route
            path="/business/:businessCaseId/preferred-solution"
            render={() => (
              <PreferredSolution
                formikRef={formikRef}
                dispatchSave={dispatchSave}
                businessCase={businessCase}
                isFinal={isFinal}
              />
            )}
          />
          <Route
            path="/business/:businessCaseId/alternative-solution-a"
            render={() => (
              <AlternativeSolutionA
                formikRef={formikRef}
                dispatchSave={dispatchSave}
                businessCase={businessCase}
                isFinal={isFinal}
              />
            )}
          />
          <Route
            path="/business/:businessCaseId/alternative-solution-b"
            render={() => (
              <AlternativeSolutionB
                formikRef={formikRef}
                dispatchSave={dispatchSave}
                businessCase={businessCase}
                isFinal={isFinal}
              />
            )}
          />
          <Route
            path="/business/:businessCaseId/review"
            render={() => (
              <Review businessCase={businessCase} isFinal={isFinal} />
            )}
          />
          <Route
            path="/business/:businessCaseId/view"
            render={() => <BusinessCaseView businessCase={businessCase} />}
          />
          <Route
            path="/business/:businessCaseId/confirmation"
            render={() => <Confirmation businessCase={businessCase} />}
          />
          <Route
            path="*"
            render={() => (
              <div className="grid-container">
                <NotFoundPartial />
              </div>
            )}
          />
        </Switch>
      )}
    </MainContent>
  );
};

export default BusinessCase;
