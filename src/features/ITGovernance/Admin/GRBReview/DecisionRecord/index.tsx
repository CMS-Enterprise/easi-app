import React from 'react';
import { useTranslation } from 'react-i18next';
import { GridContainer, Icon } from '@trussworks/react-uswds';
import { SystemIntakeGRBReviewFragment } from 'gql/generated/graphql';

import Breadcrumbs from 'components/Breadcrumbs';
import IconLink from 'components/IconLink';

import DecisionRecordTable from './_components/DecisionRecordTable';

type DecisionRecordProps = {
  grbReview: SystemIntakeGRBReviewFragment;
};

/**
 * System intake GRB review decision record page
 * */
const DecisionRecord = ({ grbReview }: DecisionRecordProps) => {
  const { t } = useTranslation('grbReview');

  return (
    <GridContainer className="padding-bottom-10">
      <Breadcrumbs
        items={[
          { text: t('Home'), url: '/' },
          {
            text: t('governanceReviewTeam:itGovernanceRequestDetails'),
            url: `/it-governance/${grbReview.id}/intake-request`
          },
          {
            text: t('decisionRecord.breadcrumb')
          }
        ]}
      />

      <h1 className="margin-top-5 margin-bottom-105">
        {t('decisionCard.heading')}
      </h1>

      <p className="font-body-lg text-light margin-top-0">
        {t('decisionRecord.description')}
      </p>

      <IconLink
        icon={<Icon.ArrowBack />}
        to={`/it-governance/${grbReview.id}/intake-request`}
      >
        {t('decisionRecord.returnToRequestDetails')}
      </IconLink>

      <DecisionRecordTable
        grbReviewers={grbReview.grbVotingInformation.grbReviewers}
      />
    </GridContainer>
  );
};

export default DecisionRecord;
