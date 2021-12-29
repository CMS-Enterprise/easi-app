import React from 'react';
import { Link } from '@trussworks/react-uswds';
import classnames from 'classnames';

import './index.scss';

// TODO import CEDAR types once generated from gql

type BookmarkCardProps = {
  className?: string;
  name: string;
  acronym: string;
  ownerName: string;
  ownerOffice: string;
  productionStatus: string;
  atoStatus: string;
  atoStatusText: string;
  section508Status: string;
  section508StatusText: string;
};

const BookmarkCard = ({
  className,
  name,
  acronym,
  ownerName,
  ownerOffice,
  productionStatus,
  atoStatus,
  atoStatusText,
  section508Status,
  section508StatusText
}: BookmarkCardProps) => {
  const bookmarkLink = `/systems/${name}`;

  return (
    <div className="grid-container margin-top-1">
      <div className={classnames('bookmark', 'bookmark__container', className)}>
        <div className="bookmark__header">
          <h2 className="margin-top-0 margin-bottom-1">
            <Link href={bookmarkLink}>{name}</Link>
          </h2>
          <i
            className="fa fa-bookmark fa-2x bookmark__icon"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
};

export default BookmarkCard;
