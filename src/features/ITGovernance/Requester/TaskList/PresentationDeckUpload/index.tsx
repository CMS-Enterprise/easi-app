import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { FileInput, Form, FormGroup, Icon } from '@trussworks/react-uswds';
import Pager from 'features/TechnicalAssistance/Requester/RequestForm/Pager';
import {
  SystemIntakeGRBPresentationLinksInput,
  useSetSystemIntakeGRBPresentationLinksMutation,
  useUploadSystemIntakeGRBPresentationDeckMutation
} from 'gql/generated/graphql';

import { Alert } from 'components/Alert';
import { useEasiForm } from 'components/EasiForm';
import IconLink from 'components/IconLink';
import Label from 'components/Label';
import useMessage from 'hooks/useMessage';
import { ITGovernanceViewType } from 'types/itGov';
import { fileToBase64File } from 'utils/downloadFile';

type PresentationLinkFields = Omit<
  SystemIntakeGRBPresentationLinksInput,
  | 'systemIntakeID'
  | 'recordingLink'
  | 'recordingPasscode'
  | 'transcriptLink'
  | 'transcriptFileName'
>;

type UploadFormProps = {
  type: ITGovernanceViewType;
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

  const { showMessageOnNextPage, showMessage } = useMessage();

  // TODO: May need to incorporate new mutation for requester, once BE work is complete
  // Form would need to toggle between two mutations based on user type
  const [setPresentationLinks] = useSetSystemIntakeGRBPresentationLinksMutation(
    { refetchQueries: ['GetSystemIntake'] }
  );
  const [upload] = useUploadSystemIntakeGRBPresentationDeckMutation({
    refetchQueries: ['GetSystemIntake']
  });

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting }
  } = useEasiForm<PresentationLinkFields>({
    defaultValues: {
      presentationDeckFileData: {
        name: ''
      } as File
    }
  });

  const requestDetailsLink =
    type === 'requester'
      ? `/governance-task-list/${systemId}`
      : `/it-governance/${systemId}/grb-review`;

  const submit = handleSubmit(async values => {
    const presentationDeckFileData = values.presentationDeckFileData?.size
      ? await fileToBase64File(values.presentationDeckFileData)
      : undefined;

    if (type === 'requester') {
      upload({
        variables: {
          input: {
            systemIntakeID: systemId,
            presentationDeckFileData
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
    } else {
      setPresentationLinks({
        variables: {
          input: {
            systemIntakeID: systemId,
            presentationDeckFileData
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
    }
  });

  return (
    <>
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
          <FormGroup
            error={!!errors.presentationDeckFileData}
            className="margin-top-5"
          >
            <Label htmlFor="fileData">
              {t('presentationLinks.presentationUpload.selectFile')}
            </Label>

            <p className="usa-hint margin-bottom-0 margin-top-05">
              {t('presentationLinks.presentationUpload.recommendedFileTypes')}
            </p>

            <Controller
              control={control}
              name="presentationDeckFileData"
              rules={{
                required: true
              }}
              render={({ field: { value, ...field } }) => (
                <FileInput
                  {...field}
                  id={field.name}
                  name={field.name}
                  onChange={e => {
                    field.onChange(e.currentTarget?.files?.[0]);
                  }}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
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
              disabled: !watch('presentationDeckFileData')?.name || isSubmitting
            }}
            taskListUrl={requestDetailsLink}
            saveExitText={
              type === 'requester'
                ? t('presentationLinks.presentationUpload.dontUploadRequester')
                : t('presentationLinks.presentationUpload.dontUploadAdmin')
            }
            submitDisabled
            border={false}
            className="margin-top-4"
          />
        </Form>
      </div>
    </>
  );
};

export default PresentationDeckUpload;
