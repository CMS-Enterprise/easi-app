import React, { useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { ComboBox, FormGroup } from '@trussworks/react-uswds';
import { useGetGRBReviewersComparisonsQuery } from 'gql/gen/graphql';

import Alert from 'components/shared/Alert';
import Divider from 'components/shared/Divider';
import HelpText from 'components/shared/HelpText';
import Label from 'components/shared/Label';
import Spinner from 'components/Spinner';
import { GRBReviewerComparisonIntake } from 'types/grbReview';

type BulkAddGRBReviewersFormProps = {
  systemId: string;
};

const BulkAddGRBReviewersForm = ({
  systemId
}: BulkAddGRBReviewersFormProps) => {
  const { t } = useTranslation('grbReview');

  const [activeITGovernanceRequestId, setActiveITGovernanceRequestId] =
    useState<string>();

  const { data, loading } = useGetGRBReviewersComparisonsQuery({
    variables: {
      id: systemId
    }
  });

  const itGovernanceRequests = data?.compareGRBReviewersByIntakeID;

  const grbReviewersArray:
    | GRBReviewerComparisonIntake[number]['reviewers']
    | undefined = useMemo(() => {
    if (!activeITGovernanceRequestId) return undefined;

    return itGovernanceRequests?.find(
      ({ id }) => id === activeITGovernanceRequestId
    )?.reviewers;
  }, [activeITGovernanceRequestId, itGovernanceRequests]);

  if (loading || !itGovernanceRequests) return <Spinner />;

  return (
    <>
      <p className="line-height-body-5 margin-top-3 tablet:grid-col-6">
        {t('form.addFromRequestDescription')}
      </p>

      <FormGroup className="tablet:grid-col-6">
        <Label
          htmlFor="itGovernanceRequests"
          className="text-normal margin-bottom-05"
        >
          {t('form.itGovernanceRequests')}
        </Label>
        <HelpText id="itGovernanceRequestsHelpText">
          {t('form.itGovernanceRequestsHelpText')}
        </HelpText>

        <ComboBox
          id="itGovernanceRequests"
          name="itGovernanceRequests"
          className="maxw-none"
          onChange={id => setActiveITGovernanceRequestId(id)}
          options={itGovernanceRequests.map(request => ({
            label: request.requestName,
            value: request.id
          }))}
        />
      </FormGroup>

      <div
        className={
          grbReviewersArray ? 'tablet:grid-col-9' : 'tablet:grid-col-6'
        }
      >
        {grbReviewersArray ? (
          <>
            <p className="margin-top-6">
              <Trans
                i18nKey="grbReview:form.grbReviewerResults"
                count={grbReviewersArray.length}
              />
            </p>
            <ul>
              {grbReviewersArray.map(reviewer => (
                <li key={reviewer.id}>{reviewer.userAccount.commonName}</li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <Alert type="info" className="margin-top-3" slim>
              {t('form.selectRequestAlert')}
            </Alert>

            <Divider className="margin-top-6" />
          </>
        )}
      </div>
    </>
  );
};

export default BulkAddGRBReviewersForm;
