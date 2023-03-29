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
import { TRBAdviceLetterStatus } from 'types/graphql-global-types';
import { formatDateLocal } from 'utils/date';

import './index.scss';

type InformationCardProps = {
  trbRequest: GetTrbRequestHomeType;
  type: 'inititalRequestForm' | 'adviceLetter';
};

interface RenderPropsType {
  header: string;
  description: string;
  buttonText: string;
  buttonClass: string;
  buttonLink: string;
  modified: string;
  disabled: boolean;
}

const InformationCard = ({ trbRequest, type }: InformationCardProps) => {
  const { t } = useTranslation('technicalAssistance');

  const history = useHistory();

  let renderProps: RenderPropsType = {
    header: '',
    description: '',
    buttonText: '',
    buttonClass: '',
    buttonLink: '',
    modified: '',
    disabled: false
  };

  switch (type) {
    case 'inititalRequestForm':
      renderProps = {
        header: t('adminHome.initialRequest'),
        description: t('adminHome.completedBy'),
        buttonText: t('adminHome.view'),
        buttonClass: 'usa-button--outline',
        buttonLink: 'request/initial-request-form',
        modified: trbRequest.form.modifiedAt
          ? formatDateLocal(trbRequest.form.modifiedAt, 'MM/dd/yyyy')
          : t('adminHome.notStarted'),
        disabled: false
      };
      break;
    case 'adviceLetter':
      renderProps = {
        header: t('adminHome.adviceLetter'),
        description: t('adminHome.toBeCompleted'),
        buttonText:
          trbRequest.taskStatuses.adviceLetterStatus ===
            TRBAdviceLetterStatus.CANNOT_START_YET ||
          trbRequest.taskStatuses.adviceLetterStatus ===
            TRBAdviceLetterStatus.READY_TO_START
            ? t('adminHome.startAdvice')
            : t('adminHome.viewAdvice'),
        buttonClass: '',
        buttonLink: 'request/advice-letter',
        modified: trbRequest.adviceLetter?.modifiedAt
          ? formatDateLocal(trbRequest.adviceLetter.modifiedAt, 'MM/dd/yyyy')
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
        <h3 className="margin-0">{renderProps.header}</h3>
        <p className="text-base margin-0">{renderProps.description}</p>
      </CardHeader>

      <CardBody>
        <div className="display-flex flex-align-center line-height-body-5 margin-bottom-2">
          <TaskStatusTag status={trbRequest.taskStatuses.formStatus} />
        </div>

        <dt className="text-bold">{t('adminHome.lastUpdated')}</dt>
        <dd className="margin-left-0 margin-bottom-1">
          {renderProps.modified}
        </dd>
      </CardBody>

      <CardFooter>
        <Button
          type="button"
          className={renderProps.buttonClass}
          disabled={renderProps.disabled}
          onClick={() => history.push(renderProps.buttonLink)}
        >
          {renderProps.buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default InformationCard;
