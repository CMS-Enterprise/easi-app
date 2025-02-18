import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { Button, Icon } from '@trussworks/react-uswds';
import classnames from 'classnames';
import CreateCedarSystemBookmarkQuery from 'gql/legacyGQL/CreateCedarSystemBookmarkQuery';
import DeleteCedarSystemBookmarkQuery from 'gql/legacyGQL/DeleteCedarSystemBookmarkQuery';
import GetCedarSystemIsBookmarkedQuery from 'gql/legacyGQL/GetCedarSystemIsBookmarkedQuery';
import {
  CreateCedarSystemBookmark,
  CreateCedarSystemBookmarkVariables
} from 'gql/legacyGQL/types/CreateCedarSystemBookmark';
import {
  DeleteCedarSystemBookmark,
  DeleteCedarSystemBookmarkVariables
} from 'gql/legacyGQL/types/DeleteCedarSystemBookmark';

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

  const refetchCedarSystemIsBookmarkedQuery = {
    query: GetCedarSystemIsBookmarkedQuery,
    variables: { id }
  };

  const [create, { loading: createLoading }] = useMutation<
    CreateCedarSystemBookmark,
    CreateCedarSystemBookmarkVariables
  >(CreateCedarSystemBookmarkQuery, {
    refetchQueries: [refetchCedarSystemIsBookmarkedQuery]
  });

  const [del, { loading: delLoading }] = useMutation<
    DeleteCedarSystemBookmark,
    DeleteCedarSystemBookmarkVariables
  >(DeleteCedarSystemBookmarkQuery, {
    refetchQueries: [refetchCedarSystemIsBookmarkedQuery]
  });

  const toggle = () => {
    if (createLoading || delLoading) return;

    (isBookmarkedState ? del : create)({
      variables: {
        input: {
          cedarSystemId: id
        }
      }
    }).then(res => {
      setBookmarkedState(!isBookmarkedState);
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
        className={classnames('margin-right-1', {
          'outline text-base': !isBookmarkedState
        })}
        data-testid={isBookmarkedState ? 'is-bookmarked' : 'is-not-bookmarked'}
      />
      {t(`bookmark.${isBookmarkedState ? 'bookmarked' : 'bookmark'}`)}
    </Button>
  );
}
