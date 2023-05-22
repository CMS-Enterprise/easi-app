import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Form, GridContainer } from '@trussworks/react-uswds';
import classNames from 'classnames';

import PageHeading from 'components/PageHeading';
// import useMessage from 'hooks/useMessage';
import Breadcrumbs from 'views/TechnicalAssistance/Breadcrumbs'; // BreadcrumbsProps

import Recipients from './Recipients';

type FormProps = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
  large?: boolean;
  search?: boolean;
} & JSX.IntrinsicElements['form'];

export type ActionFormProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  // breadcrumbItems: BreadcrumbsProps['items'];
} & FormProps;

/**
 * Wrapper for TRB action forms
 */
const ActionForm = ({
  title,
  description,
  children,
  ...formProps
}: ActionFormProps) => {
  const { t } = useTranslation('technicalAssistance');

  const { id } = useParams<{
    id: string;
  }>();

  // const {
  //   message
  //   // showMessage,
  //   // showMessageOnNextPage
  // } = useMessage();

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

      {/* {message} */}

      <PageHeading className="margin-bottom-0">{t(title)}</PageHeading>
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
        className={classNames('maxw-none', formProps.className)}
      >
        {children}

        <h3 className="margin-top-6 margin-bottom-0">
          {t('actionRequestEdits.notificationTitle')}
        </h3>
        <p className="margin-0 line-height-body-5">
          {t('actionRequestEdits.notificationDescription')}
        </p>

        <Recipients trbRequestId={id} />
      </Form>
    </GridContainer>
  );
};

export default ActionForm;
