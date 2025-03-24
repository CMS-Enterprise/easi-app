import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader } from '@trussworks/react-uswds';
import classNames from 'classnames';
import {
  SystemIntakeFragmentFragment,
  SystemIntakeGRBReviewType
} from 'gql/generated/graphql';
import ITGovAdminContext from 'wrappers/ITGovAdminContext/ITGovAdminContext';

import UswdsReactLink from 'components/LinkWrapper';
import Tag from 'components/Tag';
import { formatDateUtc } from 'utils/date';

// TODO: Temp status type;
export enum GRBReviewStatus {
  SCHEDULED,
  IN_PROGRESS,
  COMPLETED
}

export type GRBReviewStatusCardProps = {
  grbVotingInformation: SystemIntakeFragmentFragment['grbVotingInformation'];
  className?: string;
};

const renderBGColor = (grbReviewStatus: GRBReviewStatus) => {
  if (grbReviewStatus === GRBReviewStatus.COMPLETED) {
    return 'bg-success-lighter';
  }
  return 'bg-primary-lighter';
};

const DecisionRecordCard = ({
  grbVotingInformation,
  className
}: GRBReviewStatusCardProps) => {
  const { t } = useTranslation('grbReview');

  const isITGovAdmin = useContext(ITGovAdminContext);

  if (!isITGovAdmin) {
    return null;
  }

  return <></>;
};

export default DecisionRecordCard;
