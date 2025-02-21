import React, { useContext, useMemo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { FormGroup } from '@trussworks/react-uswds';
import CreateSystemIntakeActionCloseRequestQuery from 'gql/legacyGQL/CreateSystemIntakeActionCloseRequestQuery';
import {
  CreateSystemIntakeActionCloseRequest,
  CreateSystemIntakeActionCloseRequestVariables
} from 'gql/legacyGQL/types/CreateSystemIntakeActionCloseRequest';

import HelpText from 'components/HelpText';
import Label from 'components/Label';
import RichTextEditor from 'components/RichTextEditor';
import {
  SystemIntakeCloseRequestInput,
  SystemIntakeLCIDStatus
} from 'types/graphql-global-types';
import { NonNullableProps } from 'types/util';

import ActionForm, { SystemIntakeActionFields } from '../components/ActionForm';
import { EditsRequestedContext } from '..';

import refetchQueries from './refetchQueries';
import ResolutionTitleBox from './ResolutionTitleBox';
import { ResolutionProps } from '.';

type CloseRequestFields = NonNullableProps<
  Omit<SystemIntakeCloseRequestInput, 'systemIntakeID'> &
    SystemIntakeActionFields
>;

interface CloseRequestProps extends ResolutionProps {
  lcid: string | null;
  lcidStatus: SystemIntakeLCIDStatus | null;
}

const CloseRequest = ({
  systemIntakeId,
  state,
  decisionState,
  lcid,
  lcidStatus
}: CloseRequestProps) => {
  const { t } = useTranslation('action');

  /** Edits requested form key for confirmation modal */
  const editsRequestedKey = useContext(EditsRequestedContext);

  const [closeRequest] = useMutation<
    CreateSystemIntakeActionCloseRequest,
    CreateSystemIntakeActionCloseRequestVariables
  >(CreateSystemIntakeActionCloseRequestQuery, {
    refetchQueries
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

  /** Returns modal props if edits are requested or lcid has been issued */
  const modal = useMemo(() => {
    if (editsRequestedKey) {
      return {
        title: t('decisionModal.title'),
        content: t('decisionModal.content', {
          action: t(`decisionModal.${editsRequestedKey}`)
        })
      };
    }

    if (lcidStatus === SystemIntakeLCIDStatus.ISSUED) {
      return {
        title: t('closeRequest.modal.title', { lcid }),
        content: t('closeRequest.modal.content')
      };
    }

    return undefined;
  }, [editsRequestedKey, lcid, lcidStatus, t]);

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
        modal={modal}
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
                {t('closeRequest.reason')}
              </Label>
              <HelpText className="margin-top-1">
                {t('closeRequest.reasonHelpText')}
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

export default CloseRequest;
