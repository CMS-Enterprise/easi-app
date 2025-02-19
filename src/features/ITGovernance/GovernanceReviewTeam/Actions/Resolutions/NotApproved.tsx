import React, { useContext } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormGroup, Radio } from '@trussworks/react-uswds';
import CreateSystemIntakeActionRejectIntakeQuery from 'gql/legacyGQL/CreateSystemIntakeActionRejectIntakeQuery';
import {
  CreateSystemIntakeActionRejectIntake,
  CreateSystemIntakeActionRejectIntakeVariables
} from 'gql/legacyGQL/types/CreateSystemIntakeActionRejectIntake';

import FieldErrorMsg from 'components/FieldErrorMsg';
import HelpText from 'components/HelpText';
import Label from 'components/Label';
import RichTextEditor from 'components/RichTextEditor';
import {
  SystemIntakeDecisionState,
  SystemIntakeRejectIntakeInput,
  SystemIntakeTRBFollowUp
} from 'types/graphql-global-types';
import { NonNullableProps } from 'types/util';
import { notApprovedSchema } from 'validations/actionSchema';

import ActionForm, { SystemIntakeActionFields } from '../components/ActionForm';
import { EditsRequestedContext } from '..';

import refetchQueries from './refetchQueries';
import ResolutionTitleBox from './ResolutionTitleBox';
import { ResolutionProps } from '.';

type NotApprovedFields = NonNullableProps<
  Omit<SystemIntakeRejectIntakeInput, 'systemIntakeID'> &
    SystemIntakeActionFields
>;

interface NotApprovedProps extends ResolutionProps {
  rejectionReason?: string | null;
  decisionNextSteps?: string | null;
  trbFollowUpRecommendation?: SystemIntakeTRBFollowUp | null;
}

const NotApproved = ({
  systemIntakeId,
  state,
  decisionState,
  ...systemIntake
}: NotApprovedProps) => {
  const { t } = useTranslation('action');

  /** Edits requested form key for confirmation modal */
  const editsRequestedKey = useContext(EditsRequestedContext);

  const [rejectIntake] = useMutation<
    CreateSystemIntakeActionRejectIntake,
    CreateSystemIntakeActionRejectIntakeVariables
  >(CreateSystemIntakeActionRejectIntakeQuery, {
    refetchQueries
  });

  /** Set default values if confirming decision */
  const defaultValues =
    decisionState === SystemIntakeDecisionState.NOT_APPROVED
      ? {
          reason: systemIntake?.rejectionReason || '',
          nextSteps: systemIntake?.decisionNextSteps || '',
          trbFollowUp: systemIntake?.trbFollowUpRecommendation || undefined
        }
      : {};

  const form = useForm<NotApprovedFields>({
    resolver: yupResolver(notApprovedSchema),
    defaultValues
  });

  const { control } = form;

  /**
   * Reject intake on form submit
   *
   * Error and success handling is done in `<ActionForm>`
   */
  const onSubmit = async (formData: NotApprovedFields) =>
    rejectIntake({
      variables: {
        input: {
          systemIntakeID: systemIntakeId,
          ...formData
        }
      }
    });

  return (
    <FormProvider<NotApprovedFields> {...form}>
      <ActionForm
        systemIntakeId={systemIntakeId}
        successMessage={t('notApproved.success')}
        onSubmit={onSubmit}
        errorKeyContext="notApproved"
        title={
          <ResolutionTitleBox
            title={t('resolutions.summary.notApproved')}
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
        <Controller
          name="reason"
          control={control}
          render={({ field: { ref, ...field }, fieldState: { error } }) => (
            <FormGroup error={!!error}>
              <Label htmlFor={field.name} className="text-normal" required>
                {t('notApproved.reason')}
              </Label>
              <HelpText className="margin-top-1">
                {t('notApproved.reasonHelpText')}
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
                field={{ ...field, value: field.value || '' }}
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
                {t('notApproved.nextStepsHelpText')},
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
                field={{ ...field, value: field.value || '' }}
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
      </ActionForm>
    </FormProvider>
  );
};

export default NotApproved;
