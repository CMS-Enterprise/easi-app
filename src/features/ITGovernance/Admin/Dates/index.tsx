import React, { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Form, FormGroup, TextInput } from '@trussworks/react-uswds';
import {
  SystemIntakeFragmentFragment,
  SystemIntakeGRBReviewType,
  useUpdateSystemIntakeGRBReviewTypeMutation,
  useUpdateSystemIntakeReviewDatesMutation
} from 'gql/generated/graphql';
import { DateTime } from 'luxon';

import CheckboxField from 'components/CheckboxField';
import HelpText from 'components/HelpText';
import Label from 'components/Label';
import PageHeading from 'components/PageHeading';
import { GRBReviewStatus } from 'types/grbReview';
import { SubmitDatesForm } from 'types/systemIntake';
import { parseAsUTC } from 'utils/date';
import { DateValidationSchema } from 'validations/systemIntakeSchema';

const Dates = ({
  systemIntake
}: {
  systemIntake: SystemIntakeFragmentFragment;
}) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { systemId } = useParams<{ systemId: string }>();

  const [updateReviewDates] = useUpdateSystemIntakeReviewDatesMutation({
    errorPolicy: 'all'
  });

  const [updateReviewType] = useUpdateSystemIntakeGRBReviewTypeMutation();

  const {
    grtDate,
    grbDate,
    grbReviewStartedAt,
    grbReviewStandardStatus,
    grbReviewAsyncStatus
  } = systemIntake;
  const parsedGrbDate = grbDate ? parseAsUTC(grbDate) : null;
  const parsedGrtDate = grtDate ? parseAsUTC(grtDate) : null;

  // TODO: Fix Text Field so we don't have to set initial empty values
  const initialValues: SubmitDatesForm & {
    grbReviewType: SystemIntakeGRBReviewType;
  } = {
    grtDateDay: grtDate && parsedGrtDate ? String(parsedGrtDate.day) : '',
    grtDateMonth: grtDate && parsedGrtDate ? String(parsedGrtDate.month) : '',
    grtDateYear: grtDate && parsedGrtDate ? String(parsedGrtDate.year) : '',
    grbDateDay: grbDate && parsedGrbDate ? String(parsedGrbDate.day) : '',
    grbDateMonth: grbDate && parsedGrbDate ? String(parsedGrbDate.month) : '',
    grbDateYear: grbDate && parsedGrbDate ? String(parsedGrbDate.year) : '',
    grbReviewType: systemIntake.grbReviewType
  };

  const { control, handleSubmit, watch, setValue } = useForm<
    SubmitDatesForm & {
      grbReviewType: SystemIntakeGRBReviewType;
    }
  >({
    defaultValues: initialValues,
    resolver: yupResolver(DateValidationSchema)
  });

  const onSubmit = async (
    values: SubmitDatesForm & {
      grbReviewType: SystemIntakeGRBReviewType;
    }
  ) => {
    const {
      grtDateDay,
      grtDateMonth,
      grtDateYear,
      grbDateMonth,
      grbDateDay,
      grbDateYear,
      grbReviewType
    } = values;

    const updateType = updateReviewType({
      variables: {
        input: {
          systemIntakeID: systemId,
          grbReviewType
        }
      }
    });

    if (grbReviewType === SystemIntakeGRBReviewType.ASYNC) {
      await updateType;
      history.push(`/it-governance/${systemId}/intake-request`);
    } else {
      await updateType;

      const newGrtDate = DateTime.fromObject(
        {
          day: Number(grtDateDay),
          month: Number(grtDateMonth),
          year: Number(grtDateYear)
        },
        { zone: 'UTC' }
      ).toISO();

      const newGrbDate = DateTime.fromObject(
        {
          day: Number(grbDateDay),
          month: Number(grbDateMonth),
          year: Number(grbDateYear)
        },
        { zone: 'UTC' }
      ).toISO();

      await updateReviewDates({
        variables: {
          input: {
            id: systemId,
            grtDate: newGrtDate,
            grbDate: newGrbDate
          }
        }
      });

      history.push(`/it-governance/${systemId}/intake-request`);
    }
  };

  /**
   * Returns the correct status data for the review type,
   * or NOT_STARTED if status is null
   */
  const grbReviewStatus: GRBReviewStatus | null | undefined = useMemo(() => {
    if (!grbReviewStartedAt) return 'NOT_STARTED';

    return systemIntake.grbReviewType === SystemIntakeGRBReviewType.STANDARD
      ? grbReviewStandardStatus
      : grbReviewAsyncStatus;
  }, [
    grbReviewAsyncStatus,
    grbReviewStandardStatus,
    grbReviewStartedAt,
    systemIntake.grbReviewType
  ]);

  const reviewIsInProgress: boolean =
    grbReviewStatus !== 'NOT_STARTED' && grbReviewStatus !== 'COMPLETED';

  if (!grbReviewStatus) {
    return null;
  }

  return (
    <>
      <PageHeading data-testid="grt-dates-view" className="margin-top-0">
        {t('governanceReviewTeam:dates.heading')}
      </PageHeading>
      <h2>{t('governanceReviewTeam:dates.subheading')}</h2>
      <Form onSubmit={handleSubmit(onSubmit)} className="maxw-mobile-lg">
        <fieldset className="usa-fieldset margin-top-4">
          <legend className="usa-label margin-bottom-1">
            {t('governanceReviewTeam:dates.grtDate.label')}
          </legend>
          <HelpText id="TestDate-DateHelp-grt">
            {t('governanceReviewTeam:dates.grtDate.format')}
          </HelpText>
          <div className="usa-memorable-date">
            <div className="usa-form-group usa-form-group--month">
              <Controller
                name="grtDateMonth"
                control={control}
                render={({
                  field: { ref, ...rest },
                  fieldState: { error }
                }) => (
                  <FormGroup className="margin-top-2" error={!!error}>
                    <Label className="text-normal" htmlFor="grtDateMonth">
                      {t('general:date.month')}
                    </Label>

                    <TextInput
                      {...rest}
                      id="grtDateMonth"
                      type="text"
                      validationStatus={error && 'error'}
                    />
                  </FormGroup>
                )}
              />
            </div>
            <div className="usa-form-group usa-form-group--day">
              <Controller
                name="grtDateDay"
                control={control}
                render={({
                  field: { ref, ...rest },
                  fieldState: { error }
                }) => (
                  <FormGroup className="margin-top-2" error={!!error}>
                    <Label className="text-normal" htmlFor="grtDateDay">
                      {t('general:date.day')}
                    </Label>

                    <TextInput
                      {...rest}
                      id="grtDateDay"
                      type="text"
                      validationStatus={error && 'error'}
                    />
                  </FormGroup>
                )}
              />
            </div>
            <div className="usa-form-group usa-form-group--year">
              <Controller
                name="grtDateYear"
                control={control}
                render={({
                  field: { ref, ...rest },
                  fieldState: { error }
                }) => (
                  <FormGroup className="margin-top-2" error={!!error}>
                    <Label className="text-normal" htmlFor="grtDateYear">
                      {t('general:date.year')}
                    </Label>

                    <TextInput
                      {...rest}
                      id="grtDateYear"
                      type="text"
                      validationStatus={error && 'error'}
                    />
                  </FormGroup>
                )}
              />
            </div>
          </div>
        </fieldset>

        {/* GRB Dates */}
        <fieldset className="usa-fieldset margin-top-4">
          <legend className="usa-label margin-bottom-1">
            {t('governanceReviewTeam:dates.grbDate.label')}
          </legend>
          <HelpText id="TestDate-DateHelp-grb" className="text-pre-line">
            {t('governanceReviewTeam:dates.grbDate.description')}
          </HelpText>
          <div className="usa-memorable-date">
            <div className="usa-form-group usa-form-group--month">
              <Controller
                name="grbDateMonth"
                control={control}
                render={({
                  field: { ref, ...rest },
                  fieldState: { error }
                }) => (
                  <FormGroup className="margin-top-2" error={!!error}>
                    <Label className="text-normal" htmlFor="grbDateMonth">
                      {t('general:date.month')}
                    </Label>

                    <TextInput
                      {...rest}
                      id="grbDateMonth"
                      type="text"
                      validationStatus={error && 'error'}
                      disabled={
                        watch('grbReviewType') ===
                        SystemIntakeGRBReviewType.ASYNC
                      }
                    />
                  </FormGroup>
                )}
              />
            </div>
            <div className="usa-form-group usa-form-group--day">
              <Controller
                name="grbDateDay"
                control={control}
                render={({
                  field: { ref, ...rest },
                  fieldState: { error }
                }) => (
                  <FormGroup className="margin-top-2" error={!!error}>
                    <Label className="text-normal" htmlFor="grbDateDay">
                      {t('general:date.day')}
                    </Label>

                    <TextInput
                      {...rest}
                      id="grbDateDay"
                      type="text"
                      validationStatus={error && 'error'}
                      disabled={
                        watch('grbReviewType') ===
                        SystemIntakeGRBReviewType.ASYNC
                      }
                    />
                  </FormGroup>
                )}
              />
            </div>
            <div className="usa-form-group usa-form-group--year">
              <Controller
                name="grbDateYear"
                control={control}
                render={({
                  field: { ref, ...rest },
                  fieldState: { error }
                }) => (
                  <FormGroup className="margin-top-2" error={!!error}>
                    <Label className="text-normal" htmlFor="grbDateYear">
                      {t('general:date.year')}
                    </Label>

                    <TextInput
                      {...rest}
                      id="grbDateYear"
                      type="text"
                      validationStatus={error && 'error'}
                      disabled={
                        watch('grbReviewType') ===
                        SystemIntakeGRBReviewType.ASYNC
                      }
                    />
                  </FormGroup>
                )}
              />
            </div>
          </div>
        </fieldset>
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
                  disabled={reviewIsInProgress}
                  onChange={e => {
                    const isChecked = e.target.checked;
                    if (isChecked) {
                      setValue('grbDateMonth', '');
                      setValue('grbDateDay', '');
                      setValue('grbDateYear', '');
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
