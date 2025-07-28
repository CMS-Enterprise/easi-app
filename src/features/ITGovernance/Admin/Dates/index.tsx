import React from 'react';
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
import FieldErrorMsg from 'components/FieldErrorMsg';
import FieldGroup from 'components/FieldGroup';
import HelpText from 'components/HelpText';
import Label from 'components/Label';
import PageHeading from 'components/PageHeading';
import useMessage from 'hooks/useMessage';
import { SubmitDatesForm } from 'types/systemIntake';
import { parseAsUTC } from 'utils/date';
import { DateValidationSchema } from 'validations/systemIntakeSchema';

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
  const parsedGrbDate = grbDate ? parseAsUTC(grbDate) : null;
  const parsedGrtDate = grtDate ? parseAsUTC(grtDate) : null;

  // TODO: Fix Text Field so we don't have to set initial empty values
  const initialValues: SubmitDatesForm = {
    grtDateDay: grtDate && parsedGrtDate ? String(parsedGrtDate.day) : '',
    grtDateMonth: grtDate && parsedGrtDate ? String(parsedGrtDate.month) : '',
    grtDateYear: grtDate && parsedGrtDate ? String(parsedGrtDate.year) : '',
    grbDateDay: grbDate && parsedGrbDate ? String(parsedGrbDate.day) : '',
    grbDateMonth: grbDate && parsedGrbDate ? String(parsedGrbDate.month) : '',
    grbDateYear: grbDate && parsedGrbDate ? String(parsedGrbDate.year) : '',
    grbReviewType:
      systemIntake.grbReviewType || SystemIntakeGRBReviewType.STANDARD
  };

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<SubmitDatesForm>({
    defaultValues: initialValues,
    resolver: yupResolver(DateValidationSchema)
  });

  const onSubmit = async (values: SubmitDatesForm) => {
    try {
      const {
        grtDateDay,
        grtDateMonth,
        grtDateYear,
        grbDateMonth,
        grbDateDay,
        grbDateYear,
        grbReviewType
      } = values;

      await updateReviewType({
        variables: {
          input: {
            systemIntakeID: systemId,
            grbReviewType
          }
        }
      });

      const newGrtDate = DateTime.fromObject(
        {
          day: Number(grtDateDay),
          month: Number(grtDateMonth),
          year: Number(grtDateYear)
        },
        { zone: 'UTC' }
      ).toISO();

      let newGrbDate: string | null = null;
      if (grbReviewType !== SystemIntakeGRBReviewType.ASYNC) {
        newGrbDate = DateTime.fromObject(
          {
            day: Number(grbDateDay),
            month: Number(grbDateMonth),
            year: Number(grbDateYear)
          },
          { zone: 'UTC' }
        ).toISO();
      }

      await updateReviewDates({
        variables: {
          input: {
            id: systemId,
            grtDate: newGrtDate,
            ...(newGrbDate ? { grbDate: newGrbDate } : {})
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
        <FieldGroup
          error={
            !!errors.grtDateDay || !!errors.grtDateMonth || !!errors.grtDateYear
          }
        >
          <fieldset className="usa-fieldset margin-top-4">
            <legend className="usa-label margin-bottom-1">
              {t('governanceReviewTeam:dates.grtDate.label')}
            </legend>
            <HelpText id="TestDate-DateHelp-grt">
              {t('governanceReviewTeam:dates.grtDate.format')}
            </HelpText>
            <FieldErrorMsg>{errors.grtDateMonth?.message}</FieldErrorMsg>
            <FieldErrorMsg>{errors.grtDateDay?.message}</FieldErrorMsg>
            <FieldErrorMsg>{errors.grtDateYear?.message}</FieldErrorMsg>
            <div className="usa-memorable-date">
              <Controller
                name="grtDateMonth"
                control={control}
                render={({
                  field: { ref, ...rest },
                  fieldState: { error }
                }) => (
                  <FormGroup className="usa-form-group--month margin-top-2">
                    <Label className="text-normal" htmlFor="grtDateMonth">
                      {t('general:date.month')}
                    </Label>

                    <TextInput
                      {...rest}
                      inputRef={ref}
                      id="grtDateMonth"
                      type="text"
                      validationStatus={error && 'error'}
                    />
                  </FormGroup>
                )}
              />
              <Controller
                name="grtDateDay"
                control={control}
                render={({
                  field: { ref, ...rest },
                  fieldState: { error }
                }) => (
                  <FormGroup className="margin-top-2 usa-form-group--day">
                    <Label className="text-normal" htmlFor="grtDateDay">
                      {t('general:date.day')}
                    </Label>

                    <TextInput
                      {...rest}
                      inputRef={ref}
                      id="grtDateDay"
                      type="text"
                      validationStatus={error && 'error'}
                    />
                  </FormGroup>
                )}
              />
              <Controller
                name="grtDateYear"
                control={control}
                render={({
                  field: { ref, ...rest },
                  fieldState: { error }
                }) => (
                  <FormGroup className="margin-top-2 usa-form-group--year">
                    <Label className="text-normal" htmlFor="grtDateYear">
                      {t('general:date.year')}
                    </Label>

                    <TextInput
                      {...rest}
                      inputRef={ref}
                      id="grtDateYear"
                      type="text"
                      validationStatus={error && 'error'}
                    />
                  </FormGroup>
                )}
              />
            </div>
          </fieldset>
        </FieldGroup>

        {/* GRB Dates */}
        <FieldGroup
          error={
            !!errors.grbDateDay || !!errors.grbDateMonth || !!errors.grbDateYear
          }
        >
          <fieldset className="usa-fieldset margin-top-4">
            <legend className="usa-label margin-bottom-1">
              {t('governanceReviewTeam:dates.grbDate.label')}
            </legend>
            <HelpText id="TestDate-DateHelp-grb" className="text-pre-line">
              {`${t('governanceReviewTeam:dates.grbDate.description')}
            ${t('governanceReviewTeam:dates.grtDate.format')}`}
            </HelpText>
            <FieldErrorMsg>{errors.grbDateMonth?.message}</FieldErrorMsg>
            <FieldErrorMsg>{errors.grbDateDay?.message}</FieldErrorMsg>
            <FieldErrorMsg>{errors.grbDateYear?.message}</FieldErrorMsg>
            <div className="usa-memorable-date">
              <Controller
                name="grbDateMonth"
                control={control}
                render={({
                  field: { ref, ...rest },
                  fieldState: { error }
                }) => (
                  <FormGroup className="margin-top-2 usa-form-group--month">
                    <Label className="text-normal" htmlFor="grbDateMonth">
                      {t('general:date.month')}
                    </Label>

                    <TextInput
                      {...rest}
                      inputRef={ref}
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
              <Controller
                name="grbDateDay"
                control={control}
                render={({
                  field: { ref, ...rest },
                  fieldState: { error }
                }) => (
                  <FormGroup className="margin-top-2 usa-form-group--day">
                    <Label className="text-normal" htmlFor="grbDateDay">
                      {t('general:date.day')}
                    </Label>

                    <TextInput
                      {...rest}
                      inputRef={ref}
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
              <Controller
                name="grbDateYear"
                control={control}
                render={({
                  field: { ref, ...rest },
                  fieldState: { error }
                }) => (
                  <FormGroup className="margin-top-2 usa-form-group--year">
                    <Label className="text-normal" htmlFor="grbDateYear">
                      {t('general:date.year')}
                    </Label>

                    <TextInput
                      {...rest}
                      inputRef={ref}
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
          </fieldset>
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
