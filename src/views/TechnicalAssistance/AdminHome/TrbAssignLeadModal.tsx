import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import {
  Alert,
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

import useMessage from 'hooks/useMessage';
import {
  UpdateTrbRequestLead,
  UpdateTrbRequestLeadVariables
} from 'queries/types/UpdateTrbRequestLead';
import UpdateTrbRequestLeadQuery from 'queries/UpdateTrbRequestLeadQuery';

export type TrbRequestIdRef = string | null;
export type TrbRequestIdRefObject = React.MutableRefObject<TrbRequestIdRef>;

type TrbAssignLeadModalOpenerProps = {
  trbRequestId: string;
  modalRef: React.RefObject<ModalRef>;
  trbRequestIdRef: TrbRequestIdRefObject;
} & JSX.IntrinsicElements['button'];

export function TrbAssignLeadModalOpener({
  trbRequestId,
  modalRef,
  trbRequestIdRef,
  className,
  ...buttonProps
}: TrbAssignLeadModalOpenerProps) {
  const { t } = useTranslation('technicalAssistance');

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

      // Suggested modal attr by uswds, but no effect here, js doesn't catch
      // data-open-modal="true"
    >
      {t('adminHome.request.assignLead')}
    </button>
  );
}

const todoTrbLeads = [
  { name: 'Aye Bee', euaId: 'ABCD' },
  { name: 'You', euaId: 'AAAA' },
  { name: 'Everyone', euaId: 'AXYZ' }
];

type TrbAssignLeadModalProps = {
  modalRef: React.RefObject<ModalRef>;
  trbRequestIdRef: TrbRequestIdRefObject;
};

function TrbAssignLeadModal({
  modalRef,
  trbRequestIdRef
}: TrbAssignLeadModalProps) {
  const modalElementId = 'trb-assign-lead-modal';

  const { t } = useTranslation('technicalAssistance');

  const {
    control,
    handleSubmit,
    // watch,
    reset,
    formState: { isSubmitting, isDirty }
  } = useForm({
    defaultValues: {
      trbLead: ''
    }
  });

  const { showMessage } = useMessage();

  const [mutate] = useMutation<
    UpdateTrbRequestLead,
    UpdateTrbRequestLeadVariables
  >(UpdateTrbRequestLeadQuery);

  const submit = handleSubmit(formData => {
    // console.log('formData', formData, trbRequestIdRef.current);

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
          <Alert type="success" slim className="margin-top-3">
            {t(`assignTrbLeadModal.success`, {
              name: todoTrbLeads.find(e => e.euaId === formData.trbLead)!.name
            })}
          </Alert>
        );
      })
      .catch(err => {
        showMessage(
          <Alert type="error" slim className="margin-top-3">
            {t(`assignTrbLeadModal.error`)}
          </Alert>
        );
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
            mutation.attributeName === 'class'
          ) {
            if (
              (mutation.target as HTMLElement).classList.contains('is-hidden')
            ) {
              reset();
            }
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

  // console.log('watch', JSON.stringify(watch(), null, 2));

  return (
    <Modal
      ref={modalRef}
      id={modalElementId}
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
                {todoTrbLeads.map(selection => (
                  <Radio
                    key={selection.euaId}
                    id={`${field.name}-${selection.euaId}`}
                    data-testid={`${field.name}-${selection.euaId}`}
                    name={field.name}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    label={selection.name}
                    value={selection.euaId}
                    checked={field.value === selection.euaId}
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
