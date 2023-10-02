import React, { createContext, useMemo } from 'react';
import { Controller, ControllerRenderProps, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Route, Switch, useHistory } from 'react-router-dom';
import { Button, Radio } from '@trussworks/react-uswds';

import PageHeading from 'components/PageHeading';
import PageLoading from 'components/PageLoading';
import CollapsableLink from 'components/shared/CollapsableLink';
import { RadioGroup } from 'components/shared/RadioField';
import useCacheQuery from 'hooks/useCacheQuery';
import GetGovernanceTaskListQuery from 'queries/GetGovernanceTaskListQuery';
import {
  GetGovernanceTaskList,
  GetGovernanceTaskListVariables
} from 'queries/types/GetGovernanceTaskList';
import { SystemIntake } from 'queries/types/SystemIntake';
import {
  ITGovDraftBusinessCaseStatus,
  ITGovFinalBusinessCaseStatus,
  ITGovIntakeFormStatus,
  SystemIntakeState
} from 'types/graphql-global-types';

import ManageLcid from './ManageLcid';
import NextStep from './NextStep';
import RequestEdits from './RequestEdits';
import Resolutions from './Resolutions';

import './index.scss';

type ActionRadioOptionProps = {
  label: string;
  description: string;
  accordionText: string;
} & Omit<ControllerRenderProps, 'ref'>;

const ActionRadioOption = ({
  label,
  description,
  accordionText,
  ...field
}: ActionRadioOptionProps) => {
  const { t } = useTranslation('action');

  return (
    <Radio
      {...field}
      className="grt-action-radio__option margin-bottom-2 tablet:grid-col-5"
      id={`grt-action__${field.value}`}
      label={t('chooseAction.selectAction')}
      title={label}
      labelDescription={
        <>
          <h3 className="margin-top-2 margin-bottom-0">{label}</h3>
          <p className="margin-0 text-base font-body-sm line-height-body-5">
            {description}
          </p>
          <CollapsableLink
            className="margin-top-2"
            id="grt-action-radio__accordion"
            label={t('chooseAction.accordionLabel')}
          >
            <p className="line-height-body-4 font-body-md margin-0">
              {accordionText}
            </p>
          </CollapsableLink>
        </>
      }
      tile
    />
  );
};

export type ActionsProps = {
  systemIntake: SystemIntake;
};

export type EditsRequestedKey =
  | 'intakeRequest'
  | 'draftBusinessCase'
  | 'finalBusinessCase'
  | undefined;

/**
 * Edits requested context - returns form key if edits have been requested on a form
 *
 * Used in form confirmation modal
 */
export const EditsRequestedContext = createContext<EditsRequestedKey>(
  undefined
);

const Actions = ({ systemIntake }: ActionsProps) => {
  const history = useHistory();
  const { t } = useTranslation('action');

  const { state, decisionState, lcidStatus } = systemIntake;

  const { data, loading } = useCacheQuery<
    GetGovernanceTaskList,
    GetGovernanceTaskListVariables
  >(GetGovernanceTaskListQuery, {
    variables: {
      id: systemIntake.id
    }
  });
  const taskStatuses = data?.systemIntake?.itGovTaskStatuses;

  /**
   * Translation key for edits requested form type - used in EditsRequestedContext
   */
  const editsRequestedKey: EditsRequestedKey = useMemo(() => {
    if (
      taskStatuses?.intakeFormStatus === ITGovIntakeFormStatus.EDITS_REQUESTED
    ) {
      return 'intakeRequest';
    }
    if (
      taskStatuses?.bizCaseDraftStatus ===
      ITGovDraftBusinessCaseStatus.EDITS_REQUESTED
    ) {
      return 'draftBusinessCase';
    }
    if (
      taskStatuses?.bizCaseFinalStatus ===
      ITGovFinalBusinessCaseStatus.EDITS_REQUESTED
    ) {
      return 'finalBusinessCase';
    }
    return undefined;
  }, [taskStatuses]);

  const { control, watch, handleSubmit } = useForm<{ actionRoute: string }>();
  const actionRoute = watch('actionRoute');

  if (loading) return <PageLoading />;

  return (
    <EditsRequestedContext.Provider value={editsRequestedKey}>
      <div className="grt-admin-actions">
        <Switch>
          <Route
            path="/governance-review-team/:systemId/actions/request-edits"
            render={() => <RequestEdits systemIntakeId={systemIntake.id} />}
          />

          <Route
            path="/governance-review-team/:systemId/actions/next-step"
            render={() => <NextStep systemIntakeId={systemIntake.id} />}
          />

          {/* Select resolution page */}
          <Route
            path="/governance-review-team/:systemId/resolutions/:subPage?"
            render={() => <Resolutions systemIntake={systemIntake} />}
          />

          {/* Manage LCID page */}
          <Route
            path="/governance-review-team/:systemId/manage-lcid/:subPage?"
            render={() => (
              <ManageLcid
                systemIntakeId={systemIntake.id}
                lcidStatus={lcidStatus}
              />
            )}
          />

          {/* Select action main page */}
          <Route path="/governance-review-team/:systemId/actions">
            <PageHeading
              data-testid="grt-actions-view"
              className="margin-top-0 margin-bottom-5"
            >
              {t('chooseAction.heading')}
            </PageHeading>

            <form
              onSubmit={handleSubmit(formData =>
                history.push(formData.actionRoute)
              )}
              className="margin-bottom-4"
            >
              <Controller
                name="actionRoute"
                control={control}
                render={({ field: { ref, ...fieldProps } }) => {
                  return (
                    <RadioGroup className="grt-actions-radio-group grid-row grid-gap-md">
                      {state === SystemIntakeState.OPEN && (
                        <>
                          {/* Request Edits */}
                          <ActionRadioOption
                            {...fieldProps}
                            value="actions/request-edits"
                            label={t('chooseAction.requestEdits.title')}
                            description={t(
                              'chooseAction.requestEdits.description'
                            )}
                            accordionText={t(
                              'chooseAction.requestEdits.accordion'
                            )}
                          />
                          {/* Progress to new step */}
                          <ActionRadioOption
                            {...fieldProps}
                            value="actions/next-step"
                            label={t('chooseAction.progressToNewStep.title')}
                            description={t(
                              'chooseAction.progressToNewStep.description'
                            )}
                            accordionText={t(
                              'chooseAction.progressToNewStep.accordion'
                            )}
                          />
                        </>
                      )}

                      {/* Decision action */}
                      <ActionRadioOption
                        {...fieldProps}
                        value="resolutions"
                        label={t(`chooseAction.decision${state}.title`, {
                          context: decisionState
                        })}
                        description={t(
                          `chooseAction.decision${state}.description`,
                          {
                            context: decisionState
                          }
                        )}
                        accordionText={t(
                          `chooseAction.decision${state}.accordion`,
                          {
                            context: decisionState
                          }
                        )}
                      />

                      {
                        /* Manage LCID */
                        lcidStatus && (
                          <ActionRadioOption
                            {...fieldProps}
                            value="manage-lcid"
                            label={t('manageLcid.title')}
                            description={t(
                              'chooseAction.manageLcid.description'
                            )}
                            accordionText={t(
                              'chooseAction.manageLcid.accordion',
                              {
                                context: lcidStatus
                              }
                            )}
                          />
                        )
                      }
                    </RadioGroup>
                  );
                }}
              />

              <Button
                className="margin-top-3"
                type="submit"
                disabled={!actionRoute}
              >
                {t('submitAction.continue')}
              </Button>
            </form>
          </Route>
        </Switch>
      </div>
    </EditsRequestedContext.Provider>
  );
};

export default Actions;
