import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  Button,
  ButtonGroup,
  Fieldset,
  Form,
  FormGroup,
  Modal,
  ModalFooter,
  ModalHeading,
  ModalRef,
  ModalToggleButton,
  Radio
} from '@trussworks/react-uswds';
import classnames from 'classnames';
import {
  useGetTrbLeadOptionsQuery,
  useUpdateTrbRequestLeadMutation
} from 'gql/generated/graphql';
import { AppState } from 'stores/reducers/rootReducer';

import useMessage from 'hooks/useMessage';
import { TrbRequestIdRef } from 'types/technicalAssistance';

type TrbAssignLeadModalOpenerProps = {
  trbRequestId: string;
  modalRef: React.RefObject<ModalRef>;
  trbRequestIdRef: React.MutableRefObject<TrbRequestIdRef>;
} & JSX.IntrinsicElements['button'];

/**
 * Button to open `<TrbAssignLeadModal>`.
 * Uses `trbRequestId` for `UpdateTrbRequestLeadQuery`.
 * This will set the request id and open the modal to assign a lead to that request.
 * The original ModalToggleButton onClick handler did not work as expected.
 */
export function TrbAssignLeadModalOpener({
  trbRequestId,
  modalRef,
  trbRequestIdRef,
  className,
  children,
  ...buttonProps
}: TrbAssignLeadModalOpenerProps) {
  return (
    <button
      {...buttonProps}
      type="button"
      className={classnames('usa-button', className)}
      onClick={e => {
        // eslint-disable-next-line no-param-reassign
        trbRequestIdRef.current = trbRequestId;
        modalRef.current?.toggleModal(e, true);
      }}

      // Suggested modal attr by uswds to open the modal
      // No effect here, js doesn't catch, use toggleModal()
      // data-open-modal="true"
    >
      {children}
    </button>
  );
}

type TrbAssignLeadModalProps = {
  modalRef: React.RefObject<ModalRef>;
  trbRequestIdRef: React.MutableRefObject<TrbRequestIdRef>;
};

/**
 * Modal for assigning a TRB Lead to a request.
 * Used in conjuction with `<TrbAssignLeadModalOpener>`.
 */
function TrbAssignLeadModal({
  modalRef,
  trbRequestIdRef
}: TrbAssignLeadModalProps) {
  const modalElementId = 'trb-assign-lead-modal';

  const { t } = useTranslation('technicalAssistance');

  const { euaId } = useSelector((state: AppState) => state.auth);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty }
  } = useForm({
    defaultValues: {
      trbLead: ''
    }
  });

  const { showMessage } = useMessage();

  const { data } = useGetTrbLeadOptionsQuery();

  const [mutate] = useUpdateTrbRequestLeadMutation();

  const submit = handleSubmit(formData => {
    if (!trbRequestIdRef.current) return;

    mutate({
      variables: {
        input: {
          trbRequestId: trbRequestIdRef.current,
          trbLead: formData.trbLead
        }
      }
    })
      .then(result => {
        showMessage(
          t(`assignTrbLeadModal.success`, {
            name: data?.trbLeadOptions.find(
              e => e.euaUserId === formData.trbLead
            )!.commonName
          }),
          {
            type: 'success',
            className: 'margin-top-3'
          }
        );
      })
      .catch(err => {
        showMessage(t(`assignTrbLeadModal.error`), {
          type: 'error',
          className: 'margin-top-3'
        });
      });

    reset();
  });

  // Reset the form state when the modal is closed
  // The truss modal does not expose a close event or hook
  // Use a mutation observer instead to check the modal for the `is-hidden` class
  useEffect(() => {
    const modalEl = document.getElementById(modalElementId);
    let observer: MutationObserver;
    if (modalEl) {
      observer = new MutationObserver(mutationList => {
        mutationList.forEach(mutation => {
          if (
            mutation.type === 'attributes' &&
            mutation.attributeName === 'class' &&
            (mutation.target as HTMLElement).classList.contains('is-hidden')
          ) {
            reset();
          }
        });
      });

      observer.observe(modalEl, { attributes: true });
    }

    return () => {
      observer?.disconnect();
    };

    // Run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Arrange options so that "Assigning myself" is first
  const myself = data?.trbLeadOptions.find(
    ({ euaUserId }) => euaUserId === euaId
  );
  const trbLeads = data?.trbLeadOptions.filter(
    ({ euaUserId }) => euaUserId !== euaId
  );
  if (myself) trbLeads?.unshift(myself);

  return (
    <Modal
      ref={modalRef}
      id={modalElementId}
      className={modalElementId}
      aria-labelledby={`${modalElementId}-heading`}
      aria-describedby={`${modalElementId}-description`}
    >
      <ModalHeading
        id={`${modalElementId}-heading`}
        className="margin-bottom-2"
      >
        {t('assignTrbLeadModal.heading')}
      </ModalHeading>
      <Form
        id={`${modalElementId}-description`}
        onSubmit={e => e.preventDefault()}
        className="maxw-full"
      >
        <Controller
          name="trbLead"
          control={control}
          render={({ field }) => (
            <FormGroup>
              <Fieldset legend={t('assignTrbLeadModal.label')}>
                {trbLeads?.map(({ euaUserId, commonName }) => (
                  <Radio
                    key={euaUserId}
                    id={`${field.name}-${euaUserId}`}
                    data-testid={`${field.name}-${euaUserId}`}
                    name={field.name}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    label={
                      euaId === euaUserId
                        ? t('assignTrbLeadModal.assignMyself')
                        : commonName
                    }
                    value={euaUserId}
                    checked={field.value === euaUserId}
                  />
                ))}
              </Fieldset>
            </FormGroup>
          )}
        />
      </Form>
      <ModalFooter>
        <ButtonGroup>
          <Button
            type="button"
            data-close-modal="true"
            disabled={isSubmitting || !isDirty}
            onClick={submit}
          >
            {t('assignTrbLeadModal.submit')}
          </Button>
          <ModalToggleButton
            modalRef={modalRef}
            closer
            unstyled
            className="padding-105 text-center"
          >
            {t('button.cancel')}
          </ModalToggleButton>
        </ButtonGroup>
      </ModalFooter>
    </Modal>
  );
}

export default TrbAssignLeadModal;
