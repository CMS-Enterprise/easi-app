import React, { ComponentProps, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  FileInput as UswdsFileInput
} from '@trussworks/react-uswds';
import { useSendPresentationDeckReminderMutation } from 'gql/generated/graphql';

import Alert from 'components/Alert';
import useMessage from 'hooks/useMessage';
import { downloadFileFromURL } from 'utils/downloadFile';

function SendPresentationReminder({
  systemIntakeID,
  presentationDeckFileURL,
  presentationDeckFileName,
  clearFile,
  ...props
}: ComponentProps<typeof UswdsFileInput> & {
  systemIntakeID: string;
  presentationDeckFileURL: string | null | undefined;
  presentationDeckFileName: string | null | undefined;
  clearFile: () => void;
}) {
  const { t } = useTranslation('grbReview');

  const { id, name, onChange } = props;

  const [file, setFile] = useState<File>();
  const [error, setError] = useState(false);

  // State to track if reminder has been sent
  const [reminderSend, setReminderSend] = useState(false);

  const { showMessage } = useMessage();

  const [sendReminder, { loading }] = useSendPresentationDeckReminderMutation({
    variables: {
      systemIntakeID
    }
  });

  const sendReminderClick = () => {
    sendReminder()
      .then(() => {
        // Set state to show reminder has been sent and disable Send Reminder button
        setReminderSend(true);
      })
      // Set error message if reminder fails to send
      .catch(() => {
        showMessage(t('presentationLinks.sendReminderCard.reminderError'), {
          type: 'error',
          className: 'margin-top-4'
        });
        document.querySelector('.usa-alert--error')?.scrollIntoView();
      });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const accept: string = '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx';

  // Ref event to capture the the button click of the hidden file input
  // The hidden file input is used to trigger the file upload dialog
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Function to handle the file upload.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files && e.target.files.length > 0) {
      if (isFileTypeValid(e.target.files[0])) {
        setError(false);
        setFile(e.target.files[0]);
        if (onChange) onChange(e);
      } else {
        setError(true);
        setFile(undefined);
      }
    }
  };

  // Checks if the file type is valid
  const isFileTypeValid = (localFile: File) => {
    let isFileTypeAcceptable = false;
    const acceptedFileTypes = accept.split(',');
    acceptedFileTypes.forEach(fileType => {
      if (
        localFile.name.indexOf(fileType) > 0 ||
        localFile.type.includes(fileType.replace(/\*/g, ''))
      ) {
        isFileTypeAcceptable = true;
      }
    });
    return isFileTypeAcceptable;
  };

  return (
    <Card
      containerProps={{
        className: 'margin-0 shadow-2 radius-md'
      }}
    >
      <CardHeader>
        <h4 className="margin-bottom-1">
          {t('presentationLinks.sendReminderCard.header')}
        </h4>

        <p className="margin-top-0 text-base">
          {t('presentationLinks.sendReminderCard.description')}
        </p>
      </CardHeader>

      <CardBody>
        {error && (
          <div
            className="usa-file-input__accepted-files-message"
            data-testid="file-upload-input-error"
          >
            {t('notValid')}
          </div>
        )}

        {!file && !presentationDeckFileName ? (
          <Alert type="info" slim>
            {t('presentationLinks.sendReminderCard.notUploadedInfo')}
          </Alert>
        ) : (
          <div>
            <p className="margin-top-1 margin-bottom-0">
              {t('presentationLinks.sendReminderCard.uplodededFile')}
            </p>

            <span>
              {file?.name || presentationDeckFileName}{' '}
              {presentationDeckFileURL && presentationDeckFileName && (
                <span>
                  {!file?.name && (
                    <Button
                      type="button"
                      unstyled
                      className="margin-left-1 margin-top-0"
                      onClick={() =>
                        downloadFileFromURL(
                          presentationDeckFileURL,
                          presentationDeckFileName
                        )
                      }
                    >
                      {t('presentationLinks.sendReminderCard.view')}
                    </Button>
                  )}

                  <Button
                    type="button"
                    // Clear fileName to show file upload field
                    onClick={() => {
                      clearFile();
                      setFile(undefined);
                    }}
                    unstyled
                    className="margin-top-0 margin-left-1 text-red"
                  >
                    {t('presentationLinks.sendReminderCard.clearFile')}
                  </Button>
                </span>
              )}
            </span>
          </div>
        )}
      </CardBody>

      <CardFooter>
        {!presentationDeckFileName && (
          <Button
            type="button"
            onClick={sendReminderClick}
            disabled={loading || reminderSend}
            className="margin-top-0"
          >
            {reminderSend
              ? t('presentationLinks.sendReminderCard.reminderSent')
              : t('presentationLinks.sendReminderCard.sendReminder')}
          </Button>
        )}

        <Button
          type="button"
          onClick={handleButtonClick}
          unstyled
          className="margin-top-1"
        >
          {t('presentationLinks.sendReminderCard.uploadDeck')}
        </Button>

        <input
          id={id}
          style={{ display: 'none' }}
          type="file"
          name={name}
          accept={accept}
          ref={fileInputRef}
          aria-describedby={t(
            'presentationLinks.presentationUpload.selectFile'
          )}
          onChange={handleChange}
          data-testid="file-upload-input"
        />
      </CardFooter>
    </Card>
  );
}

export default SendPresentationReminder;
