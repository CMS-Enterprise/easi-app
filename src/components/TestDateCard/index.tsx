import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Button, Link as UswdsLink } from '@trussworks/react-uswds';
import DeleteTestDateQuery from 'queries/DeleteTestDateQuery';
import { DeleteTestDate } from 'queries/types/DeleteTestDate';
import { GetAccessibilityRequest_accessibilityRequest_testDates as TestDateType } from 'queries/types/GetAccessibilityRequest';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import { formatDate } from 'utils/date';

type TestDateCardProps = {
  testDate: TestDateType;
  testIndex: number;
  requestId: string;
  requestName: string;
  id: string;
  isEditableDeletable?: boolean;
  refetchRequest: () => any;
};

const TestDateCard = ({
  testDate,
  testIndex,
  requestId,
  requestName,
  isEditableDeletable = true,
  refetchRequest
}: TestDateCardProps) => {
  const { t } = useTranslation('accessibility');
  const { id, testType, date, score } = testDate;

  const [deleteTestDateMutation] = useMutation<DeleteTestDate>(
    DeleteTestDateQuery,
    {
      errorPolicy: 'all'
    }
  );

  const [isRemoveTestDateModalOpen, setRemoveTestDateModalOpen] = useState(
    false
  );

  const deleteTestDate = () => {
    deleteTestDateMutation({
      variables: {
        input: {
          id
        }
      }
    }).then(refetchRequest);

    // TODO: display confirmation banner if mutation successful (removeTestDate.confirmation)
    // cannot use useConfirmationText hook since we are not changing URL - useContext()?
  };

  const testScore = () => {
    if (score === 0) {
      return '0%';
    }

    return score ? `${(score / 10).toFixed(1)}%` : 'Score not added';
  };
  return (
    <div className="bg-gray-10 padding-2 line-height-body-4 margin-bottom-2">
      <div className="text-bold margin-bottom-1">
        Test {testIndex}: {testType === 'INITIAL' ? 'Initial' : 'Remediation'}
      </div>
      <div className="margin-bottom-1">
        <div className="display-inline-block margin-right-2">
          {formatDate(date)}
        </div>
        <div
          className="display-inline-block text-base-dark"
          data-testid="score"
        >
          {testScore()}
        </div>
      </div>

      {isEditableDeletable && (
        <div>
          <UswdsLink
            asCustom={Link}
            to={`/508/requests/${requestId}/test-date/${id}`}
            aria-label={`Edit test ${testIndex} ${testType}`}
            data-testid="test-date-edit-link"
          >
            Edit
          </UswdsLink>
          <Button
            className="margin-left-1"
            type="button"
            aria-label={`Remove test ${testIndex} ${testType}`}
            unstyled
            onClick={() => {
              setRemoveTestDateModalOpen(true);
            }}
            data-testid="test-date-delete-button"
          >
            Remove
          </Button>
          <Modal
            isOpen={isRemoveTestDateModalOpen}
            closeModal={() => {
              setRemoveTestDateModalOpen(false);
            }}
          >
            <PageHeading headingLevel="h2" className="margin-top-0">
              {t('removeTestDate.modalHeader', {
                testNumber: testIndex,
                testType,
                testDate: formatDate(date),
                requestName
              })}
            </PageHeading>
            <p>{t('removeTestDate.modalText')}</p>
            <Button
              type="button"
              className="margin-right-4"
              onClick={() => {
                deleteTestDate();
                setRemoveTestDateModalOpen(false);
              }}
            >
              {t('removeTestDate.modalRemoveButton')}
            </Button>
            <Button
              type="button"
              unstyled
              onClick={() => {
                setRemoveTestDateModalOpen(false);
              }}
            >
              {t('removeTestDate.modalCancelButton')}
            </Button>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default TestDateCard;
