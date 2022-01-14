import React from 'react';

import BookmarkCard from 'components/BookmarkCard';
import { GetCedarSystems_cedarSystems as CedarSystem } from 'queries/types/GetCedarSystems';
import { GetCedarSystemsAndBookmarks_cedarSystemBookmarks as CedarSystemBookmark } from 'queries/types/GetCedarSystemsAndBookmarks';
import { mapCedarStatusToIcon } from 'types/iconStatus';

const filterBookmarks = (
  systems: CedarSystem[],
  savedBookmarks: CedarSystemBookmark[],
  refetch: () => any | undefined
): React.ReactNode => {
  const bookmarkIdSet: Set<string> = new Set(
    savedBookmarks.map(sys => sys.cedarSystemId)
  );

  const bookmarkedSystems = systems.filter(sys =>
    bookmarkIdSet.has(sys.id)
  ) as CedarSystem[];

  return bookmarkedSystems.map(system => (
    <BookmarkCard
      type="systemProfile"
      key={system.id}
      statusIcon={mapCedarStatusToIcon(system.status)}
      {...system}
      refetch={refetch}
    />
  ));
};

export default filterBookmarks;
