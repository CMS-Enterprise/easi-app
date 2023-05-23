import React, { useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Form, GridContainer } from '@trussworks/react-uswds';
import classNames from 'classnames';

import PageHeading from 'components/PageHeading';
import useMessage from 'hooks/useMessage';
import Breadcrumbs from 'views/TechnicalAssistance/Breadcrumbs'; // BreadcrumbsProps
import Pager, {
  PageButtonProps,
  PagerProps
} from 'views/TechnicalAssistance/RequestForm/Pager';

import Recipients from './Recipients';

type FormProps = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
  large?: boolean;
  search?: boolean;
} & JSX.IntrinsicElements['form'];

type ButtonProps = Omit<PagerProps, 'border' | 'submitDisabled' | 'next'> & {
  next: PageButtonProps;
};

export type ActionFormProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  buttonProps: ButtonProps;
  // breadcrumbItems: BreadcrumbsProps['items'];
} & FormProps;

/**
 * Wrapper for TRB action forms
 */
const ActionForm = ({
  title,
  description,
  children,
  buttonProps,
  ...formProps
}: ActionFormProps) => {
  const { t } = useTranslation('technicalAssistance');

  const { id } = useParams<{
    id: string;
  }>();

  const { message } = useMessage();

  const {
    formState: { isSubmitting, isDirty }
  } = useFormContext();

  const [recipientFormOpen, setRecipientFormOpen] = useState<boolean>(false);

  const disableSubmit = useMemo(() => {
    return (
      recipientFormOpen ||
      !isDirty ||
      isSubmitting ||
      buttonProps?.next?.disabled
    );
  }, [recipientFormOpen, isDirty, isSubmitting, buttonProps?.next?.disabled]);

  return (
    <GridContainer className="width-full">
      <Breadcrumbs
        items={[
          { text: t('Home'), url: `/trb` },
          {
            text: t('adminHome.breadcrumb', { trbRequestId: id }),
            url: `/trb/${id}/initialRequestForm`
          },
          {
            // TODO: default breadcrumb logic
            text: t('Action text')
          }
        ]}
      />

      {message}

      <PageHeading className="margin-bottom-0">{title}</PageHeading>
      <p className="line-height-body-5 font-body-lg text-light margin-0">
        {t(description)}
      </p>

      <p className="margin-top-1 text-base">
        <Trans
          i18nKey="technicalAssistance:actionRequestEdits.fieldsMarkedRequired"
          components={{ red: <span className="text-red" /> }}
        />
      </p>

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

        <Recipients
          trbRequestId={id}
          setRecipientFormOpen={setRecipientFormOpen}
        />

        <Pager
          {...buttonProps}
          next={{
            ...buttonProps?.next,
            disabled: disableSubmit
          }}
          border={false}
          className={classNames('margin-top-5', buttonProps.className)}
          submitDisabled
        />
      </Form>
    </GridContainer>
  );
};

export default ActionForm;
