import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { Button, IconBookmark } from '@trussworks/react-uswds';
import classnames from 'classnames';

import CreateCedarSystemBookmarkQuery from 'queries/CreateCedarSystemBookmarkQuery';
import DeleteCedarSystemBookmarkQuery from 'queries/DeleteCedarSystemBookmarkQuery';
import {
  CreateCedarSystemBookmark,
  CreateCedarSystemBookmarkVariables
} from 'queries/types/CreateCedarSystemBookmark';
import {
  DeleteCedarSystemBookmark,
  DeleteCedarSystemBookmarkVariables
} from 'queries/types/DeleteCedarSystemBookmark';

export default function BookmarkToggleButton({
  id,
  initialBookmarked
}: {
  id: string;
  initialBookmarked: boolean;
}) {
  const { t } = useTranslation('systemProfile');

  const [isBookmarked, setBookmarked] = useState<boolean>(initialBookmarked);

  const [create, { loading: createLoading }] = useMutation<
    CreateCedarSystemBookmark,
    CreateCedarSystemBookmarkVariables
  >(CreateCedarSystemBookmarkQuery);

  const [del, { loading: delLoading }] = useMutation<
    DeleteCedarSystemBookmark,
    DeleteCedarSystemBookmarkVariables
  >(DeleteCedarSystemBookmarkQuery);

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
        className={classnames(
          'margin-right-1',
          isBookmarked ? 'text-primary' : 'text-base-lighter'
        )}
      />
      {t(`bookmark.${isBookmarked ? 'bookmarked' : 'bookmark'}`)}
    </Button>
  );
}
