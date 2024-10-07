import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader
} from '@trussworks/react-uswds';

import TaskStatusTag from 'components/shared/TaskStatusTag';
import { GetTrbRequestHome_trbRequest as GetTrbRequestHomeType } from 'queries/types/GetTrbRequestHome';
import {
  TRBAdviceLetterStatus,
  TRBFormStatus
} from 'types/graphql-global-types';
import { formatDateLocal } from 'utils/date';

import './index.scss';

type InformationCardProps = {
  trbRequest: GetTrbRequestHomeType;
  type: 'initialRequestForm' | 'adviceLetter';
};

interface CardDetailsType {
  header: string;
  description: string;
  status: TRBAdviceLetterStatus | TRBFormStatus;
  buttonText: string;
  buttonClass: string;
  buttonLink: string;
  modified: string;
  disabled: boolean;
}

// Card component for rendering TRB Forms/Documents summary
// ex: <RequestHome />
const InformationCard = ({ trbRequest, type }: InformationCardProps) => {
  const { t } = useTranslation('technicalAssistance');

  const history = useHistory();

  let cardDetails: CardDetailsType = {
    header: '',
    description: '',
    status: TRBFormStatus.READY_TO_START,
    buttonText: '',
    buttonClass: '',
    buttonLink: '',
    modified: '',
    disabled: false
  };

  const returnAdviceText = () => {
    if (
      trbRequest.taskStatuses.adviceLetterStatus ===
        TRBAdviceLetterStatus.CANNOT_START_YET ||
      trbRequest.taskStatuses.adviceLetterStatus ===
        TRBAdviceLetterStatus.READY_TO_START
    ) {
      return t('adminHome.startGuidance');
    }
    if (
      trbRequest.taskStatuses.adviceLetterStatus ===
      TRBAdviceLetterStatus.COMPLETED
    ) {
      return t('adminHome.view');
    }
    return t('adminHome.viewGuidance');
  };

  switch (type) {
    case 'initialRequestForm':
      cardDetails = {
        header: t('adminHome.initialRequest'),
        description: t('adminHome.completedBy'),
        status: trbRequest.taskStatuses.formStatus,
        buttonText: t('adminHome.view'),
        buttonClass: 'usa-button--outline',
        buttonLink: 'initial-request-form',
        modified: trbRequest.form.modifiedAt
          ? formatDateLocal(trbRequest.form.modifiedAt, 'MMMM d, yyyy')
          : t('adminHome.notStarted'),
        disabled: false
      };
      break;
    case 'adviceLetter':
      cardDetails = {
        header: t('adminHome.guidanceLetter'),
        description: t('adminHome.toBeCompleted'),
        status: trbRequest.taskStatuses.adviceLetterStatus,
        buttonText: returnAdviceText(),
        buttonClass:
          trbRequest.taskStatuses.adviceLetterStatus ===
          TRBAdviceLetterStatus.COMPLETED
            ? 'usa-button--outline'
            : '',
        buttonLink: 'advice',
        modified: trbRequest.adviceLetter?.modifiedAt
          ? formatDateLocal(trbRequest.adviceLetter.modifiedAt, 'MMMM d, yyyy')
          : t('adminHome.notStarted'),
        disabled:
          trbRequest.taskStatuses.adviceLetterStatus ===
          TRBAdviceLetterStatus.CANNOT_START_YET
      };
      break;
    default:
      break;
  }

  return (
    <Card className="flex-1 information-card margin-bottom-2">
      <CardHeader>
        <h3 className="margin-0">{cardDetails.header}</h3>
        <p className="text-base margin-0">{cardDetails.description}</p>
      </CardHeader>

      <CardBody>
        <div className="display-flex flex-align-center line-height-body-5 margin-bottom-2">
          <TaskStatusTag status={cardDetails.status} />
        </div>

        <dt className="text-bold">{t('adminHome.lastUpdated')}</dt>
        <dd className="margin-left-0 margin-bottom-1">
          {cardDetails.modified}
        </dd>
      </CardBody>

      <CardFooter>
        <Button
          type="button"
          className={cardDetails.buttonClass}
          disabled={cardDetails.disabled}
          onClick={() => history.push(cardDetails.buttonLink)}
        >
          {cardDetails.buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InformationCard;
