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

import Alert from 'components/Alert';

function SendPresentationReminder({
  ...props
}: ComponentProps<typeof UswdsFileInput>) {
  const { t } = useTranslation('grbReview');

  const { id, name, onChange } = props;

  const [file, setFile] = useState<File>();
  const [error, setError] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const accept = '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx';

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

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
        <Alert type="info" slim>
          {t('presentationLinks.sendReminderCard.notUploadedInfo')}
        </Alert>

        {error && (
          <div
            className="usa-file-input__accepted-files-message"
            data-testid="file-upload-input-error"
          >
            {t('notValid')}
          </div>
        )}

        <div id="FileUpload-Description" className="sr-only">
          {file ? `File ${file.name} selected` : 'Select a file'}
        </div>
      </CardBody>

      <CardFooter>
        <Button type="submit" disabled={!file} className="margin-top-0">
          {t('presentationLinks.sendReminderCard.sendReminder')}
        </Button>

        <Button type="button" onClick={handleButtonClick} unstyled>
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
