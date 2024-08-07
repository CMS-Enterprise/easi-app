import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  ErrorMessage,
  Fieldset,
  FileInput,
  Form,
  FormGroup,
  IconArrowBack,
  Radio,
  TextInput
} from '@trussworks/react-uswds';

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

type DocumentUploadFields = Omit<CreateSystemIntakeDocumentInput, 'requestID'>;

/**
 * System intake document upload form
 */
const UploadForm = () => {
  const { t } = useTranslation();

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
    watch,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<DocumentUploadFields>({
    resolver: yupResolver(documentSchema)
  });

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
          requestID: systemId
        }
      }
    })
      .then(() => {
        showMessageOnNextPage(
          t('technicalAssistance:documents.upload.success'),
          {
            type: 'success'
          }
        );
        history.push(`/system/${systemId}/documents`);
      })
      .catch(() => {
        showMessage(t('technicalAssistance:documents.upload.error'), {
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
          {t('technicalAssistance:documents.upload.title')}
        </h1>
        <p className="margin-top-1 font-body-md line-height-body-5">
          {t('intake:documents.formDescription')}
        </p>
        <IconLink to={`/system/${systemId}/documents`} icon={<IconArrowBack />}>
          {t('intake:documents.returnToIntake')}
        </IconLink>

        <Form className="maxw-full" onSubmit={submit}>
          {/* Upload field */}
          <Controller
            name="fileData"
            control={control}
            render={({ field, fieldState: { error } }) => {
              return (
                <FormGroup error={!!error} className="margin-top-5">
                  <Label htmlFor={field.name}>
                    {t('intake:documents.selectDocument')}
                  </Label>
                  <span className="usa-hint">
                    {t('technicalAssistance:documents.upload.docType')}
                  </span>
                  {error && (
                    <ErrorMessage>
                      {t('technicalAssistance:errors.selectFile')}
                    </ErrorMessage>
                  )}
                  <FileInput
                    id={field.name}
                    name={field.name}
                    onBlur={field.onBlur}
                    onChange={e => {
                      field.onChange(e.currentTarget?.files?.[0]);
                    }}
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                  />
                </FormGroup>
              );
            }}
          />

          {/* Document type */}
          <Controller
            name="documentType"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormGroup error={!!error}>
                <Fieldset
                  legend={
                    <span className="text-bold">
                      {t('technicalAssistance:documents.upload.whatType')}
                    </span>
                  }
                >
                  {error && (
                    <ErrorMessage>
                      {t('technicalAssistance:errors.makeSelection')}
                    </ErrorMessage>
                  )}
                  {Object.keys(
                    t('intake:documents.type', { returnObjects: true })
                  ).map(val => (
                    <Radio
                      key={val}
                      id={`${field.name}-${val}`}
                      data-testid={`${field.name}-${val}`}
                      name={field.name}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      label={t(`intake:documents.type.${val}`)}
                      value={val}
                    />
                  ))}
                </Fieldset>
              </FormGroup>
            )}
          />

          {
            // Text field for 'Other' type
            watch('documentType') === 'OTHER' && (
              <Controller
                name="otherTypeDescription"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormGroup
                    className="margin-top-1 margin-left-4"
                    error={!!error}
                  >
                    <Label htmlFor={field.name}>
                      {t('technicalAssistance:documents.upload.whatKind')}
                    </Label>
                    {error && (
                      <ErrorMessage>
                        {t('technicalAssistance:errors.fillBlank')}
                      </ErrorMessage>
                    )}
                    <TextInput
                      id={field.name}
                      name={field.name}
                      type="text"
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      value={field.value || ''}
                      validationStatus={error && 'error'}
                    />
                  </FormGroup>
                )}
              />
            )
          }

          {/* Document type */}
          <Controller
            name="version"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <FormGroup error={!!error}>
                <Fieldset
                  legend={
                    <span className="text-bold">
                      {t('intake:documents.versionLabel')}
                    </span>
                  }
                >
                  {error && (
                    <ErrorMessage>
                      {t('technicalAssistance:errors.makeSelection')}
                    </ErrorMessage>
                  )}
                  {Object.keys(
                    t('intake:documents.version', { returnObjects: true })
                  ).map(val => (
                    <Radio
                      key={val}
                      id={`${field.name}-${val}`}
                      data-testid={`${field.name}-${val}`}
                      name={field.name}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      label={t(`intake:documents.version.${val}`)}
                      value={val}
                    />
                  ))}
                </Fieldset>
              </FormGroup>
            )}
          />

          <Alert type="info" slim className="margin-top-5">
            {t('technicalAssistance:documents.upload.toKeepCmsSafe')}
          </Alert>

          <Button
            type="submit"
            disabled={
              !watch('fileData') || !watch('documentType') || isSubmitting
            }
            className="margin-y-4"
          >
            {t('technicalAssistance:documents.upload.uploadDocument')}
          </Button>
        </Form>

        <IconLink to={`/system/${systemId}/documents`} icon={<IconArrowBack />}>
          {t('intake:documents.returnToIntake')}
        </IconLink>
      </div>
    </>
  );
};

export default UploadForm;
