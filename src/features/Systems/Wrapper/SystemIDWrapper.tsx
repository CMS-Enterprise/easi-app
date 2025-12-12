import React from 'react';
import { Redirect, useLocation, useParams } from 'react-router-dom';

export default function SystemIDWrapper({ children }: React.PropsWithChildren) {
  const { pathname, search, hash } = useLocation();
  const { systemId } = useParams<{ systemId?: string }>();
  if (!systemId) {
    return <>{children}</>;
  }

  const isLegacyId =
    systemId.includes('{') ||
    systemId.includes('}') ||
    systemId.includes('%7B') ||
    systemId.includes('%7D');

  if (isLegacyId) {
    const decoded = decodeURIComponent(systemId);
    const newFormatId = decoded.replace(/[{}]/g, '');
    const encodedNew = encodeURIComponent(newFormatId);
    const newPathname = pathname.replace(systemId, encodedNew);
    const redirectTo = `${newPathname}${search}${hash}`;

    return <Redirect to={redirectTo} push={false} />;
  }

  return <>{children}</>;
}
