import React from 'react';
import { Redirect, useLocation, useParams } from 'react-router-dom';

export default function SystemIDWrapper() {
  const { pathname, search, hash } = useLocation();
  const { legacyId } = useParams<{ legacyId: string }>();

  const decoded = decodeURIComponent(legacyId);

  const newFormatId = decoded.replace(/[{}]/g, '');

  const newPathname = pathname.replace(legacyId, newFormatId);

  const redirectTo = `${newPathname}${search}${hash}`;

  return <Redirect to={redirectTo} />;
}
