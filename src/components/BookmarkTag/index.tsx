import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import { IconBookmark, Tag } from '@trussworks/react-uswds';
import classnames from 'classnames';

import CreateCedarSystemBookmarkQuery from 'queries/CreateCedarSystemBookmarkQuery';
import DeleteCedarSystemBookmarkQuery from 'queries/DeleteCedarSystemBookmarkQuery';

import './index.scss';

type BookmarkTagProps = {
  className?: string;
  systemID: string;
  isBookmarked: boolean;
  refetchBookmarks: () => any | undefined;
};

export const BookmarkTag = ({
  className,
  systemID,
  isBookmarked,
  refetchBookmarks
}: BookmarkTagProps) => {
  const { t } = useTranslation('systemWorkspace');

  const [createMutate] = useMutation(CreateCedarSystemBookmarkQuery);
  const [deleteMutate] = useMutation(DeleteCedarSystemBookmarkQuery);

  const handleCreateBookmark = (cedarSystemId: string) => {
    createMutate({
      variables: {
        input: {
          cedarSystemId
        }
      }
    }).then(refetchBookmarks);
  };

  const handleDeleteBookmark = (cedarSystemId: string) => {
    deleteMutate({
      variables: {
        input: {
          cedarSystemId
        }
      }
    }).then(refetchBookmarks);
  };

  return (
    <div className={classnames('pointer', className)}>
      <Tag
        className="text-primary text-bold bg-primary-lighter bookmark-tag padding-1 padding-x-105 display-flex"
        onClick={() =>
          isBookmarked
            ? handleDeleteBookmark(systemID)
            : handleCreateBookmark(systemID)
        }
      >
        {isBookmarked ? (
          <IconBookmark
            className="margin-right-05"
            data-testid="is-bookmarked"
          />
        ) : (
          <IconBookmark
            className="margin-right-05 bookmark-tag__outline"
            data-testid="is-not-bookmarked"
          />
        )}

        {isBookmarked ? t('bookmarked') : t('bookmark')}
      </Tag>
    </div>
  );
};

export default BookmarkTag;
