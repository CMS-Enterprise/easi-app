import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { Form } from '@trussworks/react-uswds';

import PageHeading from 'components/PageHeading';
import Label from 'components/shared/Label';
import { RadioField, RadioGroup } from 'components/shared/RadioField';
import RequiredAsterisk from 'components/shared/RequiredAsterisk';
import Breadcrumbs from 'views/TechnicalAssistance/Breadcrumbs';
import Pager from 'views/TechnicalAssistance/RequestForm/Pager';

type ResolutionOption =
  | 'not-it-request'
  | 'issue-lcid'
  | 'not-approved'
  | 'close-request'
  | 're-open-request';

const Resolutions = ({ systemIntakeId }: { systemIntakeId: string }) => {
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

      <PageHeading className="margin-bottom-0">
        {
          // TODO: Dynamic title
          t('resolutions.title', { context: 'NO_DECISION' })
        }
      </PageHeading>
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

      <Form
        onSubmit={handleSubmit(formData =>
          history.push(`resolutions/${formData.resolution}`)
        )}
      >
        <Controller
          name="resolution"
          control={control}
          render={({ field, fieldState: { error } }) => {
            return (
              <RadioGroup>
                <Label htmlFor="resolution" className="text-normal" required>
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
    </div>
  );
};

export default Resolutions;
