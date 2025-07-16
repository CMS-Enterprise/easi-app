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
  const { showMessage } = useMessage();
  const history = useHistory();
  const { systemId } = useParams<{ systemId: string }>();

  const [updateReviewDates] = useUpdateSystemIntakeReviewDatesMutation({
    errorPolicy: 'all'
  });

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

      // ✅ Normalize grtDate
      // If the user selected a date, keep the ISO string.
      // If it's empty (""), undefined, or just whitespace, set it to null.
      const normalizedGrtDate =
        values.grtDate && values.grtDate.trim() !== '' ? values.grtDate : null;

      // ✅ Normalize grbDate
      let normalizedGrbDate: string | null = null;

      // Only include grbDate if the review type is NOT ASYNC
      if (values.grbReviewType !== SystemIntakeGRBReviewType.ASYNC) {
        if (values.grbDate && values.grbDate.trim() !== '') {
          normalizedGrbDate = values.grbDate;
        } else {
          normalizedGrbDate = null; // explicitly set null if empty
        }
      }

      // ✅ Only include the date fields in the mutation if they are truthy.
      // This avoids sending empty strings to the backend, which would cause parsing errors.
      await updateReviewDates({
        variables: {
          input: {
            id: systemId,
            ...(normalizedGrtDate ? { grtDate: normalizedGrtDate } : {}),
            ...(normalizedGrbDate ? { grbDate: normalizedGrbDate } : {})
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
                  <FieldErrorMsg>{t(error.message)}</FieldErrorMsg>
                )}
                <DatePickerFormatted
                  {...field}
                  // Fix for empty string throwing off field validation
                  onChange={e => field.onChange(e || undefined)}
                  value={field.value || ''}
                  id="meetingDate"
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
            disabled={
              watch('grbReviewType') === SystemIntakeGRBReviewType.ASYNC
            }
            render={({ field: { ref, ...field }, fieldState: { error } }) => (
              <FormGroup error={!!error} className="margin-top-1">
                <Label htmlFor={field.name}>
                  {t('governanceReviewTeam:dates.grbDate.label')}
                </Label>
                <HelpText>
                  {t('governanceReviewTeam:dates.grbDate.description')}
                </HelpText>
                {!!error?.message && (
                  <FieldErrorMsg>{t(error.message)}</FieldErrorMsg>
                )}
                <DatePickerFormatted
                  {...field}
                  // Fix for empty string throwing off field validation
                  onChange={e => field.onChange(e || undefined)}
                  value={field.value || ''}
                  id="meetingDate"
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
