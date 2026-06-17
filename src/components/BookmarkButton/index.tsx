import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon } from '@trussworks/react-uswds';
import classnames from 'classnames';
import {
  useCreateCedarSystemBookmarkMutation,
  useDeleteCedarSystemBookmarkMutation
} from 'gql/generated/graphql';

import updateCedarSystemBookmarkInCache from 'utils/updateCedarSystemBookmarkInCache';

import './index.scss';

export default function BookmarkButton({
  id,
  isBookmarked,
  className
}: {
  id: string;
  isBookmarked: boolean;
  className?: string;
}) {
  const { t } = useTranslation('systemProfile');

  const [isBookmarkedState, setBookmarkedState] =
    useState<boolean>(isBookmarked);

  useEffect(() => {
    setBookmarkedState(isBookmarked);
  }, [isBookmarked]);

  const [create, { loading: createLoading }] =
    useCreateCedarSystemBookmarkMutation();

  const [del, { loading: delLoading }] = useDeleteCedarSystemBookmarkMutation();

  const toggle = () => {
    if (createLoading || delLoading) return;

    const nextIsBookmarked = !isBookmarkedState;

    (isBookmarkedState ? del : create)({
      variables: {
        input: {
          cedarSystemId: id
        }
      },
      update: cache => {
        updateCedarSystemBookmarkInCache(cache, id, nextIsBookmarked);
      }
    }).then(() => {
      setBookmarkedState(nextIsBookmarked);
    });
  };

  return (
    <Button
      type="button"
      className={classnames(
        'usa-button display-flex flex-align-center margin-right-0 padding-y-105 padding-left-105 padding-right-2 radius-0 bg-white text-primary',
        className
      )}
      onClick={toggle}
    >
      <Icon.Bookmark
        aria-hidden
        className={classnames('margin-right-1', {
          'outline text-base': !isBookmarkedState
        })}
        data-testid={isBookmarkedState ? 'is-bookmarked' : 'is-not-bookmarked'}
      />
      {t(`bookmark.${isBookmarkedState ? 'bookmarked' : 'bookmark'}`)}
    </Button>
  );
}
