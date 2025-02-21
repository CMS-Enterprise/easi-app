import React from 'react';
import { Controller } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Fieldset,
  FileInput,
  Form,
  FormGroup,
  Icon,
  Radio,
  TextInput
} from '@trussworks/react-uswds';
import Pager from 'features/TechnicalAssistance/Requester/RequestForm/Pager';
import {
  CreateSystemIntakeDocumentInput,
  useCreateSystemIntakeDocumentMutation
} from 'gql/generated/graphql';
import GetSystemIntakeQuery from 'gql/legacyGQL/GetSystemIntakeQuery';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { AppState } from 'stores/reducers/rootReducer';

import { Alert } from 'components/Alert';
import { useEasiForm } from 'components/EasiForm';
import HelpText from 'components/HelpText';
import IconLink from 'components/IconLink';
import Label from 'components/Label';
import useMessage from 'hooks/useMessage';
import { fileToBase64File } from 'utils/downloadFile';
import user from 'utils/user';
import { documentSchema } from 'validations/systemIntakeSchema';

import FieldErrorMsg from '../../../../../components/FieldErrorMsg';
import RequiredAsterisk from '../../../../../components/RequiredAsterisk';

type DocumentUploadFields = Omit<CreateSystemIntakeDocumentInput, 'requestID'>;

type UploadFormProps = {
  type: 'admin' | 'requester';
};

/**
 * System intake document upload form
 */
const UploadForm = ({ type = 'requester' }: UploadFormProps) => {
  const { t } = useTranslation();

  const { groups } = useSelector((state: AppState) => state.auth);

  const flags = useFlags();

  const history = useHistory();

  const { systemId } = useParams<{
    systemId: string;
  }>();

  const { Message, showMessageOnNextPage, showMessage } = useMessage();

  const [createDocument] = useCreateSystemIntakeDocumentMutation({
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
      ? `/system/${systemId}/documents`
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
          t('technicalAssistance:documents.upload.success'),
          {
            type: 'success'
          }
        );
        history.push(requestDetailsLink);
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

        <p className="margin-top-1 margin-bottom-1 font-body-md line-height-body-5 text-light">
          {t('intake:documents.formDescription')}
        </p>

        <p className="margin-bottom-3 margin-top-105 text-base">
          <Trans
            i18nKey="technicalAssistance:requiredFields"
            components={{ red: <span className="text-red" /> }}
          />
        </p>

        <IconLink to={requestDetailsLink} icon={<Icon.ArrowBack />}>
          {t('intake:documents.dontUpload', { context: type })}
        </IconLink>

        <Form className="maxw-full" onSubmit={submit}>
          {/* Upload field */}
          <FormGroup error={!!errors.fileData} className="margin-top-5">
            <Label htmlFor="fileData" required>
              {t('intake:documents.selectDocument')}
            </Label>
            <p className="usa-hint margin-bottom-0 margin-top-05">
              {t('intake:documents.supportedFileTypes')}
            </p>
            <ErrorMessage
              errors={errors}
              name="fileData"
              message={t('technicalAssistance:errors.selectFile')}
            />
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
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                />
              )}
            />
          </FormGroup>

          {/* Document type */}
          <FormGroup error={!!errors.documentType}>
            <Fieldset
              legend={
                <span className="text-bold">
                  {t('technicalAssistance:documents.upload.whatType')}{' '}
                  <span className="text-red">*</span>
                </span>
              }
            >
              <ErrorMessage
                name="documentType"
                errors={errors}
                message={t('technicalAssistance:errors.makeSelection')}
              />
              {Object.keys(
                t('intake:documents.type', { returnObjects: true })
              ).map(val => (
                <Radio
                  {...register('documentType')}
                  ref={null}
                  value={val}
                  key={val}
                  id={`documentType-${val}`}
                  data-testid={`documentType-${val}`}
                  label={t(`intake:documents.type.${val}`)}
                />
              ))}
            </Fieldset>
          </FormGroup>

          {
            // Text field for 'Other' type
            watch('documentType') === 'OTHER' && (
              <FormGroup
                className="margin-top-1 margin-left-4"
                error={!!errors.otherTypeDescription}
              >
                <Label htmlFor="otherTypeDescription">
                  {t('technicalAssistance:documents.upload.whatKind')}
                </Label>
                <ErrorMessage
                  errors={errors}
                  name="otherTypeDescription"
                  message={t('technicalAssistance:errors.fillBlank')}
                />
                <TextInput
                  {...register('otherTypeDescription', {
                    shouldUnregister: true
                  })}
                  ref={null}
                  id="otherTypeDescription"
                  type="text"
                />
              </FormGroup>
            )
          }

          {/* Version */}
          <FormGroup error={!!errors.version}>
            <Fieldset
              legend={
                <span className="text-bold">
                  {t('intake:documents.versionLabel')}{' '}
                </span>
              }
            >
              <ErrorMessage
                name="version"
                errors={errors}
                message={t('technicalAssistance:errors.makeSelection')}
              />
              {Object.keys(
                t('intake:documents.version', { returnObjects: true })
              ).map(val => (
                <React.Fragment key={val}>
                  <Radio
                    {...register('version')}
                    ref={null}
                    value={val}
                    key={val}
                    id={`version-${val}`}
                    data-testid={`version-${val}`}
                    label={t(`intake:documents.version.${val}`)}
                    aria-describedby={`versionHelpText${val}`}
                  />
                  <p
                    id={`versionHelpText${val}`}
                    className="margin-left-4 margin-top-05 margin-bottom-0 font-body-2xs line-height-body-3"
                  >
                    {t('intake:documents.versionHelpText', {
                      context: val
                    })}
                  </p>
                </React.Fragment>
              ))}
            </Fieldset>
          </FormGroup>

          {/* display for admins only when accessed from admin view */}
          {type === 'admin' && user.isITGovAdmin(groups, flags) && (
            <Controller
              name="sendNotification"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormGroup className="margin-top-3" error={!!error}>
                  <Fieldset
                    legend={
                      <span className="text-bold">
                        {t(
                          'technicalAssistance:documents.upload.sendNotificationToGRBReviewers.header'
                        )}
                        <RequiredAsterisk />
                      </span>
                    }
                  >
                    <HelpText className="margin-top-05">
                      {t(
                        'technicalAssistance:documents.upload.sendNotificationToGRBReviewers.info'
                      )}
                    </HelpText>

                    <ErrorMessage
                      as={FieldErrorMsg}
                      name="sendNotification"
                      errors={errors}
                    />

                    <Radio
                      key="yes"
                      ref={null}
                      inputRef={field.ref}
                      id={`${field.name}-yes`}
                      name={field.name}
                      label={t('technicalAssistance:basic.options.yes')}
                      onBlur={field.onBlur}
                      onChange={() => {
                        field.onChange(true);
                      }}
                    />

                    <Radio
                      key="no"
                      ref={null}
                      inputRef={field.ref}
                      id={`${field.name}-no`}
                      name={field.name}
                      label={t('technicalAssistance:basic.options.no')}
                      onBlur={field.onBlur}
                      onChange={() => {
                        field.onChange(false);
                      }}
                    />
                  </Fieldset>
                </FormGroup>
              )}
            />
          )}

          <Alert type="info" slim className="margin-top-5">
            {t('technicalAssistance:documents.upload.toKeepCmsSafe')}
          </Alert>

          <Pager
            next={{
              text: t('technicalAssistance:documents.upload.uploadDocument'),
              disabled: !isValid || isSubmitting
            }}
            taskListUrl={requestDetailsLink}
            saveExitText={t('intake:documents.dontUpload', { context: type })}
            border={false}
            className="margin-top-4"
          />
        </Form>
      </div>
    </>
  );
};

export default UploadForm;
