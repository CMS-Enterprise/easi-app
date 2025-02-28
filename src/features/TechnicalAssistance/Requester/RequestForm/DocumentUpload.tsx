import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  ErrorMessage,
  Fieldset,
  FileInput,
  Form,
  FormGroup,
  Grid,
  Icon,
  Label,
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import classNames from 'classnames';
import { useCreateTRBRequestDocumentMutation } from 'gql/generated/graphql';
import { clone } from 'lodash';

import Alert from 'components/Alert';
import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import useMessage from 'hooks/useMessage';
import { fileToBase64File } from 'utils/downloadFile';
import {
  documentSchema,
  TrbRequestInputDocument
} from 'validations/trbRequestSchema';

import Breadcrumbs from '../../../../components/Breadcrumbs';

import { TrbFormAlert } from '.';

type DocumentUploadProps = {
  isInitialRequest?: boolean;
  setFormAlert?: React.Dispatch<React.SetStateAction<TrbFormAlert>>;
  view?: string;
  refetchDocuments?: () => void;
};

const DocumentUpload = ({
  isInitialRequest,
  setFormAlert,
  view,
  refetchDocuments
}: DocumentUploadProps) => {
  const { t } = useTranslation('technicalAssistance');

  const history = useHistory();

  const { id: requestID } = useParams<{
    id: string;
  }>();

  // Route param for navigation back to either inital request or task list
  const prevRoute = isInitialRequest ? 'requests' : 'task-list';

  const [isUploadError, setIsUploadError] = useState(false);

  const { showMessageOnNextPage } = useMessage();

  // Documents can be created from the upload form
  const [createDocument] = useCreateTRBRequestDocumentMutation();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<TrbRequestInputDocument>({
    resolver: yupResolver(documentSchema),
    defaultValues: {
      documentType: undefined,
      fileData: undefined,
      otherTypeDescription: ''
    }
  });

  const submit = handleSubmit(async formData => {
    const input: TrbRequestInputDocument = clone(formData);

    const newFile = await fileToBase64File(input.fileData);

    // Clear out otherTypeDescription if documentType isn't OTHER
    if (input.documentType !== 'OTHER') {
      delete input.otherTypeDescription;
    }

    createDocument({
      variables: {
        input: {
          requestID,
          documentType: input.documentType,
          otherTypeDescription: input.otherTypeDescription,
          fileData: newFile
        }
      }
    })
      .then(response => {
        if (!response.errors) {
          if (isInitialRequest && setFormAlert) {
            if (refetchDocuments) refetchDocuments(); // Reload documents
            setFormAlert({
              type: 'success',
              slim: true,
              message: t('documents.upload.success')
            });
          } else {
            showMessageOnNextPage(t('documents.upload.success'), {
              className: 'margin-y-4',
              type: 'success'
            });
          }
          // Go back to the prev page
          history.push(`/trb/${prevRoute}/${requestID}/documents`);
        } else {
          setIsUploadError(true);
        }
      })
      .catch(err => {
        setIsUploadError(true);
      });
  });

  useEffect(() => {
    if (isInitialRequest) {
      if (view === 'upload') if (setFormAlert) setFormAlert(false);
      if (!view) setIsUploadError(false);
      if (!view && isDirty) reset();
    }
  }, [view, setFormAlert, isDirty, reset, isInitialRequest]);

  // Scroll to the first error field if the form is invalid
  useEffect(() => {
    const fields = Object.keys(errors);
    if (fields.length) {
      const err = document.querySelector(`label[for=${fields[0]}]`);
      err?.scrollIntoView();
    }
  }, [errors]);

  // Scroll to the upload error if there's a problem
  useEffect(() => {
    if (isUploadError) {
      const err = document.querySelector('.document-upload-error');
      err?.scrollIntoView();
    }
  }, [isUploadError]);

  return (
    <div className={classNames({ 'grid-container': !isInitialRequest })}>
      <Breadcrumbs
        items={[
          { text: t('heading'), url: '/trb' },
          {
            text: t('taskList.heading'),
            url: `/trb/task-list/${requestID}`
          },
          {
            text: isInitialRequest
              ? t('requestForm.heading')
              : t('documents.supportingDocuments.heading'),
            url: `/trb/${prevRoute}/${requestID}/documents`
          },
          { text: t('documents.upload.title') }
        ]}
      />
      {isUploadError && (
        <Alert type="error" className="document-upload-error">
          {t('documents.upload.error')}
        </Alert>
      )}
      <Form className="maxw-full" onSubmit={submit}>
        <PageHeading className="margin-bottom-1">
          {t('documents.upload.title')}
        </PageHeading>
        <Grid row gap>
          <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
            <div>{t('documents.upload.subtitle')}</div>
            <Controller
              name="fileData"
              control={control}
              // eslint-disable-next-line @typescript-eslint/no-shadow
              render={({ field, fieldState: { error } }) => {
                return (
                  <FormGroup error={!!error} className="margin-top-5">
                    <Label htmlFor={field.name} error={!!error}>
                      {t('documents.upload.documentUpload')}
                    </Label>
                    <span className="usa-hint">
                      {t('documents.upload.docType')}
                    </span>
                    {error && (
                      <ErrorMessage>{t('errors.selectFile')}</ErrorMessage>
                    )}
                    <FileInput
                      id={field.name}
                      name={field.name}
                      onBlur={field.onBlur}
                      onChange={e => {
                        field.onChange(e.currentTarget?.files?.[0]);
                      }}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.ppt,.pptx,.xls,.xlsx"
                    />
                  </FormGroup>
                );
              }}
            />
            <Controller
              name="documentType"
              control={control}
              // eslint-disable-next-line @typescript-eslint/no-shadow
              render={({ field, fieldState: { error } }) => (
                <FormGroup error={!!error}>
                  <Fieldset legend={t('documents.upload.whatType')}>
                    {error && (
                      <ErrorMessage>{t('errors.makeSelection')}</ErrorMessage>
                    )}
                    {[
                      'ARCHITECTURE_DIAGRAM',
                      'PRESENTATION_SLIDE_DECK',
                      'BUSINESS_CASE',
                      'OTHER'
                    ].map(val => (
                      <Radio
                        key={val}
                        id={`${field.name}-${val}`}
                        data-testid={`${field.name}-${val}`}
                        name={field.name}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                        label={t(`documents.upload.type.${val}`)}
                        value={val}
                      />
                    ))}
                  </Fieldset>
                </FormGroup>
              )}
            />
            {watch('documentType') === 'OTHER' && (
              <div className="margin-left-4">
                <Controller
                  name="otherTypeDescription"
                  control={control}
                  // eslint-disable-next-line @typescript-eslint/no-shadow
                  render={({ field, fieldState: { error } }) => (
                    <FormGroup className="margin-top-1" error={!!error}>
                      <Label htmlFor={field.name} error={!!error}>
                        {t('documents.upload.whatKind')}
                      </Label>
                      {error && (
                        <ErrorMessage>{t('errors.fillBlank')}</ErrorMessage>
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
              </div>
            )}
            <Alert type="info" slim className="margin-top-5">
              {t('documents.upload.toKeepCmsSafe')}
            </Alert>
          </Grid>
        </Grid>
        <div>
          <Button
            type="submit"
            disabled={!watch('fileData') || isSubmitting}
            className="margin-top-4"
          >
            {t('documents.upload.uploadDocument')}
          </Button>
        </div>
      </Form>
      <div className="margin-top-2">
        <UswdsReactLink
          variant="unstyled"
          to={`/trb/${prevRoute}/${requestID}/documents`}
        >
          <Icon.ArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
          {t('documents.upload.dontUploadAndReturn')}
        </UswdsReactLink>
      </div>
    </div>
  );
};

export default DocumentUpload;
