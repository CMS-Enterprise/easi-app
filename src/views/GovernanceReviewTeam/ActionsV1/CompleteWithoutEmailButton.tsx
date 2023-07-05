import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, IconArrowForward } from '@trussworks/react-uswds';
import classnames from 'classnames';
import { FormikErrors } from 'formik';

import { ActionForm } from 'types/action';

interface CompleteWithoutEmailButtonProps
  extends React.HTMLProps<HTMLButtonElement> {
  setFieldValue: (field: string, value: any) => void;
  submitForm: () => Promise<any>;
  setErrors?: (errors: FormikErrors<ActionForm>) => void;
}

export default ({
  disabled,
  setFieldValue,
  submitForm,
  className,
  setErrors
}: CompleteWithoutEmailButtonProps) => {
  const { t } = useTranslation('action');

  return (
    <Button
      type="button"
      unstyled
      className={classnames(
        'margin-top-2',
        'line-height-body-5',
        {
          'text-gray-30': disabled
        },
        className
      )}
      disabled={disabled}
      onClick={() => {
        if (setErrors) setErrors({});
        setFieldValue('shouldSendEmail', false);
        setTimeout(submitForm);
      }}
    >
      {t('submitAction.completeWithoutEmail')}
      <IconArrowForward className="margin-left-05 margin-bottom-2px text-tbottom" />
    </Button>
  );
};
