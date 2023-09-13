import React, { useMemo } from 'react';
import { Controller, ControllerRenderProps, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useParams } from 'react-router-dom';
import { Form, Grid } from '@trussworks/react-uswds';
import { camelCase } from 'lodash';

import PageHeading from 'components/PageHeading';
import Label from 'components/shared/Label';
import { RadioField, RadioGroup } from 'components/shared/RadioField';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import {
  SystemIntakeDecisionState,
  SystemIntakeState
} from 'types/graphql-global-types';
import NotFound from 'views/NotFound';
import Breadcrumbs from 'views/TechnicalAssistance/Breadcrumbs';
import Pager from 'views/TechnicalAssistance/RequestForm/Pager';

import ActionsSummary from './components/ActionsSummary';
import ResolutionBox from './components/ResolutionBox';
import CloseRequest from './CloseRequest';
import IssueLcid from './IssueLcid';
import NotApproved from './NotApproved';
import NotGovernance from './NotGovernance';
import ReopenRequest from './ReopenRequest';

type ResolutionOption =
  | 'not-it-request'
  | 'issue-lcid'
  | 'not-approved'
  | 'close-request'
  | 're-open-request';

const decisionsMap: Partial<
  Record<SystemIntakeDecisionState, ResolutionOption>
> = {
  [SystemIntakeDecisionState.LCID_ISSUED]: 'issue-lcid',
  [SystemIntakeDecisionState.NOT_GOVERNANCE]: 'not-it-request',
  [SystemIntakeDecisionState.NOT_APPROVED]: 'not-approved'
};

type ResolutionsProps = {
  systemIntakeId: string;
  state: SystemIntakeState;
  decisionState: SystemIntakeDecisionState;
};

type ResolutionFieldProps = {
  fieldKey: ResolutionOption;
  decision: SystemIntakeDecisionState;
} & Omit<
  ControllerRenderProps<{
    resolution: ResolutionOption;
  }>,
  'ref'
>;

/** Radio field for resolution options */
const ResolutionField = ({
  fieldKey,
  decision,
  ...field
}: ResolutionFieldProps) => {
  const { t } = useTranslation('action');

  const currentDecision: boolean = fieldKey === decisionsMap[decision];

  const label = t(`resolutions.summary.${camelCase(fieldKey)}`);

  return (
    <RadioField
      {...field}
      value={fieldKey}
      checked={field.value === fieldKey}
      label={
        currentDecision
          ? t('resolutions.confirmDecision', { decision: label })
          : label
      }
      id={`grt-resolution__${fieldKey}`}
    />
  );
};

const Resolutions = ({
  systemIntakeId,
  state,
  decisionState
}: ResolutionsProps) => {
  const { t } = useTranslation('action');
  const history = useHistory();

  const { subPage } = useParams<{
    subPage?: string;
  }>();

  const {
    control,
    handleSubmit,
    formState: { isDirty }
  } = useForm<{
    resolution: ResolutionOption;
  }>();

  /**
   * List of resolution field keys
   *
   * If decision is set, moves that field to front of list
   */
  const decisionOptions: ResolutionOption[] = useMemo(() => {
    const decision = decisionsMap[decisionState];

    /** Default options if no decision */
    const options = Object.values(decisionsMap);

    // Add close or re-open request to list of options
    options.push(
      state === SystemIntakeState.OPEN ? 'close-request' : 're-open-request'
    );

    // If no decision, return options
    if (!decision) return options;

    // If decision is set, move to front of options
    return [decision, ...options.filter(option => option !== decision)];
  }, [decisionState, state]);

  // Show page not found if resolution is not available
  if (subPage && !decisionOptions.includes(subPage as ResolutionOption)) {
    return <NotFound />;
  }

  return (
    <div className="margin-bottom-10 padding-bottom-2">
      <Breadcrumbs
        items={[
          { text: t('Home'), url: '/' },
          {
            text: t('resolutions.requestDetails'),
            url: `/governance-review-team/${systemIntakeId}/intake-request`
          },
          {
            text: t('resolutions.breadcrumb', {
              context: decisionState,
              action: t('resolutions.action', { context: state })
            })
          }
        ]}
      />

      <div className="desktop:display-flex desktop:flex-align-end">
        <PageHeading className="margin-bottom-0">
          {t('resolutions.title', {
            context: decisionState,
            action: t('resolutions.action', { context: state })
          })}
        </PageHeading>
        <p className="font-body-lg text-base margin-bottom-05 margin-y-1 desktop:margin-left-2 desktop:margin-bottom-05">
          {t('resolutions.step', { step: subPage ? 2 : 1 })}
        </p>
      </div>

      {subPage && (
        <ResolutionBox
          systemIntakeId={systemIntakeId}
          title={t(`resolutions.summary.${camelCase(subPage)}`)}
        />
      )}

      <Switch>
        <Route path="/governance-review-team/:systemId/resolutions/issue-lcid">
          <IssueLcid systemIntakeId={systemIntakeId} />
        </Route>
        <Route path="/governance-review-team/:systemId/resolutions/not-it-request">
          <NotGovernance systemIntakeId={systemIntakeId} />
        </Route>
        <Route path="/governance-review-team/:systemId/resolutions/not-approved">
          <NotApproved systemIntakeId={systemIntakeId} />
        </Route>
        <Route path="/governance-review-team/:systemId/resolutions/close-request">
          <CloseRequest systemIntakeId={systemIntakeId} />
        </Route>
        <Route path="/governance-review-team/:systemId/resolutions/re-open-request">
          <ReopenRequest systemIntakeId={systemIntakeId} />
        </Route>

        <Route path="/governance-review-team/:systemId/resolutions">
          <p className="line-height-body-5 font-body-lg text-light margin-0">
            {t('resolutions.description', {
              context: decisionState,
              descriptionAction: t('resolutions.descriptionAction', {
                context: state
              })
            })}
          </p>

          <p className="margin-top-1 text-base">
            <Trans
              i18nKey="action:fieldsMarkedRequired"
              components={{ asterisk: <RequiredAsterisk /> }}
            />
          </p>

          <Grid className="grid-row grid-gap margin-top-6">
            <Form
              onSubmit={handleSubmit(formData =>
                history.push(`resolutions/${formData.resolution}`)
              )}
              className="maxw-none margin-bottom-6 tablet:grid-col-6"
            >
              <Controller
                name="resolution"
                control={control}
                render={({ field: { ref, ...field } }) => {
                  return (
                    <RadioGroup>
                      <Label
                        htmlFor="resolution"
                        className="text-normal margin-top-0"
                        required
                      >
                        {t('resolutions.label')}
                      </Label>

                      {decisionOptions.map(decisionKey => (
                        <ResolutionField
                          {...field}
                          decision={decisionState}
                          fieldKey={decisionKey}
                          key={decisionKey}
                        />
                      ))}
                    </RadioGroup>
                  );
                }}
              />

              <Pager
                next={{
                  type: 'submit',
                  disabled: !isDirty
                }}
                saveExitText={t('cancelAction')}
                taskListUrl={`/governance-review-team/${systemIntakeId}/intake-request`}
                className="margin-top-6"
                border={false}
                submitDisabled
              />
            </Form>
            <Grid className="tablet:grid-col-6">
              <ActionsSummary
                heading={t('resolutions.summary.title')}
                items={decisionOptions.map(decisionKey => {
                  const translationKey = camelCase(decisionKey);
                  return {
                    title: t(`action:resolutions.summary.${translationKey}`),
                    description: t(
                      `action:resolutions.summary.${translationKey}Description`
                    )
                  };
                })}
              />
            </Grid>
          </Grid>
        </Route>
      </Switch>
    </div>
  );
};

export default Resolutions;
