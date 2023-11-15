import React, { useContext } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { FormGroup } from '@trussworks/react-uswds';

import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import CreateSystemIntakeActionNotITGovRequestQuery from 'queries/CreateSystemIntakeActionNotITGovRequestQuery';
import {
  CreateSystemIntakeActionNotITGovRequest,
  CreateSystemIntakeActionNotITGovRequestVariables
} from 'queries/types/CreateSystemIntakeActionNotITGovRequest';
import { SystemIntakeNotITGovReqInput } from 'types/graphql-global-types';
import { NonNullableProps } from 'types/util';

import ActionForm, { SystemIntakeActionFields } from '../components/ActionForm';
import { EditsRequestedContext } from '..';

import ResolutionTitleBox from './ResolutionTitleBox';
import { ResolutionProps } from '.';

type NotGovernanceFields = NonNullableProps<
  Omit<SystemIntakeNotITGovReqInput, 'systemIntakeID'> &
    SystemIntakeActionFields
>;

const NotGovernance = ({
  systemIntakeId,
  state,
  decisionState
}: ResolutionProps) => {
  const { t } = useTranslation('action');
  const form = useForm<NotGovernanceFields>();

  const { control } = form;

  const [mutate] = useMutation<
    CreateSystemIntakeActionNotITGovRequest,
    CreateSystemIntakeActionNotITGovRequestVariables
  >(CreateSystemIntakeActionNotITGovRequestQuery, {
    refetchQueries: ['GetSystemIntake']
  });

  /** Edits requested form key for confirmation modal */
  const editsRequestedKey = useContext(EditsRequestedContext);

  /**
   * Mark as not IT Gov request on form submit
   *
   * Error and success handling is done in `<ActionForm>`
   */
  const onSubmit = async (formData: NotGovernanceFields) =>
    mutate({
      variables: {
        input: {
          systemIntakeID: systemIntakeId,
          ...formData
        }
      }
    });

  return (
    <FormProvider<NotGovernanceFields> {...form}>
      <ActionForm
        systemIntakeId={systemIntakeId}
        successMessage={t('notItGovRequest.success')}
        onSubmit={onSubmit}
        requiredFields={false}
        title={
          <ResolutionTitleBox
            title={t('resolutions.summary.notItRequest')}
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
          render={({ field: { ref, ...field } }) => (
            <FormGroup>
              <Label htmlFor={field.name} className="text-normal">
                {t('notItGovRequest.reason')}
              </Label>
              <HelpText className="margin-top-1">
                {t('notItGovRequest.reasonHelpText')}
              </HelpText>
              <TextAreaField
                {...field}
                id={field.name}
                value={field.value || ''}
                size="sm"
              />
            </FormGroup>
          )}
        />
      </ActionForm>
    </FormProvider>
  );
};

export default NotGovernance;
