import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Button, Link as UswdsLink } from '@trussworks/react-uswds';
import DeleteTestDateQuery from 'queries/DeleteTestDateQuery';
import { DeleteTestDate } from 'queries/types/DeleteTestDate';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import { formatDate } from 'utils/date';

type TestDateCardProps = {
  date: string; // ISO string
  type: 'INITIAL' | 'REMEDIATION';
  testIndex: number;
  score: number | null; // A whole number representing tenths of a percent
  requestId: string;
  requestName: string;
  id: string;
  refetchRequest: () => any;
};

const TestDateCard = ({
  date,
  type,
  testIndex,
  score,
  requestId,
  requestName,
  id,
  refetchRequest
}: TestDateCardProps) => {
  const { t } = useTranslation('accessibility');

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
        Test {testIndex}: {type === 'INITIAL' ? 'Initial' : 'Remediation'}
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
      <div>
        <UswdsLink
          asCustom={Link}
          to={`/508/requests/${requestId}/test-date/${id}`}
          aria-label={`Edit test ${testIndex} ${type}`}
        >
          Edit
        </UswdsLink>
        <Button
          className="margin-left-1"
          type="button"
          aria-label={`Remove test ${testIndex} ${type}`}
          unstyled
          onClick={() => {
            setRemoveTestDateModalOpen(true);
          }}
        >
          Remove
        </Button>
        <Modal
          title="Title"
          isOpen={isRemoveTestDateModalOpen}
          closeModal={() => {
            setRemoveTestDateModalOpen(false);
          }}
        >
          <PageHeading headingLevel="h2" className="margin-top-0">
            {t('removeTestDate.modalHeader', {
              testNumber: testIndex,
              testType: type,
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
    </div>
  );
};

export default TestDateCard;
