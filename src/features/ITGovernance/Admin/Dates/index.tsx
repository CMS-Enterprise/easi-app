import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form, FormGroup } from '@trussworks/react-uswds';
import {
  SystemIntakeFragmentFragment,
  SystemIntakeGRBReviewType,
  useUpdateSystemIntakeGRBReviewTypeMutation,
  useUpdateSystemIntakeReviewDatesMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import CheckboxField from 'components/CheckboxField';
import DatePickerFormatted from 'components/DatePickerFormatted';
import FieldErrorMsg from 'components/FieldErrorMsg';
import FieldGroup from 'components/FieldGroup';
import HelpText from 'components/HelpText';
import Label from 'components/Label';
import PageHeading from 'components/PageHeading';
import useMessage from 'hooks/useMessage';
import { SubmitDatesForm } from 'types/systemIntake';
import { DateValidationSchema } from 'validations/systemIntakeSchema';

import { actionDateInPast } from '../Actions/ManageLcid/RetireLcid';

const Dates = ({
  systemIntake
}: {
  systemIntake: SystemIntakeFragmentFragment;
}) => {
  const { t } = useTranslation();
  const { showMessage, Message } = useMessage();
  const history = useHistory();
  const { systemId } = useParams<{ systemId: string }>();

  const [updateReviewDates] = useUpdateSystemIntakeReviewDatesMutation();

  const [updateReviewType] = useUpdateSystemIntakeGRBReviewTypeMutation();

  const { grtDate, grbDate, grbReviewStartedAt } = systemIntake;

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<SubmitDatesForm>({
    resolver: yupResolver(DateValidationSchema),
    defaultValues: {
      grtDate: grtDate ?? '',
      grbDate: grbDate ?? '',
      grbReviewType:
        systemIntake.grbReviewType || SystemIntakeGRBReviewType.STANDARD
    }
  });

  const onSubmit = async (values: SubmitDatesForm) => {
    try {
      await updateReviewType({
        variables: {
          input: {
            systemIntakeID: systemId,
            grbReviewType: values.grbReviewType
          }
        }
      });

      // ✅ Only include the date fields in the mutation if they are truthy.
      // This avoids sending empty strings to the backend, which would cause parsing errors.
      await updateReviewDates({
        variables: {
          input: {
            id: systemId,
            ...(values.grtDate ? { grtDate: values.grtDate } : {}),
            ...(values.grbReviewType !== SystemIntakeGRBReviewType.ASYNC &&
            values.grbDate
              ? { grbDate: values.grbDate }
              : {})
          }
        }
      });

      history.push(`/it-governance/${systemId}/intake-request`);
    } catch (error) {
      showMessage(t('error.message'), { type: 'error' });
    }
  };

  return (
    <>
      <PageHeading data-testid="grt-dates-view" className="margin-top-0">
        {t('governanceReviewTeam:dates.heading')}
      </PageHeading>
      <h2>{t('governanceReviewTeam:dates.subheading')}</h2>
      <Message />
      <Form onSubmit={handleSubmit(onSubmit)} className="maxw-none grid-col-8">
        <FieldGroup error={!!errors.grtDate}>
          <Controller
            control={control}
            name="grtDate"
            render={({ field: { ref, ...field }, fieldState: { error } }) => (
              <FormGroup error={!!error} className="margin-top-1">
                <Label htmlFor={field.name}>
                  {t('governanceReviewTeam:dates.grtDate.label')}
                </Label>
                {!!error?.message && (
                  <FieldErrorMsg>{error.message}</FieldErrorMsg>
                )}
                <DatePickerFormatted
                  {...field}
                  value={field.value ?? ''}
                  onChange={val => {
                    if (!val) {
                      field.onChange('');
                    } else {
                      field.onChange(val);
                    }
                  }}
                  id="grtDate"
                />

                {
                  // If past date is selected, show alert
                  field.value && actionDateInPast(field.value) && (
                    <Alert type="warning" slim>
                      {t('action:pastDateAlert')}
                    </Alert>
                  )
                }
              </FormGroup>
            )}
          />
        </FieldGroup>

        {/* GRB Dates */}
        <FieldGroup error={!!errors.grbDate}>
          <Controller
            control={control}
            name="grbDate"
            render={({ field: { ref, ...field }, fieldState: { error } }) => (
              <FormGroup error={!!error} className="margin-top-1">
                <Label htmlFor={field.name}>
                  {t('governanceReviewTeam:dates.grbDate.label')}
                </Label>
                <HelpText>
                  {t('governanceReviewTeam:dates.grbDate.description')}
                </HelpText>
                {!!error?.message && (
                  <FieldErrorMsg>{error.message}</FieldErrorMsg>
                )}
                <DatePickerFormatted
                  {...field}
                  key={watch('grbDate') || 'empty'}
                  value={field.value ?? ''}
                  onChange={val => {
                    if (!val) {
                      field.onChange('');
                    } else {
                      field.onChange(val);
                    }
                  }}
                  id="grbDate"
                  disabled={
                    watch('grbReviewType') === SystemIntakeGRBReviewType.ASYNC
                  }
                />

                {
                  // If past date is selected, show alert
                  field.value && actionDateInPast(field.value) && (
                    <Alert type="warning" slim>
                      {t('action:pastDateAlert')}
                    </Alert>
                  )
                }
              </FormGroup>
            )}
          />
        </FieldGroup>
        <Controller
          control={control}
          name="grbReviewType"
          render={({ field: { ...checkboxField } }) => {
            const { ref: ref2, ...checkboxFieldWithoutRef } = checkboxField;

            return (
              <FormGroup className="margin-top-0">
                <CheckboxField
                  {...checkboxFieldWithoutRef}
                  id={checkboxField.name}
                  value={
                    checkboxField.value || SystemIntakeGRBReviewType.STANDARD
                  }
                  checked={
                    checkboxField.value === SystemIntakeGRBReviewType.ASYNC
                  }
                  disabled={!!grbReviewStartedAt}
                  onChange={e => {
                    const isChecked = e.target.checked;
                    if (isChecked) {
                      setValue('grbDate', '');
                    }

                    checkboxField.onChange(
                      isChecked
                        ? SystemIntakeGRBReviewType.ASYNC
                        : SystemIntakeGRBReviewType.STANDARD
                    );
                  }}
                  label={t('action:progressToNewStep.asyncGRB')}
                />
              </FormGroup>
            );
          }}
        />
        <Button className="margin-top-8" type="submit">
          {t('governanceReviewTeam:dates.submit')}
        </Button>
      </Form>
    </>
  );
};

export default Dates;
