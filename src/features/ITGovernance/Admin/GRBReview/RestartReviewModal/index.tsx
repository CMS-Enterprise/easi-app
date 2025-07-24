import React, { ReactEventHandler, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Button,
  DatePicker,
  FormGroup,
  Label,
  ModalFooter,
  ModalHeading
} from '@trussworks/react-uswds';
import { actionDateInPast } from 'features/ITGovernance/Admin/Actions/ManageLcid/RetireLcid';
import {
  GetSystemIntakeDocument,
  GetSystemIntakeGRBReviewDocument,
  useRestartGRBReviewAsyncMutation
} from 'gql/generated/graphql';

import Alert from 'components/Alert';
import HelpText from 'components/HelpText';
import Modal from 'components/Modal';
import RequiredFieldsText from 'components/RequiredFieldsText';
import { useMessage } from 'hooks/useMessage';
import { formatDateLocal, formatToUTCISO } from 'utils/date';

import { useRestartReviewModal } from './RestartReviewModalContext';

import './index.scss';

const RestartReviewModal = ({ systemIntakeId }: { systemIntakeId: string }) => {
  const { t } = useTranslation('grbReview');
  const { isOpen, closeModal } = useRestartReviewModal();
  const { errorMessageInModal, showErrorMessageInModal, showMessage } =
    useMessage();
  const [selectedDate, setSelectedDate] = useState<string>('');

  const [restartReview] = useRestartGRBReviewAsyncMutation({
    refetchQueries: [GetSystemIntakeGRBReviewDocument, GetSystemIntakeDocument]
  });

  const handleCloseModal = () => {
    closeModal();
    showErrorMessageInModal('');
  };

  const handleSubmit: ReactEventHandler = event => {
    event.preventDefault();

    restartReview({
      variables: {
        input: {
          systemIntakeID: systemIntakeId,
          newGRBEndDate: selectedDate
        }
      }
    })
      .then(() => {
        showMessage(
          <Trans
            i18nKey="grbReview:adminTask.restartReview.success"
            components={{ bold: <strong /> }}
            values={{ date: formatDateLocal(selectedDate, 'MM/dd/yyyy') }}
          />,
          {
            type: 'success'
          }
        );

        // Close modal on success
        handleCloseModal();
      })
      .catch(() => {
        showErrorMessageInModal(t('adminTask.restartReview.error'));
      });
  };

  return (
    <Modal
      isOpen={isOpen}
      shouldCloseOnOverlayClick
      closeModal={handleCloseModal}
      className="easi-modal__content--narrow"
    >
      <div data-testid="restart-review-modal">
        <ModalHeading>{t('adminTask.restartReview.title')}</ModalHeading>
        {errorMessageInModal && (
          <Alert type="error" className="margin-top-2">
            {errorMessageInModal}
          </Alert>
        )}
        <p className="margin-y-0">{t('adminTask.restartReview.description')}</p>
        <form onSubmit={handleSubmit}>
          <FormGroup className="margin-y-0">
            <RequiredFieldsText className="margin-top-2 margin-bottom-3 font-body-sm" />
            <Label
              htmlFor="grbReviewAsyncEndDate"
              requiredMarker
              className="margin-top-0"
            >
              {t('adminTask.restartReview.setNewEndDateLabel')}
            </Label>
            <HelpText
              id="grbReviewAsyncEndDateHelpText"
              className="margin-top-1"
            >
              {t('adminTask.restartReview.setNewEndDateHelpText')}
            </HelpText>

            {/* Uses basic DatePicker instead of DatePickerFormatted to avoid issue with e2e tests */}
            {/* DatePickerFormatted input was cycling through random dates after using cy.type() */}
            <DatePicker
              id="grbReviewAsyncEndDate"
              name="grbReviewAsyncEndDate"
              className="date-picker-override"
              aria-describedby="grbReviewAsyncEndDateHelpText"
              onChange={val => {
                // const formattedDate = formatEndOfDayDeadline(val || '');
                const formattedDate = formatToUTCISO(val || '', 'MM/dd/yyyy');
                setSelectedDate(formattedDate);
              }}
            />

            {actionDateInPast(selectedDate) && (
              <Alert type="warning" slim>
                {t('action:pastDateAlert')}
              </Alert>
            )}
          </FormGroup>
          <ModalFooter>
            <Button
              type="submit"
              className="margin-top-0 margin-bottom-2 margin-right-3 tablet:margin-bottom-0"
              disabled={!selectedDate || actionDateInPast(selectedDate)}
            >
              {t('adminTask.restartReview.restart')}
            </Button>
            <Button type="button" onClick={handleCloseModal} unstyled>
              {t('adminTask.restartReview.cancel')}
            </Button>
          </ModalFooter>
        </form>
      </div>
    </Modal>
  );
};

export default RestartReviewModal;
