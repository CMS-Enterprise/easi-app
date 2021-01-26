import React, { useState } from 'react';
import classnames from 'classnames';

// TBD: multiple files
// Multiple files in a single input is not recommended, but it might be worth
// supporting, just in case.
type FileUploadProps = {
  id: string;
  name: string;
  accept: string;
  // multiple?: boolean;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  ariaDescribedBy: string;
} & JSX.IntrinsicElements['input'];

const FileUpload = (props: FileUploadProps) => {
  const {
    id,
    name,
    accept,
    // multiple = false,
    disabled = false,
    onChange,
    onBlur,
    ariaDescribedBy
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
    if (e.target.files.length > 0 && isFileTypeValid(e.target.files[0])) {
      setError(false);
      setFile(e.target.files[0]);
      onChange(e);
    } else {
      setError(true);
      setFile(null);
    }
  };

  const isFileTypeValid = (localFile: File) => {
    let isFileTypeAcceptable = false;
    if (accept) {
      const accepetedFileTypes = accept.split(',');
      accepetedFileTypes.forEach(fileType => {
        if (
          localFile.name.indexOf(fileType) > 0 ||
          localFile.type.includes(fileType.replace(/\*/g, ''))
        ) {
          isFileTypeAcceptable = true;
        }
      });
    }
    return isFileTypeAcceptable;
  };

  return (
    <div className={fileInputWrapper} aria-disabled={disabled}>
      <div className={targetWrapperClasses}>
        {file && (
          <div className="usa-file-input__preview-heading">
            Selected file
            <span className="usa-file-input__choose">Change file</span>
          </div>
        )}
        <div className={instructionsClasses} aria-hidden>
          <span className="usa-file-input__drag-text">Drag file here or </span>
          <span className="usa-file-input__choose">choose from folder</span>
        </div>
        {file && (
          <div className="usa-file-input__preview" aria-hidden>
            {file.name}
          </div>
        )}
        <div className="usa-file-input__box" />
        {error && (
          <div className="usa-file-input__accepted-files-message">
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
          aria-describedby={ariaDescribedBy}
          onChange={handleChange}
          onBlur={onBlur}
        />
      </div>
    </div>
  );
};

type SelectedFileProps = {
  id: string;
  fileName: string;
};

export const SelectedFile = ({ id, fileName }: SelectedFileProps) => (
  <dl className="margin-y-2" id={id} aria-live="polite" aria-atomic>
    <dt className="display-inline-block margin-0">Selected file</dt>
    <span aria-hidden>{': '}</span>
    <dd className="display-inline-block margin-0">{fileName}</dd>
  </dl>
);

export default FileUpload;
