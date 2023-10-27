import React, { useContext } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormGroup, Radio } from '@trussworks/react-uswds';

import FieldErrorMsg from 'components/shared/FieldErrorMsg';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import CreateSystemIntakeActionRejectIntakeQuery from 'queries/CreateSystemIntakeActionRejectIntakeQuery';
import {
  CreateSystemIntakeActionRejectIntake,
  CreateSystemIntakeActionRejectIntakeVariables
} from 'queries/types/CreateSystemIntakeActionRejectIntake';
import {
  SystemIntakeRejectIntakeInput,
  SystemIntakeTRBFollowUp
} from 'types/graphql-global-types';
import { NonNullableProps } from 'types/util';
import { notApprovedSchema } from 'validations/actionSchema';

import ActionForm, { SystemIntakeActionFields } from '../components/ActionForm';
import { EditsRequestedContext } from '..';

import ResolutionTitleBox from './ResolutionTitleBox';
import { ResolutionProps } from '.';

type NotApprovedFields = NonNullableProps<
  Omit<SystemIntakeRejectIntakeInput, 'systemIntakeID'> &
    SystemIntakeActionFields
>;

const NotApproved = ({
  systemIntakeId,
  state,
  decisionState
}: ResolutionProps) => {
  const { t } = useTranslation('action');

  /** Edits requested form key for confirmation modal */
  const editsRequestedKey = useContext(EditsRequestedContext);

  const [rejectIntake] = useMutation<
    CreateSystemIntakeActionRejectIntake,
    CreateSystemIntakeActionRejectIntakeVariables
  >(CreateSystemIntakeActionRejectIntakeQuery);

  const form = useForm<NotApprovedFields>({
    resolver: yupResolver(notApprovedSchema)
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
                {t('notApproved.nextStepsHelpText')},
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
