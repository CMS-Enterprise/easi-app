import React from 'react';

import BookmarkCard from 'components/BookmarkCard';
import { GetCedarSystems_cedarSystems as CedarSystem } from 'queries/types/GetCedarSystems';
import { mapCedarStatusToIcon } from 'types/iconStatus';
import { CedarSystemBookMark } from 'views/Sandbox/mockSystemData';

export const findBookmark = (
  systemId: string,
  savedBookMarks: CedarSystemBookMark[]
): boolean =>
  savedBookMarks.some(bookmark => bookmark.cedarSystemId === systemId);

export const filterBookmarks = (
  systems: CedarSystem[],
  savedBookMarks: CedarSystemBookMark[]
): React.ReactNode =>
  systems
    .filter(system => findBookmark(system.id, savedBookMarks))
    .map(system => (
      <BookmarkCard
        type="systemProfile"
        key={system.id}
        statusIcon={mapCedarStatusToIcon(system.status)}
        {...system}
      />
    ));
