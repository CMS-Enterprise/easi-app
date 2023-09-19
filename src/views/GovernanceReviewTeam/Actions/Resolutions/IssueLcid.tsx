import React, { useContext, useEffect, useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { Dropdown, FormGroup, Radio } from '@trussworks/react-uswds';

import PageLoading from 'components/PageLoading';
import DatePickerFormatted from 'components/shared/DatePickerFormatted';
import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import useCacheQuery from 'hooks/useCacheQuery';
import useMessage from 'hooks/useMessage';
import CreateSystemIntakeActionIssueLcidQuery from 'queries/CreateSystemIntakeActionIssueLcidQuery';
import GetSystemIntakesWithLCIDS from 'queries/GetSystemIntakesWithLCIDS';
import {
  CreateSystemIntakeActionIssueLcid,
  CreateSystemIntakeActionIssueLcidVariables
} from 'queries/types/CreateSystemIntakeActionIssueLcid';
import {
  GetSystemIntakesWithLCIDS as GetSystemIntakesWithLCIDSType,
  GetSystemIntakesWithLCIDS_systemIntakesWithLcids as SystemIntakeWithLcid
} from 'queries/types/GetSystemIntakesWithLCIDS';
import {
  SystemIntakeIssueLCIDInput,
  SystemIntakeTRBFollowUp
} from 'types/graphql-global-types';
import { NonNullableProps } from 'types/util';
import { issueLcidSchema } from 'validations/actionSchema';

import ActionForm, { SystemIntakeActionFields } from '../components/ActionForm';
import { EditsRequestedContext } from '..';

import ResolutionTitleBox from './ResolutionTitleBox';
import { ResolutionProps } from '.';

type IssueLcidFields = NonNullableProps<
  Omit<SystemIntakeIssueLCIDInput, 'systemIntakeID'> & SystemIntakeActionFields
> & {
  useExistingLcid: boolean;
};

const IssueLcid = ({
  systemIntakeId,
  state,
  decisionState,
  lcid
}: ResolutionProps) => {
  const { t } = useTranslation('action');

  /** Edits requested form key for confirmation modal */
  const editsRequestedKey = useContext(EditsRequestedContext);

  const [mutate] = useMutation<
    CreateSystemIntakeActionIssueLcid,
    CreateSystemIntakeActionIssueLcidVariables
  >(CreateSystemIntakeActionIssueLcidQuery, {
    refetchQueries: ['GetSystemIntake']
  });

  const { data, loading } = useCacheQuery<GetSystemIntakesWithLCIDSType>(
    GetSystemIntakesWithLCIDS
  );

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

  const form = useForm<IssueLcidFields>({
    resolver: yupResolver(issueLcidSchema),
    defaultValues: {
      lcid: '',
      scope: '',
      expiresAt: '',
      nextSteps: '',
      costBaseline: ''
    }
  });

  const { control, setValue, watch, resetField } = form;

  const { showMessageOnNextPage } = useMessage();

  /**
   * Submit handler containing mutation logic
   *
   * Error and success handling is done in `<ActionForm>`
   */
  const onSubmit = async ({
    useExistingLcid,
    ...formData
  }: IssueLcidFields) => {
    return mutate({
      variables: {
        input: {
          systemIntakeID: systemIntakeId,
          ...formData,
          lcid: useExistingLcid ? formData.lcid : ''
        }
      }
    }).then(response => {
      const newLcid =
        response?.data?.createSystemIntakeActionIssueLCID?.systemIntake?.lcid;

      // Show success message with LCID
      showMessageOnNextPage(t('manageLcid.success', { lcid: newLcid }), {
        type: 'success'
      });
    });
  };

  const existingLcid = watch('lcid');
  const useExistingLcid = watch('useExistingLcid');

  // When existing LCID is selected, populate fields
  useEffect(() => {
    if (systemIntakesWithLcids && useExistingLcid && existingLcid) {
      const selectedLcidData = systemIntakesWithLcids[existingLcid];

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

    // If user selects "Generate new life cycle ID", reset LCID fields
    if (existingLcid && useExistingLcid === false) {
      resetField('lcid');
      resetField('expiresAt');
      resetField('scope');
      resetField('nextSteps');
      resetField('costBaseline');
      resetField('trbFollowUp');
    }
  }, [
    existingLcid,
    useExistingLcid,
    systemIntakesWithLcids,
    setValue,
    resetField
  ]);

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
        {lcid ? (
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
                components={{ span: <span className="text-bold" /> }}
              />
            </p>
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
                              <Dropdown
                                {...lcidField}
                                ref={null}
                                id={field.name}
                              >
                                <option>-{t('Select')}-</option>
                                {Object.keys(systemIntakesWithLcids || {}).map(
                                  key => (
                                    <option key={key}>{key}</option>
                                  )
                                )}
                              </Dropdown>
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
              <DatePickerFormatted {...field} id={field.name} />
            </FormGroup>
          )}
        />

        <Controller
          name="scope"
          control={control}
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label htmlFor={field.name} className="text-normal" required>
                {t('issueLCID.scopeLabel')}
              </Label>
              <HelpText className="margin-top-1">
                {t('issueLCID.scopeHelpText')}
              </HelpText>
              {!!error?.message && (
                <FieldErrorMsg>{t(error.message)}</FieldErrorMsg>
              )}
              <TextAreaField
                {...field}
                id={field.name}
                size="sm"
                characterCounter={false}
              />
            </FormGroup>
          )}
        />

        <Controller
          name="nextSteps"
          control={control}
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label htmlFor={field.name} className="text-normal" required>
                {t('issueLCID.nextStepsLabel')}
              </Label>
              <HelpText className="margin-top-1">
                {t('issueLCID.nextStepsHelpText')}
              </HelpText>
              {!!error?.message && (
                <FieldErrorMsg>{t(error.message)}</FieldErrorMsg>
              )}
              <TextAreaField
                {...field}
                id={field.name}
                size="sm"
                characterCounter={false}
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
                label={t('issueLCID.trbFollowup.stronglyRecommended')}
                checked={
                  field.value === SystemIntakeTRBFollowUp.STRONGLY_RECOMMENDED
                }
              />
              <Radio
                {...field}
                id="recommendedNotCritical"
                value={SystemIntakeTRBFollowUp.RECOMMENDED_BUT_NOT_CRITICAL}
                label={t('issueLCID.trbFollowup.recommendedNotCritical')}
                checked={
                  field.value ===
                  SystemIntakeTRBFollowUp.RECOMMENDED_BUT_NOT_CRITICAL
                }
              />
              <Radio
                {...field}
                id="notRecommended"
                value={SystemIntakeTRBFollowUp.NOT_RECOMMENDED}
                label={t('issueLCID.trbFollowup.notRecommended')}
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
                characterCounter={false}
              />
            </FormGroup>
          )}
        />
      </ActionForm>
    </FormProvider>
  );
};

export default IssueLcid;
