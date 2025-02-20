import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import PageHeading from 'components/PageHeading';

type LcidTitleBoxProps = {
  title: string;
  systemIntakeId: string;
  // Display elements between form title and action title box
  children?: React.ReactElement;
};

/**
 * Displays selected manage LCID action and link to change
 */
const LcidTitleBox = ({
  title,
  systemIntakeId,
  children
}: LcidTitleBoxProps) => {
  const { t } = useTranslation('action');

  return (
    <>
      <div className="desktop:display-flex desktop:flex-align-end">
        <PageHeading className="margin-bottom-0">
          {t('manageLcid.title')}
        </PageHeading>
        <p className="font-body-lg text-base margin-bottom-05 margin-y-1 desktop:margin-left-2 desktop:margin-bottom-05">
          {t('resolutions.step', { step: 2 })}
        </p>
      </div>

      {children}

      <div className="margin-top-3 margin-bottom-105 bg-base-lightest tablet:grid-col-6 padding-3">
        <p className="margin-0">{t('titleBox.selected', { type: 'action' })}</p>
        <h3 className="margin-top-05 margin-bottom-105">{t(title)}</h3>
        <Link to={`/it-governance/${systemIntakeId}/manage-lcid`}>
          {t('titleBox.change', { type: 'action' })}
        </Link>
      </div>
    </>
  );
};

export default LcidTitleBox;
