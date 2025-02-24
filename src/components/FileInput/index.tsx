import React, { ComponentProps, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, FileInput as UswdsFileInput } from '@trussworks/react-uswds';

type FileInputProps = Omit<
  ComponentProps<typeof UswdsFileInput>,
  'onChange'
> & {
  onChange?: (value: File | null) => void;
  defaultFileName?: string | null;
};

/**
 * File input that accepts `defaultFileName` prop to display previously updated file.
 *
 * Default file name is for display only and does NOT set field value.
 * When `defaultFileName` is set, file name is displayed with `Clear file` button.
 */
const FileInput = ({ defaultFileName, ...props }: FileInputProps) => {
  const { t } = useTranslation('form');

  const [fileName, setFileName] = useState(defaultFileName || '');

  /** Returns the type of uploaded file - used to display corresponding icon */
  const fileType: 'pdf' | 'word' | 'excel' | 'generic' = useMemo(() => {
    if (fileName.indexOf('.pdf') > 0) {
      return 'pdf';
    }

    if (fileName.indexOf('.doc') > 0 || fileName.indexOf('.pages') > 0) {
      return 'word';
    }

    if (fileName.indexOf('.xls') > 0 || fileName.indexOf('.numbers') > 0) {
      return 'excel';
    }

    return 'generic';
  }, [fileName]);

  // If `defaultFileName` is not set or file is cleared, display Truss `FileInput`
  if (!fileName) {
    return (
      <UswdsFileInput
        {...props}
        onChange={e => props.onChange?.(e.currentTarget?.files?.[0] || null)}
      />
    );
  }

  // Display default filename with button to clear file
  return (
    <div className="maxw-none border border-dashed border-base-light font-body-2xs margin-top-1">
      <div className="display-flex flex-justify padding-1 bg-primary-lighter">
        <span className="text-bold">{t('selectedFile')}</span>
        <Button
          type="button"
          // Clear fileName to show file upload field
          onClick={() => {
            // Set field value to null
            props.onChange?.(null);

            // Reset fileName state
            setFileName('');
          }}
          unstyled
          className="margin-top-0 font-body-2xs"
        >
          {t('clearFile')}
        </Button>
      </div>

      <div className="usa-file-input__preview margin-bottom-0">
        <div
          className={`usa-file-input__preview-image usa-file-input__preview-image--${fileType}`}
          role="img"
          aria-label={t('fileType', { context: fileType })}
        />
        {fileName}
      </div>
    </div>
  );
};

export default FileInput;
