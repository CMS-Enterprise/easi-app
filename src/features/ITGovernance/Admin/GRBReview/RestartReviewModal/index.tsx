import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import {
  Alert,
  Button,
  FormGroup,
  Label,
  ModalFooter,
  ModalHeading
} from '@trussworks/react-uswds';

import DatePickerFormatted from 'components/DatePickerFormatted';
import HelpText from 'components/HelpText';
import Modal from 'components/Modal';
import RequiredFieldsText from 'components/RequiredFieldsText';
import { useMessage } from 'hooks/useMessage';
import { formatDateLocal } from 'utils/date';

import { useRestartReviewModal } from './RestartReviewModalContext';

import './index.scss';

const RestartReviewModal = ({ systemIntakeId }: { systemIntakeId: string }) => {
  const { t } = useTranslation('grbReview');
  const { isOpen, closeModal } = useRestartReviewModal();
  const { errorMessageInModal, showErrorMessageInModal, showMessage } =
    useMessage();
  const [selectedDate, setSelectedDate] = useState<string>('');

  // TODO: Uncomment this once the mutation is ready
  // const [restartReview] =
  //   useUpdateSystemIntakeGRBReviewFormInputTimeframeAsyncMutation({
  //     refetchQueries: [GetSystemIntakeGRBReviewDocument]
  //   });

  const handleRestartReview = async () => {
    try {
      // await restartReview({
      //   variables: {
      //     input: {
      //       systemIntakeID: systemIntakeId,
      //       grbReviewAsyncEndDate: selectedDate,
      //       startGRBReview: true
      //     }
      //   }
      // });

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
      closeModal();
    } catch (error) {
      showErrorMessageInModal(t('adminTask.restartReview.error'));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      shouldCloseOnOverlayClick
      closeModal={closeModal}
      className="easi-modal__content--narrow"
    >
      <div data-testid="restart-review-modal">
        <ModalHeading>{t('adminTask.restartReview.title')}</ModalHeading>
        {errorMessageInModal && (
          <Alert type="error" className="margin-top-2" headingLevel="h4">
            {errorMessageInModal}
          </Alert>
        )}
        <p className="margin-top-1">
          {t('adminTask.restartReview.description')}
        </p>
        <FormGroup>
          <RequiredFieldsText className="margin-top-0 font-body-sm" />
          <Label htmlFor="grbReviewAsyncEndDate" requiredMarker>
            {t('adminTask.restartReview.setNewEndDateLabel')}
          </Label>
          <HelpText className="margin-top-1">
            {t('adminTask.restartReview.setNewEndDateHelpText')}
          </HelpText>
          <DatePickerFormatted
            id="grbReviewAsyncEndDate"
            name="grbReviewAsyncEndDate"
            className="date-picker-override"
            onChange={val => setSelectedDate(val || '')}
            value={selectedDate}
          />
        </FormGroup>
        <ModalFooter>
          <Button
            type="button"
            className="margin-top-0 margin-bottom-2 margin-right-3 tablet:margin-bottom-0"
            onClick={handleRestartReview}
            disabled={!selectedDate}
          >
            {t('adminTask.restartReview.restart')}
          </Button>
          <Button type="button" onClick={closeModal} unstyled>
            {t('adminTask.restartReview.cancel')}
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
};

export default RestartReviewModal;
