import React from 'react';
import { Redirect, useLocation, useParams } from 'react-router-dom';

export default function SystemIDWrapper() {
  const { pathname, search, hash } = useLocation();
  const { legacyId } = useParams<{ legacyId: string }>();

  const isLegacyId =
    legacyId.includes('{') ||
    legacyId.includes('}') ||
    legacyId.includes('%7B') ||
    legacyId.includes('%7D');

  if (!isLegacyId) {
    return <Redirect to={`${pathname}${search}${hash}`} />;
  }

  const decoded = decodeURIComponent(legacyId);

  const newFormatId = decoded.replace(/[{}]/g, '');

  const newPathname = pathname.replace(legacyId, newFormatId);

  const redirectTo = `${newPathname}${search}${hash}`;

  return <Redirect to={redirectTo} />;
}
