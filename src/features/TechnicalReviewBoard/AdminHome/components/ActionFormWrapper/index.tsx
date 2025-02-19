import React, { useEffect, useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Form, GridContainer } from '@trussworks/react-uswds';
import classNames from 'classnames';
import Pager, {
  PageButtonProps,
  PagerProps
} from 'features/TechnicalReviewBoard/RequestForm/Pager';

import Alert from 'components/Alert';
import Breadcrumbs, { BreadcrumbsProps } from 'components/Breadcrumbs'; // BreadcrumbsProps
import { ErrorAlertMessage } from 'components/ErrorAlert';
import PageHeading from 'components/PageHeading';
import RequiredAsterisk from 'components/RequiredAsterisk';
import useMessage from 'hooks/useMessage';

import Recipients from './Recipients';

type FormProps = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
  large?: boolean;
  search?: boolean;
} & JSX.IntrinsicElements['form'];

type ButtonProps = Omit<
  PagerProps,
  'border' | 'submitDisabled' | 'next' | 'buttons'
> & {
  next?: PageButtonProps;
  buttons?: React.ReactElement[];
};

export type ActionFormProps = {
  /** Action title */
  title: string;
  /** Action description */
  description: string;
  /**
   * Breadcrumb items specific to current action
   *
   * Home and request ID breadcrumbs are displayed as default
   */
  breadcrumbItems: BreadcrumbsProps['items'];
  children?: React.ReactNode;
  /** Pager button props */
  buttonProps?: ButtonProps;
  /** Alert text if form is disabled */
  disableFormText?: string;
  /** Whether to show alert at top of form with summary of errors */
  showErrorSummary?: boolean;
  /** Warning message above submit button */
  submitWarning?: string;
} & FormProps;

/**
 * Wrapper for TRB action forms
 */
const ActionForm = ({
  title,
  description,
  children,
  buttonProps,
  breadcrumbItems,
  disableFormText,
  submitWarning,
  showErrorSummary = true,
  ...formProps
}: ActionFormProps) => {
  const { t } = useTranslation('technicalAssistance');

  const { id } = useParams<{
    id: string;
  }>();

  const { Message } = useMessage();

  const {
    formState: { isSubmitting, errors }
  } = useFormContext();

  const [recipientFormOpen, setRecipientFormOpen] = useState<boolean>(false);

  const disableSubmit = useMemo(() => {
    return recipientFormOpen || isSubmitting || buttonProps?.next?.disabled;
  }, [recipientFormOpen, isSubmitting, buttonProps?.next?.disabled]);

  const buttons = useMemo(() => {
    if (!buttonProps?.buttons) return undefined;

    return buttonProps.buttons.map(button =>
      React.cloneElement(button, {
        disabled: button.props.disabled || recipientFormOpen
      })
    );
  }, [buttonProps?.buttons, recipientFormOpen]);

  /** Error keys not including recipients */
  const errorKeys: string[] = Object.keys(errors).filter(
    key => key !== 'recipients'
  );

  const hasErrors = errorKeys.length > 0;

  useEffect(() => {
    if (hasErrors) {
      const err = document.querySelector('.trb-basic-fields-error');
      err?.scrollIntoView();
    }
  }, [hasErrors]);

  return (
    <GridContainer className="width-full">
      <Breadcrumbs
        items={[
          { text: t('Home'), url: `/trb` },
          {
            text: t('adminHome.breadcrumb', { trbRequestId: id }),
            url: `/trb/${id}/initial-request-form`
          },
          ...breadcrumbItems
        ]}
      />

      <Message />

      <PageHeading className="margin-bottom-0">{title}</PageHeading>
      <p className="line-height-body-5 font-body-lg text-light margin-0">
        {t(description)}
      </p>

      {disableFormText ? (
        <Alert type="info" slim>
          {disableFormText}
        </Alert>
      ) : (
        <>
          <p className="margin-top-1 text-base">
            <Trans
              i18nKey="action:fieldsMarkedRequired"
              components={{ asterisk: <RequiredAsterisk /> }}
            />
          </p>

          {showErrorSummary && errorKeys.length > 0 && (
            <Alert
              heading={t('errors.checkFix')}
              type="error"
              className="trb-basic-fields-error"
              slim={false}
            >
              {errorKeys.map(fieldName => {
                const msg: string = t(`actionErrorLabels.${fieldName}`);
                return (
                  <ErrorAlertMessage
                    key={fieldName}
                    errorKey={fieldName}
                    message={msg}
                  />
                );
              })}
            </Alert>
          )}

          <Form
            {...formProps}
            className={classNames(
              'maxw-none tablet:grid-col-12 desktop:grid-col-6',
              formProps.className
            )}
          >
            {children}

            <h3 className="margin-top-6 margin-bottom-0">
              {t('actionRequestEdits.notificationTitle')}
            </h3>
            <p className="margin-0 line-height-body-5">
              {t('actionRequestEdits.notificationDescription')}
            </p>

            <Recipients setRecipientFormOpen={setRecipientFormOpen} />

            {submitWarning && (
              <Alert type="warning" className="margin-top-4">
                {t(submitWarning)}
              </Alert>
            )}

            {buttonProps && (
              <Pager
                {...buttonProps}
                next={
                  buttonProps?.next
                    ? {
                        ...buttonProps?.next,
                        disabled: disableSubmit
                      }
                    : false
                }
                buttons={buttons}
                border={false}
                className={classNames('margin-top-5', buttonProps.className)}
                submitDisabled
              />
            )}
          </Form>
        </>
      )}
    </GridContainer>
  );
};

export default ActionForm;
