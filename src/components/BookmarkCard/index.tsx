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
      <div className="grid-row">
        <div
          className={classnames(
            'tablet:grid-col-6',
            'grid-col-12',
            'bookmark',
            'bookmark__container',
            className
          )}
        >
          <div className="bookmark__header easi-header__basic">
            <h2 className="bookmark__title margin-top-0 margin-bottom-1">
              <Link href={bookmarkLink}>{name}</Link>
            </h2>
            <i
              className="fa fa-bookmark fa-2x bookmark__icon"
              aria-hidden="true"
            />
          </div>
          <p className="margin-0">{acronym}</p>
          <p className="bookmark__body-text line-height-body-4">
            {' '}
            {/* Todo: place CEDAR variable for body of card here */}
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sollicitudin donec aliquam dui sed odio porta. Faucibus quam egestas
            feugiat laoreet quis. Sapien, sagittis, consectetur adipiscing elit.
            Sollicitudin donec aliquam dui sed odio porta.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookmarkCard;
