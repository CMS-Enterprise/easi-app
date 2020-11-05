import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';

import ActionBanner from 'components/shared/ActionBanner';
import { useFlags } from 'contexts/flagContext';
import { AppState } from 'reducers/rootReducer';
import { Flags } from 'types/flags';
import { fetchSystemIntakes } from 'types/routines';
import { SystemIntakeForm } from 'types/systemIntake';

const SystemIntakeBanners = () => {
  const { authState } = useOktaAuth();
  const dispatch = useDispatch();
  const systemIntakes = useSelector(
    (state: AppState) => state.systemIntakes.systemIntakes
  );
  const flags = useFlags();
  const history = useHistory();

  useEffect(() => {
    if (authState.isAuthenticated) {
      dispatch(fetchSystemIntakes());
    }
  }, [dispatch, authState.isAuthenticated]);

  const getSystemIntakeBanners = (featureFlags: Flags) => {
    const rootPath = featureFlags.taskListLite
      ? '/governance-task-list'
      : '/system';
    return systemIntakes.map((intake: SystemIntakeForm) => {
      switch (intake.status) {
        case 'INTAKE_DRAFT':
          return (
            <ActionBanner
              key={intake.id}
              title={
                intake.requestName
                  ? `${intake.requestName}: Intake Request`
                  : 'Intake Request'
              }
              helpfulText="Your Intake Request is incomplete, please submit it when you are ready so that we can move you to the next phase"
              onClick={() => {
                history.push(`${rootPath}/${intake.id}`);
              }}
              label="Go to Intake Request"
              data-intakeid={intake.id}
            />
          );
        case 'INTAKE_SUBMITTED':
          if (intake.businessCaseId !== null) {
            return null;
          }
          return (
            <ActionBanner
              key={intake.id}
              title={
                intake.requestName
                  ? `${intake.requestName}: Business Case`
                  : 'Business Case'
              }
              helpfulText="Your intake form has been submitted. The admin team will be in touch with you to fill out a Business Case"
              onClick={() => {
                history.push({
                  pathname: flags.taskListLite
                    ? `/governance-task-list/${intake.id}`
                    : '/business/new/general-request-info',
                  ...((!flags.taskListLite && {
                    state: {
                      systemIntakeId: intake.id
                    }
                  }) as {})
                });
              }}
              label="Start my Business Case"
              data-intakeid={intake.id}
            />
          );
        case 'BIZ_CASE_DRAFT':
          return (
            <ActionBanner
              key={intake.id}
              title={
                intake.requestName
                  ? `${intake.requestName}: Business Case incomplete`
                  : 'Business Case incomplete'
              }
              helpfulText="Your Business Case is incomplete, please submit it when you are ready so that we can move you to the next phase"
              onClick={() => {
                history.push({
                  // ToDo: where do we get the biz case ID to put in "???????"
                  pathname: flags.taskListLite
                    ? `/governance-task-list/${intake.id}`
                    : '/business/???????????/general-request-info',
                  ...((!flags.taskListLite && {
                    state: {
                      systemIntakeId: intake.id
                    }
                  }) as {})
                });
              }}
              label="Go to Business Case"
            />
          );
        default:
          return null;
      }
    });
  };

  return <>{getSystemIntakeBanners(flags)}</>;
};

export default SystemIntakeBanners;
