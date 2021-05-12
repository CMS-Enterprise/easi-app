import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button, Link as UswdsLink } from '@trussworks/react-uswds';
import { GetAccessibilityRequest_accessibilityRequest_testDates as TestDateType } from 'queries/types/GetAccessibilityRequest';

import Modal from 'components/Modal';
import PageHeading from 'components/PageHeading';
import { translateTestType } from 'utils/accessibilityRequest';
import { formatDate } from 'utils/date';

type TestDateCardProps = {
  testDate: TestDateType;
  testIndex: number;
  requestName: string;
  requestId: string;
  isEditableDeletable?: boolean;
  handleDeleteTestDate: (testDate: TestDateType) => void;
};

const TestDateCard = ({
  testDate,
  testIndex,
  requestName,
  requestId,
  isEditableDeletable = true,
  handleDeleteTestDate
}: TestDateCardProps) => {
  const [isRemoveTestDateModalOpen, setIsRemoveTestDateModalOpen] = useState(
    false
  );
  const { t } = useTranslation('accessibility');
  const { id, testType, date, score } = testDate;

  const testScore = () => {
    if (score === 0) {
      return '0%';
    }

    return score ? `${(score / 10).toFixed(1)}%` : 'Score not added';
  };
  return (
    <div className="bg-gray-10 padding-2 line-height-body-4 margin-bottom-2">
      <div className="text-bold margin-bottom-1">
        {`Test ${testIndex}: ${translateTestType(testType)}`}
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
            {t('general:edit')}
          </UswdsLink>
          <Button
            className="margin-left-1"
            type="button"
            onClick={() => setIsRemoveTestDateModalOpen(true)}
            aria-label={`Remove test ${testIndex} ${testType}`}
            unstyled
            data-testid="test-date-delete-button"
          >
            {t('general:remove')}
          </Button>
        </div>
      )}
      <Modal
        isOpen={isRemoveTestDateModalOpen}
        closeModal={() => {
          setIsRemoveTestDateModalOpen(false);
        }}
      >
        <PageHeading headingLevel="h2" className="margin-top-0">
          {t('removeTestDate.modalHeader', {
            testNumber: testIndex,
            testType: translateTestType(testDate.testType),
            testDate: formatDate(testDate.date),
            requestName
          })}
        </PageHeading>
        <p>{t('removeTestDate.modalText')}</p>
        <Button
          type="button"
          className="margin-right-4"
          onClick={() => {
            handleDeleteTestDate(testDate);
          }}
        >
          {t('removeTestDate.modalRemoveButton')}
        </Button>
        <Button
          type="button"
          unstyled
          onClick={() => {
            setIsRemoveTestDateModalOpen(false);
          }}
        >
          {t('removeTestDate.modalCancelButton')}
        </Button>
      </Modal>
    </div>
  );
};

export default TestDateCard;
