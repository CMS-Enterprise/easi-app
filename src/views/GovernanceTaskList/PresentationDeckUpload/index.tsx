import React from 'react';
import { Controller } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { FileInput, Form, FormGroup, Icon } from '@trussworks/react-uswds';

import { useEasiForm } from 'components/EasiForm';
import { Alert } from 'components/shared/Alert';
import IconLink from 'components/shared/IconLink';
import Label from 'components/shared/Label';
import useMessage from 'hooks/useMessage';
import GetSystemIntakeQuery from 'queries/GetSystemIntakeQuery';
import { CreateSystemIntakeDocumentQuery } from 'queries/SystemIntakeDocumentQueries';
import {
  CreateSystemIntakeDocument,
  CreateSystemIntakeDocumentVariables
} from 'queries/types/CreateSystemIntakeDocument';
import { CreateSystemIntakeDocumentInput } from 'types/graphql-global-types';
import { fileToBase64File } from 'utils/downloadFile';
import { documentSchema } from 'validations/systemIntakeSchema';
import Pager from 'views/TechnicalAssistance/RequestForm/Pager';

type DocumentUploadFields = Omit<CreateSystemIntakeDocumentInput, 'requestID'>;

type UploadFormProps = {
  type: 'admin' | 'requester';
};

/**
 * Presentation deck document upload form
 */
const PresentationDeckUpload = ({ type = 'requester' }: UploadFormProps) => {
  const { t } = useTranslation('grbReview');

  const history = useHistory();

  const { systemId } = useParams<{
    systemId: string;
  }>();

  const { Message, showMessageOnNextPage, showMessage } = useMessage();

  const [createDocument] = useMutation<
    CreateSystemIntakeDocument,
    CreateSystemIntakeDocumentVariables
  >(CreateSystemIntakeDocumentQuery, {
    refetchQueries: [
      {
        query: GetSystemIntakeQuery,
        variables: {
          id: systemId
        }
      }
    ]
  });

  const {
    control,
    register,
    watch,
    handleSubmit,
    formState: { isSubmitting, errors, isValid }
  } = useEasiForm<DocumentUploadFields>({
    resolver: yupResolver(documentSchema),
    context: { type }
  });

  const requestDetailsLink =
    type === 'requester'
      ? `/governance-task-list/${systemId}`
      : `/it-governance/${systemId}/grb-review`;

  const submit = handleSubmit(async ({ otherTypeDescription, ...formData }) => {
    const newFile = await fileToBase64File(formData.fileData);
    createDocument({
      variables: {
        input: {
          fileData: newFile,
          version: formData.version,
          documentType: formData.documentType,
          // If type is set to 'Other', include description field
          ...(formData.documentType === 'OTHER'
            ? { otherTypeDescription }
            : {}),
          requestID: systemId,
          sendNotification: formData.sendNotification
        }
      }
    })
      .then(() => {
        showMessageOnNextPage(
          t('presentationLinks.presentationUpload.success'),
          {
            type: 'success'
          }
        );
        history.push(requestDetailsLink);
      })
      .catch(() => {
        showMessage(t('presentationLinks.presentationUpload.error'), {
          type: 'error',
          className: 'margin-top-4'
        });
      });
  });

  return (
    <>
      <Message />

      <div className="tablet:grid-col-12 desktop:grid-col-8 margin-top-6 margin-bottom-8 padding-bottom-4">
        <h1 className="margin-bottom-1">
          {t('presentationLinks.presentationUpload.header')}
        </h1>

        <p className="margin-top-1 margin-bottom-2 font-body-md line-height-body-5 text-light">
          {t('presentationLinks.presentationUpload.description')}
        </p>

        <IconLink to={requestDetailsLink} icon={<Icon.ArrowBack />}>
          {type === 'requester'
            ? t('presentationLinks.presentationUpload.dontUploadRequester')
            : t('presentationLinks.presentationUpload.dontUploadAdmin')}
        </IconLink>

        <Form className="maxw-full" onSubmit={submit}>
          {/* Upload field */}
          <FormGroup error={!!errors.fileData} className="margin-top-5">
            <Label htmlFor="fileData">
              {t('presentationLinks.presentationUpload.selectFile')}
            </Label>

            <p className="usa-hint margin-bottom-0 margin-top-05">
              {t('presentationLinks.presentationUpload.recommendedFileTypes')}
            </p>

            <Controller
              control={control}
              name="fileData"
              render={({ field: { value, ...field } }) => (
                <FileInput
                  {...field}
                  id={field.name}
                  name={field.name}
                  onChange={e => {
                    field.onChange(e.currentTarget?.files?.[0]);
                  }}
                  accept=".pdf,.ppt,.pptx"
                />
              )}
            />
          </FormGroup>

          <Alert type="info" slim className="margin-top-5">
            {t('presentationLinks.uploadAlert')}
          </Alert>

          <Pager
            next={{
              text: t('presentationLinks.presentationUpload.upload'),
              disabled: !isValid || isSubmitting
            }}
            taskListUrl={requestDetailsLink}
            saveExitText={
              type === 'requester'
                ? t('presentationLinks.presentationUpload.dontUploadRequester')
                : t('presentationLinks.presentationUpload.dontUploadAdmin')
            }
            border={false}
            className="margin-top-4"
          />
        </Form>
      </div>
    </>
  );
};

export default PresentationDeckUpload;
