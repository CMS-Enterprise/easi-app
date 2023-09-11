import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Form, Grid, SummaryBox } from '@trussworks/react-uswds';

import PageHeading from 'components/PageHeading';
import Label from 'components/shared/Label';
import { RadioField, RadioGroup } from 'components/shared/RadioField';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import {
  SystemIntakeDecisionState,
  SystemIntakeState
} from 'types/graphql-global-types';
import Breadcrumbs from 'views/TechnicalAssistance/Breadcrumbs';
import Pager from 'views/TechnicalAssistance/RequestForm/Pager';

type ResolutionOption =
  | 'not-it-request'
  | 'issue-lcid'
  | 'not-approved'
  | 'close-request'
  | 're-open-request';

type ResolutionsProps = {
  systemIntakeId: string;
  state: SystemIntakeState;
  decisionState: SystemIntakeDecisionState;
};

const Resolutions = ({
  systemIntakeId,
  state,
  decisionState
}: ResolutionsProps) => {
  const { t } = useTranslation('action');
  const history = useHistory();

  const {
    control,
    handleSubmit,
    formState: { isDirty }
  } = useForm<{
    resolution: ResolutionOption;
  }>();

  return (
    <div className="margin-bottom-10 padding-bottom-2">
      <Breadcrumbs
        items={[
          { text: t('Home'), url: '/' },
          {
            text: t('resolutions.requestDetails'),
            url: `/governance-review-team/${systemIntakeId}/intake-request`
          },
          // TODO: Dynamic breadcrumb
          { text: 'Issue decision or close request' }
        ]}
      />

      <div className="desktop:display-flex desktop:flex-align-end">
        <PageHeading className="margin-bottom-0">
          {
            // TODO: Dynamic title
            t('resolutions.title', { context: 'NO_DECISION' })
          }
        </PageHeading>
        <p className="font-body-lg text-base margin-bottom-05 margin-y-1 desktop:margin-left-2 desktop:margin-bottom-05">
          {t('resolutions.step', { step: 1 })}
        </p>
      </div>

      <p className="line-height-body-5 font-body-lg text-light margin-0">
        {
          // TODO: Dynamic description
          t('resolutions.description', { context: 'NO_DECISION' })
        }
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
            render={({ field, fieldState: { error } }) => {
              return (
                <RadioGroup>
                  <Label
                    htmlFor="resolution"
                    className="text-normal margin-top-0"
                    required
                  >
                    {t('resolutions.label')}
                  </Label>
                  <RadioField
                    {...field}
                    value="issue-lcid"
                    checked={field.value === 'issue-lcid'}
                    label={t('resolutions.summary.issueLcid')}
                    id="grt-resolution__issueLcid"
                  />

                  <RadioField
                    {...field}
                    value="not-it-request"
                    checked={field.value === 'not-it-request'}
                    label={t('resolutions.summary.notItRequest')}
                    id="grt-resolution__notItRequest"
                  />

                  <RadioField
                    {...field}
                    value="not-approved"
                    checked={field.value === 'not-approved'}
                    label={t('resolutions.summary.notApproved')}
                    id="grt-resolution__notApproved"
                  />

                  <RadioField
                    {...field}
                    value="close-request"
                    checked={field.value === 'close-request'}
                    label={t('resolutions.summary.closeRequest')}
                    id="grt-resolution__closeRequest"
                  />

                  <RadioField
                    {...field}
                    value="re-open-request"
                    checked={field.value === 're-open-request'}
                    label={t('resolutions.summary.reopenRequest')}
                    id="grt-resolution__reopenRequest"
                  />
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
          <SummaryBox
            className="grt-resolutions-summary"
            heading={t('resolutions.summary.title')}
          >
            <dl title={t('resolutions.summary.title')} className="usa-list">
              <div>
                <dt className="display-inline text-bold margin-right-05">
                  {t('resolutions.summary.issueLcid')}:
                </dt>
                <dd className="display-inline margin-0">
                  {t('resolutions.summary.issueLcidDescription')}
                </dd>
              </div>

              <div>
                <dt className="display-inline text-bold margin-right-05">
                  {t('resolutions.summary.notItRequest')}:
                </dt>
                <dd className="display-inline margin-0">
                  {t('resolutions.summary.notItRequestDescription')}
                </dd>
              </div>

              <div>
                <dt className="display-inline text-bold margin-right-05">
                  {t('resolutions.summary.notApproved')}:
                </dt>
                <dd className="display-inline margin-0">
                  {t('resolutions.summary.notApprovedDescription')}
                </dd>
              </div>

              <div>
                <dt className="display-inline text-bold margin-right-05">
                  {t('resolutions.summary.closeRequest')}:
                </dt>
                <dd className="display-inline margin-0">
                  {t('resolutions.summary.closeRequestDescription')}
                </dd>
              </div>

              <div>
                <dt className="display-inline text-bold margin-right-05">
                  {t('resolutions.summary.reopenRequest')}:
                </dt>
                <dd className="display-inline margin-0">
                  {t('resolutions.summary.reopenRequestDescription')}
                </dd>
              </div>
            </dl>
          </SummaryBox>
        </Grid>
      </Grid>
    </div>
  );
};

export default Resolutions;
