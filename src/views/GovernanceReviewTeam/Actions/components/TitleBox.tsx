import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

type TitleBoxProps = {
  type: 'resolution' | 'action';
  title: string;
  systemIntakeId: string;
};

/**
 * Displays selected resolution/action and link to change
 */
const TitleBox = ({ type, title, systemIntakeId }: TitleBoxProps) => {
  const { t } = useTranslation('action');

  const changePath = `/governance-review-team/${systemIntakeId}/${
    type === 'action' ? 'manage-lcid' : 'resolutions'
  }`;

  return (
    <div className="margin-top-3 margin-bottom-105 bg-base-lightest tablet:grid-col-6 padding-3">
      <p className="margin-0">{t('titleBox.selected', { type })}</p>
      <h3 className="margin-top-05 margin-bottom-105">{t(title)}</h3>
      <Link to={changePath}>{t('titleBox.change', { type })}</Link>
    </div>
  );
};

export default TitleBox;
