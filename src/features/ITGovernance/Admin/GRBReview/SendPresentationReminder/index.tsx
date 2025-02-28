import React, { ComponentProps, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileInput as UswdsFileInput } from '@trussworks/react-uswds';

import useMessage from 'hooks/useMessage';

function SendPresentationReminder({
  ...props
}: ComponentProps<typeof UswdsFileInput>) {
  const { t } = useTranslation('grbReview');

  const { id, name, onChange } = props;

  const { showMessage } = useMessage();

  const [file, setFile] = useState<File>();
  const [error, setError] = useState(false);

  const accept = '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx';

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
    <>
      {error && (
        <div
          className="usa-file-input__accepted-files-message"
          data-testid="file-upload-input-error"
        >
          {t('notValid')}
        </div>
      )}
      <input
        id={id}
        className="usa-file-input__input"
        type="file"
        name={name}
        accept={accept}
        å
        aria-describedby={t('presentationLinks.presentationUpload.selectFile')}
        onChange={handleChange}
        data-testid="file-upload-input"
      />
      <div id="FileUpload-Description" className="sr-only">
        {file ? `File ${file.name} selected` : 'Select a file'}
      </div>
    </>
  );
}

export default SendPresentationReminder;
