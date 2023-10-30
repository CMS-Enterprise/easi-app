import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';

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
> & {
  useExistingLcid: boolean;
};

const CloseRequest = ({
  systemIntakeId,
  state,
  decisionState
}: ResolutionProps) => {
  const { t } = useTranslation('action');
  const form = useForm<CloseRequestFields>();

  const [closeRequest] = useMutation<
    CreateSystemIntakeActionCloseRequest,
    CreateSystemIntakeActionCloseRequestVariables
  >(CreateSystemIntakeActionCloseRequestQuery, {
    refetchQueries: ['GetSystemIntake']
  });

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
        title={
          <ResolutionTitleBox
            title={t('resolutions.summary.closeRequest')}
            systemIntakeId={systemIntakeId}
            state={state}
            decisionState={decisionState}
          />
        }
      >
        {/* Action fields here */}
      </ActionForm>
    </FormProvider>
  );
};

export default CloseRequest;
