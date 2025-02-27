import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { SystemIntakeDecisionState } from 'gql/generated/graphql';

import PageHeading from 'components/PageHeading';
import { SystemIntakeState } from 'types/graphql-global-types';

type ResolutionTitleBoxProps = {
  title: string;
  systemIntakeId: string;
  state: SystemIntakeState;
  decisionState: SystemIntakeDecisionState;
};

/**
 * Displays selected resolution and link to change
 */
const ResolutionTitleBox = ({
  title,
  systemIntakeId,
  state,
  decisionState
}: ResolutionTitleBoxProps) => {
  const { t } = useTranslation('action');

  return (
    <>
      <div className="desktop:display-flex desktop:flex-align-end">
        <PageHeading className="margin-bottom-0">
          {t('resolutions.title', {
            context: decisionState,
            action: t('resolutions.action', { context: state })
          })}
        </PageHeading>
        <p className="font-body-lg text-base margin-bottom-05 margin-y-1 desktop:margin-left-2 desktop:margin-bottom-05">
          {t('resolutions.step', { step: 2 })}
        </p>
      </div>
      <div className="margin-top-3 margin-bottom-105 bg-base-lightest tablet:grid-col-6 padding-3">
        <p className="margin-0">
          {t('titleBox.selected', { type: 'resolution' })}
        </p>
        <h3 className="margin-top-05 margin-bottom-105">{t(title)}</h3>
        <Link to={`/it-governance/${systemIntakeId}/resolutions`}>
          {t('titleBox.change', { type: 'resolution' })}
        </Link>
      </div>
    </>
  );
};

export default ResolutionTitleBox;
