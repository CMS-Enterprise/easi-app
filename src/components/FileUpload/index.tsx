import React, { useState } from 'react';
import classnames from 'classnames';

// TBD: multiple files
// Multiple files in a single input is not recommended, but it might be worth
// supporting, just in case.
type FileUploadProps = {
  id: string;
  name: string;
  accept?: string;
  // multiple?: boolean;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
} & JSX.IntrinsicElements['input'];

const FileUpload = (props: FileUploadProps) => {
  const {
    id,
    name,
    accept,
    // multiple = false,
    disabled = false,
    onChange,
    onBlur
  } = props;
  const [file, setFile] = useState<File>(null);
  const [error, setError] = useState(false);
  const fileInputWrapper = classnames('easi-file-upload', 'usa-file-input', {
    'usa-file-input--disabled': disabled
  });
  const targetWrapperClasses = classnames('usa-file-input__target', {
    'has-invalid-file': error
  });
  const instructionsClasses = classnames('usa-file-input__instructions', {
    'display-none': !!file
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // eslint-disable-next-line
    if (e.target.files.length > 0) {
      if (isFileTypeValid(e.target.files[0])) {
        setError(false);
        setFile(e.target.files[0]);
        onChange(e);
      } else {
        setError(true);
        setFile(null);
      }
    }
  };

  const isFileTypeValid = (localFile: File) => {
    if (!accept) {
      return true;
    }
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
    <div
      className={fileInputWrapper}
      aria-disabled={disabled}
      data-testid="file-upload-wrapper"
    >
      <div className={targetWrapperClasses}>
        {file && (
          <div className="usa-file-input__preview-heading">
            Selected file
            <span className="usa-file-input__choose">Change file</span>
          </div>
        )}
        {file && (
          <div role="alert" aria-live="assertive" className="sr-only">
            File {file.name} selected.
          </div>
        )}
        <div className={instructionsClasses} aria-hidden>
          <span className="usa-file-input__drag-text">
            Drag document here or{' '}
          </span>
          <span className="usa-file-input__choose">choose from folder</span>
        </div>
        {file && (
          <div className="usa-file-input__preview" aria-hidden>
            <FileTypeIcon fileName={file.name} />
            {file.name}
          </div>
        )}
        <div className="usa-file-input__box" />
        {error && (
          <div
            className="usa-file-input__accepted-files-message"
            data-testid="file-upload-input-error"
          >
            This is not a valid file type.
          </div>
        )}
        <input
          id={id}
          className="usa-file-input__input"
          type="file"
          name={name}
          accept={accept}
          // multiple={multiple}
          disabled={disabled}
          aria-describedby="FileUpload-Description"
          onChange={handleChange}
          onBlur={onBlur}
          data-testid="file-upload-input"
        />
      </div>
      <div id="FileUpload-Description" className="sr-only" tabIndex={-1}>
        {file ? `File ${file.name} selected` : 'Select a file'}
      </div>
    </div>
  );
};

const FileTypeIcon = (props: { fileName: string }) => {
  const { fileName } = props;
  const SPACER_GIF =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
  const iconClasses = ['usa-file-input__preview-image'];
  if (fileName.indexOf('.pdf') > 0) {
    iconClasses.push('usa-file-input__preview-image--pdf');
  } else if (fileName.indexOf('.doc') > 0 || fileName.indexOf('.pages') > 0) {
    iconClasses.push('usa-file-input__preview-image--word');
  } else if (fileName.indexOf('.xls') > 0 || fileName.indexOf('.numbers') > 0) {
    iconClasses.push('usa-file-input__preview-image--excel');
  } else if (fileName.indexOf('.mov') > 0 || fileName.indexOf('.mp4') > 0) {
    iconClasses.push('usa-file-input__preview-image--video');
  } else {
    iconClasses.push('usa-file-input__preview-image--generic');
  }

  return (
    <img
      src={SPACER_GIF}
      alt=""
      className={iconClasses.join(' ')}
      aria-hidden
    />
  );
};

export default FileUpload;
