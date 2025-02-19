import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { FormGroup } from '@trussworks/react-uswds';
import CreateSystemIntakeActionReopenRequestQuery from 'gql/legacyGQL/CreateSystemIntakeActionReopenRequestQuery';
import {
  CreateSystemIntakeActionReopenRequest,
  CreateSystemIntakeActionReopenRequestVariables
} from 'gql/legacyGQL/types/CreateSystemIntakeActionReopenRequest';

import HelpText from 'components/HelpText';
import Label from 'components/Label';
import RichTextEditor from 'components/RichTextEditor';
import { SystemIntakeReopenRequestInput } from 'types/graphql-global-types';
import { NonNullableProps } from 'types/util';

import ActionForm, { SystemIntakeActionFields } from '../components/ActionForm';

import refetchQueries from './refetchQueries';
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
    refetchQueries
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
        notificationAlertWarn
      >
        <Controller
          name="reason"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <FormGroup>
              <Label
                id={`${field.name}-label`}
                htmlFor={field.name}
                className="text-normal"
              >
                {t('reopenRequest.reason')}
              </Label>
              <HelpText className="margin-top-1">
                {t('reopenRequest.reasonHelpText')}
              </HelpText>
              <RichTextEditor
                editableProps={{
                  id: field.name,
                  'data-testid': field.name,
                  'aria-describedby': `${field.name}-hint`,
                  'aria-labelledby': `${field.name}-label`
                }}
                field={{ ...field, value: field.value || '' }}
              />
            </FormGroup>
          )}
        />
      </ActionForm>
    </FormProvider>
  );
};

export default ReopenRequest;
