import React, { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import {
  Alert,
  Button,
  ButtonGroup,
  CharacterCount,
  Form,
  FormGroup,
  Grid,
  GridContainer,
  IconArrowBack,
  Label,
  Modal,
  ModalFooter,
  ModalHeading,
  ModalRef,
  ModalToggleButton
} from '@trussworks/react-uswds';

import UswdsReactLink from 'components/LinkWrapper';
import PageHeading from 'components/PageHeading';
import useMessage from 'hooks/useMessage';
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

import Breadcrumbs from './Breadcrumbs';

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
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm({
    defaultValues: {
      text: ''
    }
  });

  const [mutateClose] = useMutation<CloseTrbRequest, CloseTrbRequestVariables>(
    CloseTrbRequestQuery
  );

  const [mutateReopen] = useMutation<
    ReopenTrbRequest,
    ReopenTrbRequestVariables
  >(ReopenTrbRequestQuery);

  // Confirm modal for closing a request
  const confirmModalRef = useRef<ModalRef>(null);

  const submitClose = handleSubmit(formData => {
    mutateClose({
      variables: {
        input: {
          id,
          reasonClosed: formData.text,
          notifyEuaIds: ['ABCD'] // todo
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
  });

  const submitReopen = handleSubmit(formData => {
    mutateReopen({
      variables: {
        input: {
          trbRequestId: id,
          reasonReopened: formData.text
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
  });

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

      <Grid row>
        <PageHeading className="margin-bottom-0">
          {t(`${actionText}.heading`)}
        </PageHeading>
        <div className="line-height-body-5 font-body-lg text-light">
          {t(`${actionText}.description`)}
        </div>
      </Grid>
      <Grid row gap>
        <Grid tablet={{ col: 12 }} desktop={{ col: 6 }}>
          <Form onSubmit={e => e.preventDefault()} className="maxw-full">
            <div className="margin-top-1 text-base">
              <Trans
                i18nKey="technicalAssistance:actionRequestEdits.fieldsMarkedRequired"
                components={{ red: <span className="text-red" /> }}
              />
            </div>
            <Controller
              name="text"
              control={control}
              render={({ field }) => (
                <FormGroup>
                  <Label
                    htmlFor="text"
                    hint={
                      <div className="margin-top-1">
                        {t(`${actionText}.hint`)}
                      </div>
                    }
                    className="text-normal margin-top-6"
                  >
                    {t(`${actionText}.label`)}
                  </Label>
                  <CharacterCount
                    {...field}
                    ref={null}
                    id="text"
                    maxLength={2000}
                    isTextArea
                    rows={2}
                    aria-describedby="text-info text-hint"
                  />
                </FormGroup>
              )}
            />

            {action === 'close-request' && (
              <>
                <h3 className="margin-top-6">
                  {t('actionRequestEdits.notificationTitle')}
                </h3>
                <div>{t('actionRequestEdits.notificationDescription')}</div>

                {/* todo cedar contacts */}

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
              <Button
                type="submit"
                disabled={isSubmitting}
                onClick={submitReopen}
              >
                {t('actionReopenRequest.submit')}
              </Button>
            )}
          </Form>
        </Grid>
      </Grid>
      <div className="margin-top-2">
        <UswdsReactLink to={requestUrl}>
          <IconArrowBack className="margin-right-05 margin-bottom-2px text-tbottom" />
          {t('actionRequestEdits.cancelAndReturn')}
        </UswdsReactLink>
      </div>
    </GridContainer>
  );
}

export default CloseRequest;
