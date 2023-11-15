import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { FormGroup } from '@trussworks/react-uswds';

import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import CreateSystemIntakeActionReopenRequestQuery from 'queries/CreateSystemIntakeActionReopenRequestQuery';
import {
  CreateSystemIntakeActionReopenRequest,
  CreateSystemIntakeActionReopenRequestVariables
} from 'queries/types/CreateSystemIntakeActionReopenRequest';
import { SystemIntakeReopenRequestInput } from 'types/graphql-global-types';
import { NonNullableProps } from 'types/util';

import ActionForm, { SystemIntakeActionFields } from '../components/ActionForm';

import ResolutionTitleBox from './ResolutionTitleBox';
import { ResolutionProps } from '.';

type ReopenRequestFields = NonNullableProps<
  Omit<SystemIntakeReopenRequestInput, 'systemIntakeID'> &
    SystemIntakeActionFields
>;

const ReopenRequest = ({
  systemIntakeId,
  state,
  decisionState
}: ResolutionProps) => {
  const { t } = useTranslation('action');

  const [reopenRequest] = useMutation<
    CreateSystemIntakeActionReopenRequest,
    CreateSystemIntakeActionReopenRequestVariables
  >(CreateSystemIntakeActionReopenRequestQuery, {
    refetchQueries: ['GetSystemIntake']
  });

  const form = useForm<ReopenRequestFields>();
  const { control } = form;

  /**
   * Reopen request on form submit
   *
   * Error and success handling is done in `<ActionForm>`
   */
  const onSubmit = async (formData: ReopenRequestFields) =>
    reopenRequest({
      variables: {
        input: {
          systemIntakeID: systemIntakeId,
          ...formData
        }
      }
    });

  return (
    <FormProvider<ReopenRequestFields> {...form}>
      <ActionForm
        systemIntakeId={systemIntakeId}
        successMessage={t('reopenRequest.success')}
        onSubmit={onSubmit}
        requiredFields={false}
        title={
          <ResolutionTitleBox
            title={t('resolutions.summary.reOpenRequest')}
            systemIntakeId={systemIntakeId}
            state={state}
            decisionState={decisionState}
          />
        }
      >
        <Controller
          name="reason"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <FormGroup>
              <Label htmlFor={field.name} className="text-normal">
                {t('reopenRequest.reason')}
              </Label>
              <HelpText className="margin-top-1">
                {t('reopenRequest.reasonHelpText')}
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

export default ReopenRequest;
