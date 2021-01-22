import React from 'react';
import classnames from 'classnames';

type FileUploadProps = {
  id: string;
  name: string;
  accept: string;
  multiple?: boolean;
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
    multiple = false,
    disabled = false,
    onChange,
    onBlur,
    ariaDescribedBy
  } = props;
  const fileInputWrapper = classnames('easi-file-upload', 'usa-file-input', {
    'usa-file-input--disabled': disabled
  });

  return (
    <div className={fileInputWrapper} aria-disabled={disabled}>
      <div className="usa-file-input__target">
        <div className="usa-file-input__instructions" aria-hidden>
          <span className="usa-file-input__drag-text">Drag file here or </span>
          <span className="usa-file-input__choose">choose from folder</span>
        </div>
        <div className="usa-file-input__box" />
        <input
          id={id}
          className="usa-file-input__input"
          type="file"
          name={name}
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          aria-describedby={ariaDescribedBy}
          onChange={onChange}
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
