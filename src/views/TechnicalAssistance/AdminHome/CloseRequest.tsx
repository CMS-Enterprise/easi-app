import React, { useEffect, useMemo, useRef } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  Button,
  ButtonGroup,
  Form,
  FormGroup,
  GridContainer,
  IconArrowBack,
  Label,
  Modal,
  ModalFooter,
  ModalHeading,
  ModalRef,
  ModalToggleButton
} from '@trussworks/react-uswds';

import EmailRecipientFields from 'components/EmailRecipientFields';
import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import TextAreaField from 'components/shared/TextAreaField';
import useMessage from 'hooks/useMessage';
import useTRBAttendees from 'hooks/useTRBAttendees';
import CloseTrbRequestQuery from 'queries/CloseTrbRequestQuery';
import ReopenTrbRequestQuery from 'queries/ReopenTrbRequestQuery';
import {
  CloseTrbRequest,
  CloseTrbRequestVariables
} from 'queries/types/CloseTrbRequest';
import {
  ReopenTrbRequest,
  ReopenTrbRequestVariables
} from 'queries/types/ReopenTrbRequest';
import { TrbRecipientFields } from 'types/technicalAssistance';
import { trbActionSchema } from 'validations/trbRequestSchema';

import Breadcrumbs from '../Breadcrumbs';

interface CloseRequestFields extends TrbRecipientFields {
  text: string;
}

/**
 * Close or Re-open a request
 */
function CloseRequest() {
  const { t } = useTranslation('technicalAssistance');

  const { id, activePage, action } = useParams<{
    id: string;
    activePage: string;
    action: 'close-request' | 'reopen-request';
  }>();
  const history = useHistory();

  const { message, showMessage, showMessageOnNextPage } = useMessage();

  const requestUrl = `/trb/${id}/${activePage}`;

  let actionText: 'actionCloseRequest' | 'actionReopenRequest';

  if (action === 'close-request') {
    actionText = 'actionCloseRequest';
  } else {
    actionText = 'actionReopenRequest';
  }

  const {
    data: { attendees, requester, loading },
    createAttendee
  } = useTRBAttendees(id);

  const defaultValues: CloseRequestFields = useMemo(
    () => ({
      text: '',
      copyTrbMailbox: true,
      notifyEuaIds: requester?.userInfo?.euaUserId
        ? [requester?.userInfo?.euaUserId]
        : []
    }),
    [requester]
  );

  const formMethods = useForm<CloseRequestFields>({
    resolver: yupResolver(trbActionSchema('text')),
    defaultValues
  });

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { isSubmitting, isDirty }
  } = formMethods;

  const [mutateClose] = useMutation<CloseTrbRequest, CloseTrbRequestVariables>(
    CloseTrbRequestQuery
  );

  const [mutateReopen] = useMutation<
    ReopenTrbRequest,
    ReopenTrbRequestVariables
  >(ReopenTrbRequestQuery);

  // Confirm modal for closing a request
  const confirmModalRef = useRef<ModalRef>(null);

  const submitClose = handleSubmit(
    ({ text: reasonClosed, notifyEuaIds, copyTrbMailbox }) => {
      mutateClose({
        variables: {
          input: {
            id,
            reasonClosed,
            notifyEuaIds,
            copyTrbMailbox
          }
        }
      })
        .then(result => {
          showMessageOnNextPage(
            <Alert type="success" slim className="margin-top-3">
              {t(`${actionText}.success`)}
            </Alert>
          );
          history.push(`/trb/${id}/request`);
        })
        .catch(err => {
          showMessage(
            <Alert type="error" slim className="margin-top-3">
              {t(`${actionText}.error`)}
            </Alert>
          );
        });
    }
  );

  const submitReopen = handleSubmit(
    ({ text: reasonReopened, notifyEuaIds, copyTrbMailbox }) => {
      mutateReopen({
        variables: {
          input: {
            trbRequestId: id,
            reasonReopened,
            notifyEuaIds,
            copyTrbMailbox
          }
        }
      })
        .then(result => {
          showMessageOnNextPage(
            <Alert type="success" slim className="margin-top-3">
              {t(`${actionText}.success`)}
            </Alert>
          );
          history.push(`/trb/${id}/request`);
        })
        .catch(err => {
          showMessage(
            <Alert type="error" slim className="margin-top-3">
              {t(`${actionText}.error`)}
            </Alert>
          );
        });
    }
  );

  useEffect(() => {
    if (!isDirty && !loading) {
      reset(defaultValues);
    }
  }, [isDirty, loading, reset, defaultValues]);

  if (loading) return null;

  return (
    <GridContainer className="width-full">
      <Breadcrumbs
        items={[
          { text: t('Home'), url: `/trb` },
          {
            text: t('adminHome.breadcrumb', { trbRequestId: id }),
            url: requestUrl
          },
          {
            text: t('actionCloseRequest.breadcrumb')
          }
        ]}
      />

      {message}

      <PageHeading className="margin-bottom-0">
        {t(`${actionText}.heading`)}
      </PageHeading>
      <p className="line-height-body-5 font-body-lg text-light margin-0">
        {t(`${actionText}.description`)}
      </p>
      <Form
        onSubmit={e => e.preventDefault()}
        className="maxw-full margin-bottom-205 tablet:grid-col-12 desktop:grid-col-6"
      >
        <p className="margin-top-1 text-base">
          <Trans
            i18nKey="technicalAssistance:actionRequestEdits.fieldsMarkedRequired"
            components={{ red: <span className="text-red" /> }}
          />
        </p>
        <Controller
          name="text"
          control={control}
          render={({ field }) => (
            <FormGroup>
              <Label
                htmlFor="text"
                hint={
                  <div className="margin-top-1">{t(`${actionText}.hint`)}</div>
                }
                className="text-normal margin-top-6"
              >
                {t(`${actionText}.label`)}
              </Label>
              <TextAreaField
                {...field}
                ref={null}
                id="text"
                aria-describedby="text-info text-hint"
              />
            </FormGroup>
          )}
        />

        {action === 'close-request' && (
          <>
            <h3 className="margin-top-6 margin-bottom-0">
              {t('actionRequestEdits.notificationTitle')}
            </h3>
            <p className="margin-0 line-height-body-5">
              {t('actionRequestEdits.notificationDescription')}
            </p>

            <FormProvider {...formMethods}>
              <EmailRecipientFields
                requester={requester}
                attendees={attendees}
                createAttendee={input =>
                  createAttendee({ variables: { input } }).then(result =>
                    setValue('notifyEuaIds', [
                      ...getValues('notifyEuaIds'),
                      input.euaUserId
                    ])
                  )
                }
                className="margin-top-4 margin-bottom-3"
              />
            </FormProvider>

            <ModalToggleButton
              disabled={isSubmitting}
              modalRef={confirmModalRef}
              opener
            >
              {t('actionCloseRequest.submit')}
            </ModalToggleButton>

            <Modal
              ref={confirmModalRef}
              id="confirm-modal"
              aria-labelledby="confirm-modal-heading"
              aria-describedby="confirm-modal-description"
            >
              <ModalHeading
                id="confirm-modal-heading"
                className="margin-bottom-2"
              >
                {t('actionCloseRequest.confirmModal.heading')}
              </ModalHeading>
              <div id="confirm-modal-description" className="usa-prose">
                <p>{t('actionCloseRequest.confirmModal.text.0')}</p>
                <ul className="usa-list margin-top-0">
                  <li>{t('actionCloseRequest.confirmModal.text.1')}</li>
                  <li>{t('actionCloseRequest.confirmModal.text.2')}</li>
                  <li>{t('actionCloseRequest.confirmModal.text.3')}</li>
                </ul>
                <p>{t('actionCloseRequest.confirmModal.text.4')}</p>
              </div>
              <ModalFooter>
                <ButtonGroup>
                  <Button
                    type="button"
                    data-close-modal="true"
                    onClick={submitClose}
                  >
                    {t('actionCloseRequest.confirmModal.close')}
                  </Button>
                  <ModalToggleButton
                    modalRef={confirmModalRef}
                    closer
                    unstyled
                    className="padding-105 text-center"
                  >
                    {t('actionCloseRequest.confirmModal.cancel')}
                  </ModalToggleButton>
                </ButtonGroup>
              </ModalFooter>
            </Modal>
          </>
        )}

        {action === 'reopen-request' && (
          <Button type="submit" disabled={isSubmitting} onClick={submitReopen}>
            {t('actionReopenRequest.submit')}
          </Button>
        )}
      </Form>
      <UswdsReactLink
        to={requestUrl}
        className="display-flex flex-align-center"
      >
        <IconArrowBack className="margin-right-05" />
        {t('actionRequestEdits.cancelAndReturn')}
      </UswdsReactLink>
    </GridContainer>
  );
}

export default CloseRequest;
