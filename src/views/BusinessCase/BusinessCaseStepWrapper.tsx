import React from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import FeedbackBanner from 'components/FeedbackBanner';
import PageHeading from 'components/PageHeading';
import { ErrorAlert, ErrorAlertMessage } from 'components/shared/ErrorAlert';

type BusinessCaseStepWrapperProps = {
  /** Form page title */
  title: string;
  /** Business case ID */
  id: string;
  /** Form errors object */
  errors: Record<string, string>;
  /** Form step content and fields */
  children: React.ReactNode;
  description?: string;
  className?: string;
  'data-testid'?: string;
};

/**
 * Wrapper for business case form steps
 *
 * Wraps `children` in form step title, error alert, and feedback banner
 */
const BusinessCaseStepWrapper = ({
  title,
  description,
  id,
  errors,
  children,
  className,
  ...props
}: BusinessCaseStepWrapperProps) => {
  const { t } = useTranslation('form');

  return (
    <div className={classNames('grid-container', className)} {...props}>
      {Object.keys(errors).length > 0 && (
        <ErrorAlert
          classNames="margin-top-3"
          heading={t('inputError.checkfix')}
          testId="formik-validation-errors"
        >
          {Object.keys(errors).map(key => {
            return (
              <ErrorAlertMessage
                key={`Error.${key}`}
                errorKey={key}
                message={errors[key]}
              />
            );
          })}
        </ErrorAlert>
      )}

      <PageHeading className="margin-bottom-4">{title}</PageHeading>

      <FeedbackBanner
        id={id}
        type="Draft Business Case"
        className="margin-top-3"
      />

      <p className="line-height-body-6">{description}</p>

      {children}
    </div>
  );
};

export default BusinessCaseStepWrapper;
