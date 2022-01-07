import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Card, Link as UswdsLink } from '@trussworks/react-uswds';
import classnames from 'classnames';

import Divider from 'components/shared/Divider';
import SystemHealthIcon from 'components/SystemHealthIcon';
import { GetCedarSystems_cedarSystems as CedarSystemProps } from 'queries/types/GetCedarSystems';
import { IconStatus } from 'types/iconStatus';

import BookmarkCardIcon from './BookmarkCardIcon';

import './index.scss';

type BookmarkCardProps = {
  className?: string;
  statusIcon: IconStatus;
  type: 'systemProfile'; // Built in for future iterations/varations of bookmarked datasets that ingest i18n translations for headers.
};

const BookmarkCard = ({
  className,
  type,
  id,
  name,
  description,
  acronym,
  status,
  statusIcon,
  businessOwnerOrg
}: BookmarkCardProps & CedarSystemProps) => {
  const { t } = useTranslation();
  return (
    <Card
      data-testid="single-bookmark-card"
      className={classnames(
        'desktop:grid-col-6',
        'grid-col-12',
        'margin-top-2',
        'margin-bottom-0',
        className
      )}
    >
      <div className="grid-col-12">
        <div className="bookmark__header easi-header__basic">
          <h2 className="bookmark__title margin-top-0 margin-bottom-1">
            <UswdsLink asCustom={Link} to={`/systems/${id}`}>
              {name}
            </UswdsLink>
          </h2>
          <BookmarkCardIcon size="md" />
        </div>
        <p className="margin-0">{acronym}</p>
        <p className="bookmark__body-text line-height-body-4">{description}</p>
        <p className="margin-bottom-0">{t(`${type}:bookmark.subHeader1`)}</p>
        <p className="text-bold margin-top-1">{businessOwnerOrg}</p>
        <Divider />
        <div className="bookmark__header easi-header__basic">
          <div>
            <p className="margin-bottom-0">
              {t(`${type}:bookmark.subHeader2`)}
            </p>
            <p className="text-bold margin-top-1 margin-bottom-0">{status}</p>
          </div>
          <SystemHealthIcon
            status={statusIcon}
            size="lg"
            className="margin-top-2"
          />
        </div>
      </div>
    </Card>
  );
};

export default BookmarkCard;
