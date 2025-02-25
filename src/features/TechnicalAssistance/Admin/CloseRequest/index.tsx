import React, { useRef } from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useHistory, useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  ButtonGroup,
  FormGroup,
  Label,
  Modal,
  ModalFooter,
  ModalHeading,
  ModalRef,
  ModalToggleButton
} from '@trussworks/react-uswds';
import {
  useCloseTRBRequestMutation,
  useReopenTRBRequestMutation
} from 'gql/generated/graphql';

import Spinner from 'components/Spinner';
import TextAreaField from 'components/TextAreaField';
import useMessage from 'hooks/useMessage';
import { TrbRecipientFields } from 'types/technicalAssistance';
import { trbActionSchema } from 'validations/trbRequestSchema';

import useActionForm from '../_components/ActionFormWrapper/useActionForm';

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

  const { showMessage, showMessageOnNextPage } = useMessage();

  const requestUrl = `/trb/${id}/${activePage}`;

  let actionText: 'actionCloseRequest' | 'actionReopenRequest';

  if (action === 'close-request') {
    actionText = 'actionCloseRequest';
  } else {
    actionText = 'actionReopenRequest';
  }

  const {
    control,
    ActionForm,
    handleSubmit,
    formState: { isSubmitting }
  } = useActionForm<CloseRequestFields>({
    trbRequestId: id,
    resolver: yupResolver(trbActionSchema('text')),
    defaultValues: {
      text: '',
      copyTrbMailbox: true,
      notifyEuaIds: []
    }
  });

  const [mutateClose, mutateCloseResult] = useCloseTRBRequestMutation();

  const [mutateReopen, mutateReopenResult] = useReopenTRBRequestMutation();

  const formSubmitting: boolean =
    isSubmitting || mutateCloseResult.loading || mutateReopenResult.loading;

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
          showMessageOnNextPage(t(`${actionText}.success`), {
            type: 'success',
            className: 'margin-top-3'
          });
          history.push(`/trb/${id}/request`);
        })
        .catch(err => {
          showMessage(t(`${actionText}.error`), {
            type: 'error',
            className: 'margin-top-3'
          });
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
          showMessageOnNextPage(t(`${actionText}.success`), {
            type: 'success',
            className: 'margin-top-3'
          });
          history.push(`/trb/${id}/request`);
        })
        .catch(err => {
          showMessage(t(`${actionText}.error`), {
            type: 'error',
            className: 'margin-top-3'
          });
        });
    }
  );

  return (
    <ActionForm
      title={t(`${actionText}.heading`)}
      description={t(`${actionText}.description`)}
      onSubmit={
        action === 'reopen-request' ? submitReopen : e => e.preventDefault()
      }
      breadcrumbItems={[
        {
          text: t('actionCloseRequest.breadcrumb')
        }
      ]}
      buttonProps={{
        next:
          action === 'reopen-request'
            ? {
                text: t('actionReopenRequest.submit'),
                disabled: formSubmitting,
                loading: formSubmitting
              }
            : undefined,
        // Close request modal button
        buttons:
          action === 'close-request'
            ? [
                <ModalToggleButton
                  disabled={isSubmitting}
                  modalRef={confirmModalRef}
                  className="margin-top-0"
                  opener
                >
                  {t('actionCloseRequest.submit')}
                </ModalToggleButton>
              ]
            : undefined,
        taskListUrl: requestUrl,
        saveExitText: t('actionRequestEdits.cancelAndReturn')
      }}
    >
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

      {
        /* Close Request modal */
        action === 'close-request' && (
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
                {formSubmitting && <Spinner className="margin-top-05" />}
              </ButtonGroup>
            </ModalFooter>
          </Modal>
        )
      }
    </ActionForm>
  );
}

export default CloseRequest;
