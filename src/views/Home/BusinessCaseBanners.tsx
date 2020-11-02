import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';

import ActionBanner from 'components/shared/ActionBanner';
import { useFlags } from 'contexts/flagContext';
import { AppState } from 'reducers/rootReducer';
import { BusinessCaseModel } from 'types/businessCase';
import { Flags } from 'types/flags';
import { fetchBusinessCases } from 'types/routines';

const BusinessCaseBanners = () => {
  const history = useHistory();
  const { authState } = useOktaAuth();
  const dispatch = useDispatch();
  const businessCases = useSelector(
    (state: AppState) => state.businessCases.businessCases
  );

  useEffect(() => {
    if (authState.isAuthenticated) {
      dispatch(fetchBusinessCases());
    }
  }, [dispatch, authState.isAuthenticated]);

  const flags = useFlags();

  const getBusinessCaseBanners = (featureFlag: Flags) => {
    return businessCases.map((busCase: BusinessCaseModel) => {
      const path = featureFlag.taskListLite
        ? `/governance-task-list/${busCase.systemIntakeId}`
        : `/business/${busCase.id}/general-request-info`;
      switch (busCase.status) {
        case 'DRAFT':
          return (
            <ActionBanner
              key={busCase.id}
              title={
                busCase.requestName
                  ? `${busCase.requestName}: Business Case`
                  : 'Business Case'
              }
              helpfulText="Your Business Case is incomplete, please submit it when you are ready so that we can move you to the next phase"
              onClick={() => {
                history.push(path);
              }}
              label="Go to Business Case"
            />
          );
        case 'SUBMITTED':
          return (
            <ActionBanner
              key={busCase.id}
              title={
                busCase.requestName
                  ? `${busCase.requestName}: Business Case`
                  : 'Business Case'
              }
              helpfulText="The form has been submitted for review. You can update it and re-submit it any time in the process"
              onClick={() => {
                history.push(path);
              }}
              label="Update Business Case"
            />
          );
        default:
          return null;
      }
    });
  };

  return <>{getBusinessCaseBanners(flags)}</>;
};

export default BusinessCaseBanners;
