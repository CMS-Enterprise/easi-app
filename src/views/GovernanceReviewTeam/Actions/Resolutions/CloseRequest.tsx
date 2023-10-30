import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { FormGroup } from '@trussworks/react-uswds';

import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import TextAreaField from 'components/shared/TextAreaField';
import CreateSystemIntakeActionCloseRequestQuery from 'queries/CreateSystemIntakeActionCloseRequestQuery';
import {
  CreateSystemIntakeActionCloseRequest,
  CreateSystemIntakeActionCloseRequestVariables
} from 'queries/types/CreateSystemIntakeActionCloseRequest';
import { SystemIntakeCloseRequestInput } from 'types/graphql-global-types';
import { NonNullableProps } from 'types/util';

import ActionForm, { SystemIntakeActionFields } from '../components/ActionForm';

import ResolutionTitleBox from './ResolutionTitleBox';
import { ResolutionProps } from '.';

type CloseRequestFields = NonNullableProps<
  Omit<SystemIntakeCloseRequestInput, 'systemIntakeID'> &
    SystemIntakeActionFields
>;

const CloseRequest = ({
  systemIntakeId,
  state,
  decisionState
}: ResolutionProps) => {
  const { t } = useTranslation('action');

  const [closeRequest] = useMutation<
    CreateSystemIntakeActionCloseRequest,
    CreateSystemIntakeActionCloseRequestVariables
  >(CreateSystemIntakeActionCloseRequestQuery, {
    refetchQueries: ['GetSystemIntake']
  });

  const form = useForm<CloseRequestFields>();
  const { control } = form;

  /**
   * Close request on form submit
   *
   * Error and success handling is done in `<ActionForm>`
   */
  const onSubmit = async (formData: CloseRequestFields) =>
    closeRequest({
      variables: {
        input: {
          systemIntakeID: systemIntakeId,
          ...formData
        }
      }
    });

  return (
    <FormProvider<CloseRequestFields> {...form}>
      <ActionForm
        systemIntakeId={systemIntakeId}
        successMessage={t('closeRequest.success')}
        onSubmit={onSubmit}
        requiredFields={false}
        title={
          <ResolutionTitleBox
            title={t('resolutions.summary.closeRequest')}
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
                {t('closeRequest.reason')}
              </Label>
              <HelpText className="margin-top-1">
                {t('closeRequest.reasonHelpText')}
              </HelpText>
              <TextAreaField
                {...field}
                id={field.name}
                value={field.value || ''}
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

export default CloseRequest;
