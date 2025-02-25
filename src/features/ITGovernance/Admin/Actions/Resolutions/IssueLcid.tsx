import React, { useContext, useEffect, useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormGroup, Radio, Select } from '@trussworks/react-uswds';
import {
  CreateSystemIntakeActionConfirmLCIDMutationVariables,
  CreateSystemIntakeActionIssueLCIDMutationVariables,
  useCreateSystemIntakeActionConfirmLCIDMutation,
  useCreateSystemIntakeActionIssueLCIDMutation
} from 'gql/generated/graphql';
import GetSystemIntakesWithLCIDS from 'gql/legacyGQL/GetSystemIntakesWithLCIDS';
import {
  GetSystemIntakesWithLCIDS as GetSystemIntakesWithLCIDSType,
  GetSystemIntakesWithLCIDS_systemIntakesWithLcids as SystemIntakeWithLcid
} from 'gql/legacyGQL/types/GetSystemIntakesWithLCIDS';

import Alert from 'components/Alert';
import DatePickerFormatted from 'components/DatePickerFormatted';
import FieldErrorMsg from 'components/FieldErrorMsg';
import HelpText from 'components/HelpText';
import Label from 'components/Label';
import PageLoading from 'components/PageLoading';
import RichTextEditor from 'components/RichTextEditor';
import TextAreaField from 'components/TextAreaField';
import useCacheQuery from 'hooks/useCacheQuery';
import useMessage from 'hooks/useMessage';
import {
  SystemIntakeDecisionState,
  SystemIntakeIssueLCIDInput,
  SystemIntakeTRBFollowUp
} from 'types/graphql-global-types';
import { NonNullableProps } from 'types/util';
import { lcidActionSchema } from 'validations/actionSchema';

import ActionForm, { SystemIntakeActionFields } from '../components/ActionForm';
import { actionDateInPast } from '../ManageLcid/RetireLcid';
import { EditsRequestedContext } from '..';

import refetchQueries from './refetchQueries';
import ResolutionTitleBox from './ResolutionTitleBox';
import { ResolutionProps } from '.';

type IssueLcidFields = NonNullableProps<
  Omit<SystemIntakeIssueLCIDInput, 'systemIntakeID'> & SystemIntakeActionFields
> & {
  useExistingLcid: boolean;
};

interface IssueLcidProps extends ResolutionProps {
  lcid?: string | null;
  lcidExpiresAt?: string | null;
  lcidScope?: string | null;
  decisionNextSteps?: string | null;
  trbFollowUpRecommendation?: SystemIntakeTRBFollowUp | null;
  lcidCostBaseline?: string | null;
}

/**
 * Handles both Issue LCID and Confirm LCID
 *
 * Form will have default values loaded if confirming LCID
 */
const IssueLcid = ({
  systemIntakeId,
  state,
  decisionState,
  ...systemIntake
}: IssueLcidProps) => {
  const { t } = useTranslation('action');

  const confirmingLcid =
    decisionState === SystemIntakeDecisionState.LCID_ISSUED;

  /** Edits requested form key for confirmation modal */
  const editsRequestedKey = useContext(EditsRequestedContext);

  const [mutateIssueLcid] = useCreateSystemIntakeActionIssueLCIDMutation({
    refetchQueries
  });

  const [mutateConfirmLcid] = useCreateSystemIntakeActionConfirmLCIDMutation({
    refetchQueries
  });

  const { data, loading } = useCacheQuery<GetSystemIntakesWithLCIDSType>(
    GetSystemIntakesWithLCIDS
  );

  /** System intakes with LCIDs, formatted for Use Existing LCID dropdown */
  const systemIntakesWithLcids = useMemo(() => {
    if (!data?.systemIntakesWithLcids) return undefined;

    // Restructure intakes to {LCID: SystemIntake} object
    return data?.systemIntakesWithLcids.reduce<
      Record<string, SystemIntakeWithLcid>
    >((acc, intake) => {
      if (!intake?.lcid) return acc;
      return { ...acc, [intake.lcid]: intake };
    }, {});
  }, [data]);

  /** Only pre-fill next steps, trb follow up, and cost baseline if confirming decision */
  const defaultValues: Partial<IssueLcidFields> = confirmingLcid
    ? {
        lcid: systemIntake.lcid || '',
        expiresAt: systemIntake.lcidExpiresAt || '',
        nextSteps: systemIntake.decisionNextSteps || '',
        scope: systemIntake.lcidScope || '',
        trbFollowUp: systemIntake.trbFollowUpRecommendation || undefined,
        costBaseline: systemIntake.lcidCostBaseline || ''
      }
    : {
        lcid: systemIntake.lcid || '',
        expiresAt: systemIntake.lcidExpiresAt || '',
        scope: systemIntake.lcidScope || ''
      };

  const form = useForm<IssueLcidFields>({
    resolver: yupResolver(lcidActionSchema(!!systemIntake?.lcid)),
    defaultValues
  });

  const { control, setValue, watch, resetField } = form;

  const { showMessageOnNextPage } = useMessage();

  /** Issue LCID mutation - return LCID value from response */
  const issueLcid = async (
    input: CreateSystemIntakeActionIssueLCIDMutationVariables['input']
  ) =>
    mutateIssueLcid({
      variables: {
        input
      }
    }).then(
      response =>
        response?.data?.createSystemIntakeActionIssueLCID?.systemIntake?.lcid
    );

  /** Confirm LCID mutation - returns LCID value */
  const confirmLcid = async (
    input: CreateSystemIntakeActionConfirmLCIDMutationVariables['input']
  ) =>
    mutateConfirmLcid({
      variables: {
        input
      }
    }).then(
      response =>
        response?.data?.createSystemIntakeActionConfirmLCID?.systemIntake?.lcid
    );

  /** Issue or confirm LCID on form submit */
  const onSubmit = async ({
    useExistingLcid,
    ...formData
  }: IssueLcidFields) => {
    /** Mutation input */
    const input = {
      systemIntakeID: systemIntakeId,
      ...formData
    };

    /** Returns `confirmLcid` or `issueLcid` mutation based on form action type */
    const mutation = systemIntake?.lcid ? confirmLcid : issueLcid;

    // If confirming LCID, remove LCID from mutation input
    if (systemIntake?.lcid) {
      delete input.lcid;
    }

    /** LCID value for success message from mutation response */
    const lcid = await mutation(input);

    // On success, set message on next page with updated LCID value
    return showMessageOnNextPage(t('issueLCID.success', { lcid }), {
      type: 'success'
    });
  };

  const lcid = watch('lcid');
  const useExistingLcid = watch('useExistingLcid');

  // When existing LCID is selected, populate fields
  useEffect(() => {
    if (systemIntakesWithLcids && useExistingLcid && lcid) {
      const selectedLcidData = systemIntakesWithLcids[lcid];

      if (selectedLcidData) {
        setValue('expiresAt', selectedLcidData.lcidExpiresAt || '');
        setValue('scope', selectedLcidData.lcidScope || '');
        setValue('nextSteps', selectedLcidData.decisionNextSteps || '');
        setValue('costBaseline', selectedLcidData.lcidCostBaseline || '');

        if (selectedLcidData.trbFollowUpRecommendation) {
          setValue('trbFollowUp', selectedLcidData.trbFollowUpRecommendation);
        } else {
          // If selected LCID has no trbFollowUp value, reset field
          resetField('trbFollowUp');
        }
      }
    }

    // If user selects "Generate new life cycle ID", reset LCID fields
    if (lcid && useExistingLcid === false) {
      resetField('lcid');
      resetField('expiresAt');
      resetField('scope');
      resetField('nextSteps');
      resetField('costBaseline');
      resetField('trbFollowUp');
    }
  }, [lcid, useExistingLcid, systemIntakesWithLcids, setValue, resetField]);

  if (loading) return <PageLoading />;

  return (
    <FormProvider<IssueLcidFields> {...form}>
      <ActionForm
        systemIntakeId={systemIntakeId}
        onSubmit={onSubmit}
        title={
          <ResolutionTitleBox
            title={t('resolutions.summary.issueLcid')}
            systemIntakeId={systemIntakeId}
            state={state}
            decisionState={decisionState}
          />
        }
        // Show confirmation modal if edits have been requested
        modal={
          editsRequestedKey && {
            title: t('decisionModal.title'),
            content: t('decisionModal.content', {
              action: t(`decisionModal.${editsRequestedKey}`)
            })
          }
        }
      >
        {systemIntake?.lcid ? (
          /* If confirming decision, display current LCID */
          <>
            <p className="margin-0">{t('issueLCID.lcid.label')}</p>
            <HelpText className="margin-top-1">
              {t('issueLCID.currentLcidHelpText')}
            </HelpText>
            <p className="bg-base-lightest display-inline-block padding-105 margin-bottom-0">
              <Trans
                i18nKey="action:issueLCID.currentLcid"
                values={{ lcid }}
                components={{
                  span: (
                    <span className="text-bold" data-testid="current-lcid" />
                  )
                }}
              />
            </p>
            {confirmingLcid && (
              <Alert type="info" className="margin-top-1" slim>
                {t('issueLCID.confirmLcidAlert')}
              </Alert>
            )}
          </>
        ) : (
          /* New or existing LCID fields */
          <Controller
            name="useExistingLcid"
            control={control}
            render={({
              field: { ref, value, ...field },
              fieldState: { error },
              formState: { errors }
            }) => {
              return (
                <FormGroup error={!!error || !!errors.lcid}>
                  <Label htmlFor={field.name} className="text-normal" required>
                    {t('issueLCID.lcid.label')}
                  </Label>
                  <HelpText className="margin-top-1">
                    {t('issueLCID.lcid.helpText')}
                  </HelpText>
                  {!!error?.message && (
                    <FieldErrorMsg>{t(error.message)}</FieldErrorMsg>
                  )}

                  <Radio
                    {...field}
                    value="false"
                    id="useExistingLcid_false"
                    label={t('issueLCID.lcid.new')}
                    onChange={() => setValue('useExistingLcid', false)}
                  />
                  <Radio
                    {...field}
                    value="true"
                    id="useExistingLcid_true"
                    label={t('issueLCID.lcid.existing')}
                    onChange={() => setValue('useExistingLcid', true)}
                  />

                  {
                    // Select existing LCID field
                    value && (
                      <Controller
                        name="lcid"
                        control={control}
                        render={({ field: lcidField }) => {
                          return (
                            <FormGroup className="margin-left-4">
                              <Label htmlFor="lcid">
                                {t('issueLCID.select.label')}
                              </Label>
                              <HelpText className="margin-top-1">
                                {t('issueLCID.select.helpText')}
                              </HelpText>
                              {!!errors.lcid?.message && (
                                <FieldErrorMsg>
                                  {t(errors.lcid?.message)}
                                </FieldErrorMsg>
                              )}
                              <Select {...lcidField} ref={null} id={field.name}>
                                <option>-{t('Select')}-</option>
                                {Object.keys(systemIntakesWithLcids || {}).map(
                                  key => (
                                    <option key={key}>{key}</option>
                                  )
                                )}
                              </Select>
                            </FormGroup>
                          );
                        }}
                      />
                    )
                  }
                </FormGroup>
              );
            }}
          />
        )}

        <Controller
          name="expiresAt"
          control={control}
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label htmlFor={field.name} className="text-normal" required>
                {t('issueLCID.expirationDate.label')}
              </Label>
              <HelpText className="margin-top-1">{t('mm/dd/yyyy')}</HelpText>
              {!!error?.message && (
                <FieldErrorMsg>{t(error.message)}</FieldErrorMsg>
              )}
              <DatePickerFormatted
                {...field}
                id={field.name}
                defaultValue={field.value}
              />
              {
                // If past date is selected, show alert
                actionDateInPast(field.value || null) && (
                  <Alert type="warning" slim>
                    {t('pastDateAlert')}
                  </Alert>
                )
              }
            </FormGroup>
          )}
        />

        <Controller
          name="scope"
          control={control}
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label
                id={`${field.name}-label`}
                htmlFor={field.name}
                className="text-normal"
                required
              >
                {t('issueLCID.scopeLabel')}
              </Label>
              <HelpText className="margin-top-1">
                {t('issueLCID.scopeHelpText')}
              </HelpText>
              {!!error?.message && (
                <FieldErrorMsg>{t(error.message)}</FieldErrorMsg>
              )}
              <RichTextEditor
                editableProps={{
                  id: field.name,
                  'data-testid': field.name,
                  'aria-describedby': `${field.name}-hint`,
                  'aria-labelledby': `${field.name}-label`
                }}
                field={{ ...field, ref, value: field.value || '' }}
                required
              />
            </FormGroup>
          )}
        />

        <Controller
          name="nextSteps"
          control={control}
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label
                id={`${field.name}-label`}
                htmlFor={field.name}
                className="text-normal"
                required
              >
                {t('issueLCID.nextStepsLabel')}
              </Label>
              <HelpText className="margin-top-1">
                {t('issueLCID.nextStepsHelpText')}
              </HelpText>
              {!!error?.message && (
                <FieldErrorMsg>{t(error.message)}</FieldErrorMsg>
              )}
              <RichTextEditor
                editableProps={{
                  id: field.name,
                  'data-testid': field.name,
                  'aria-describedby': `${field.name}-hint`,
                  'aria-labelledby': `${field.name}-label`
                }}
                field={{ ...field, ref, value: field.value || '' }}
                required
              />
            </FormGroup>
          )}
        />

        <Controller
          name="trbFollowUp"
          control={control}
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label htmlFor={field.name} className="text-normal" required>
                {t('issueLCID.trbFollowup.label')}
              </Label>
              {!!error?.message && (
                <FieldErrorMsg>{t(error.message)}</FieldErrorMsg>
              )}
              <Radio
                {...field}
                id="stronglyRecommended"
                value={SystemIntakeTRBFollowUp.STRONGLY_RECOMMENDED}
                label={t('issueLCID.trbFollowup.STRONGLY_RECOMMENDED')}
                checked={
                  field.value === SystemIntakeTRBFollowUp.STRONGLY_RECOMMENDED
                }
              />
              <Radio
                {...field}
                id="recommendedNotCritical"
                value={SystemIntakeTRBFollowUp.RECOMMENDED_BUT_NOT_CRITICAL}
                label={t('issueLCID.trbFollowup.RECOMMENDED_BUT_NOT_CRITICAL')}
                checked={
                  field.value ===
                  SystemIntakeTRBFollowUp.RECOMMENDED_BUT_NOT_CRITICAL
                }
              />
              <Radio
                {...field}
                id="notRecommended"
                value={SystemIntakeTRBFollowUp.NOT_RECOMMENDED}
                label={t('issueLCID.trbFollowup.NOT_RECOMMENDED')}
                checked={
                  field.value === SystemIntakeTRBFollowUp.NOT_RECOMMENDED
                }
              />
            </FormGroup>
          )}
        />

        <Controller
          name="costBaseline"
          control={control}
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label htmlFor={field.name} className="text-normal">
                {t('issueLCID.costBaselineLabel')}
              </Label>
              <HelpText className="margin-top-1">
                {t('issueLCID.costBaselineHelpText')}
              </HelpText>
              <TextAreaField
                {...field}
                value={field.value || ''}
                id={field.name}
                size="sm"
              />
            </FormGroup>
          )}
        />
      </ActionForm>
    </FormProvider>
  );
};

export default IssueLcid;
