import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { Button, IconBookmark } from '@trussworks/react-uswds';
import classnames from 'classnames';

import CreateCedarSystemBookmarkQuery from 'queries/CreateCedarSystemBookmarkQuery';
import DeleteCedarSystemBookmarkQuery from 'queries/DeleteCedarSystemBookmarkQuery';
import GetCedarSystemIsBookmarkedQuery from 'queries/GetCedarSystemIsBookmarkedQuery';
import {
  CreateCedarSystemBookmark,
  CreateCedarSystemBookmarkVariables
} from 'queries/types/CreateCedarSystemBookmark';
import {
  DeleteCedarSystemBookmark,
  DeleteCedarSystemBookmarkVariables
} from 'queries/types/DeleteCedarSystemBookmark';

import './index.scss';

export default function BookmarkToggleButton({
  id,
  initialBookmarked
}: {
  id: string;
  initialBookmarked: boolean;
}) {
  const { t } = useTranslation('systemProfile');

  const [isBookmarked, setBookmarked] = useState<boolean>(initialBookmarked);

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

    (isBookmarked ? del : create)({
      variables: {
        input: {
          cedarSystemId: id
        }
      }
    }).then(res => {
      setBookmarked(!isBookmarked);
    });
  };

  return (
    <Button
      type="button"
      className="usa-button display-flex flex-align-center margin-right-0 padding-y-1 padding-left-105 padding-right-2 radius-0 bg-white text-primary"
      onClick={toggle}
    >
      <IconBookmark
        size={3}
        className={classnames('margin-right-1 text-primary', {
          'bookmark-tag__outline': !isBookmarked
        })}
        data-testid={isBookmarked ? 'is-bookmarked' : 'is-not-bookmarked'}
      />
      {t(`bookmark.${isBookmarked ? 'bookmarked' : 'bookmark'}`)}
    </Button>
  );
}
