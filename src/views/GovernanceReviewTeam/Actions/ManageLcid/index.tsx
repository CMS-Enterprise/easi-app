import React, { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { Route, Switch, useHistory, useParams } from 'react-router-dom';
import { Form, Grid } from '@trussworks/react-uswds';

import PageHeading from 'components/PageHeading';
import Alert from 'components/shared/Alert';
import Label from 'components/shared/Label';
import { RadioField, RadioGroup } from 'components/shared/RadioField';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import { SystemIntakeLCIDStatus } from 'types/graphql-global-types';
import { formatDateLocal } from 'utils/date';
import NotFound from 'views/NotFound';
import Breadcrumbs from 'views/TechnicalAssistance/Breadcrumbs';
import Pager from 'views/TechnicalAssistance/RequestForm/Pager';

import ActionsSummary from '../components/ActionsSummary';
import { ActionsProps } from '..';

import ExpireLcid from './ExpireLcid';
import RetireLcid from './RetireLcid';
import UpdateLcid from './UpdateLcid';

export interface ManageLcidProps {
  systemIntakeId: string;
  lcidStatus: SystemIntakeLCIDStatus | null;
}

type LcidAction = 'update' | 'retire' | 'expire';

const ManageLcid = ({ systemIntake }: ActionsProps) => {
  const { t } = useTranslation('action');
  const history = useHistory();

  const { id: systemIntakeId, lcidStatus, lcid, lcidRetiresAt } = systemIntake;

  const { subPage } = useParams<{
    subPage?: string;
  }>();

  const {
    control,
    handleSubmit,
    formState: { isDirty }
  } = useForm<{
    action: LcidAction;
  }>();

  // Returns true if LCID is marked for future retirement
  const hasFutureRetireDate =
    lcidStatus === SystemIntakeLCIDStatus.ISSUED && !!lcidRetiresAt;

  /**
   * LCID status context for displaying options and translation text
   *
   * If `lcidRetiresAt` is set, should return RETIRED. Otherwise, return `lcidStatus`.
   */
  const lcidStatusContext = useMemo(
    () => (lcidRetiresAt ? SystemIntakeLCIDStatus.RETIRED : lcidStatus),
    [lcidStatus, lcidRetiresAt]
  );

  /** Available action options based on the lcidStatusContext */
  const actionOptions = useMemo(() => {
    if (!lcidStatusContext) return [];

    const options = ['retire', 'update'];

    if (lcidStatusContext === SystemIntakeLCIDStatus.ISSUED) {
      options.push('expire');
    }

    return options;
  }, [lcidStatusContext]);

  // Show page not found if no LCID or action is not available
  if (!lcid || !lcidStatus || (subPage && !actionOptions.includes(subPage))) {
    return <NotFound />;
  }

  return (
    <>
      <Breadcrumbs
        items={[
          { text: t('Home'), url: '/' },
          {
            text: t('resolutions.requestDetails'),
            url: `/governance-review-team/${systemIntakeId}/intake-request`
          },
          {
            text: t('manageLcid.breadcrumb')
          }
        ]}
      />

      <Switch>
        <Route path="/governance-review-team/:sytemId/manage-lcid/retire">
          <RetireLcid {...systemIntake} systemIntakeId={systemIntakeId} />
        </Route>
        <Route path="/governance-review-team/:sytemId/manage-lcid/update">
          <UpdateLcid
            {...systemIntake}
            lcid={lcid}
            systemIntakeId={systemIntakeId}
          />
        </Route>
        <Route path="/governance-review-team/:sytemId/manage-lcid/expire">
          <ExpireLcid {...systemIntake} systemIntakeId={systemIntakeId} />
        </Route>

        <Route path="/governance-review-team/:sytemId/manage-lcid">
          <div className="desktop:display-flex desktop:flex-align-end">
            <PageHeading className="margin-bottom-0">
              {t('manageLcid.title')}
            </PageHeading>
            <p className="font-body-lg text-base margin-bottom-05 margin-y-1 desktop:margin-left-2 desktop:margin-bottom-05">
              {t('resolutions.step', { step: 1 })}
            </p>
          </div>

          <p className="line-height-body-5 font-body-lg text-light margin-0">
            {t('manageLcid.description', {
              context: hasFutureRetireDate
                ? 'FUTURE_RETIRE_DATE'
                : lcidStatusContext
            })}
          </p>

          <p className="margin-top-1 text-base">
            <Trans
              i18nKey="action:fieldsMarkedRequired"
              components={{ asterisk: <RequiredAsterisk /> }}
            />
          </p>

          <Grid className="grid-row grid-gap margin-top-6 margin-bottom-10 padding-bottom-2">
            <Form
              onSubmit={handleSubmit(formData =>
                history.push(`manage-lcid/${formData.action}`)
              )}
              className="maxw-none margin-bottom-6 tablet:grid-col-6"
            >
              <Controller
                name="action"
                control={control}
                render={({ field: { ref, ...field } }) => {
                  return (
                    <RadioGroup>
                      <Label
                        htmlFor="action"
                        className="text-normal margin-top-0"
                        required
                      >
                        {t('manageLcid.label')}
                      </Label>

                      {lcidRetiresAt && (
                        <Alert type="warning" slim>
                          {t('manageLcid.retireDateWarning', {
                            date: formatDateLocal(lcidRetiresAt, 'MM/dd/yyyy'),
                            context: lcidStatus
                          })}
                        </Alert>
                      )}

                      {actionOptions.map(action => (
                        <RadioField
                          {...field}
                          key={action}
                          value={action}
                          checked={field.value === action}
                          label={t(`manageLcid.${action}`, {
                            context: lcidStatusContext
                          })}
                          id={`grt-lcid-action__${action}`}
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
                taskListUrl={`/governance-review-team/${systemIntakeId}/actions`}
                className="margin-top-6"
                border={false}
                submitDisabled
              />
            </Form>

            <Grid className="tablet:grid-col-6">
              <ActionsSummary
                heading={t('manageLcid.summary.title')}
                items={actionOptions.map(action => {
                  return {
                    title: t(`action:manageLcid.summary.${action}`),
                    description: t(
                      `action:manageLcid.summary.${action}Description`
                    )
                  };
                })}
              />
            </Grid>
          </Grid>
        </Route>
      </Switch>
    </>
  );
};

export default ManageLcid;
