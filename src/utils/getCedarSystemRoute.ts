type CedarSystemNavigation = {
  id: string;
  viewerCanAccessProfile: boolean;
  viewerCanAccessWorkspace: boolean;
};

type GetCedarSystemRouteOptions = {
  preferWorkspace?: boolean;
};

const getCedarSystemRoute = (
  system: CedarSystemNavigation,
  { preferWorkspace = false }: GetCedarSystemRouteOptions = {}
) => {
  if (preferWorkspace && system.viewerCanAccessWorkspace) {
    return `/systems/${system.id}/workspace`;
  }

  if (system.viewerCanAccessProfile) {
    return `/systems/${system.id}/home/top`;
  }

  if (system.viewerCanAccessWorkspace) {
    return `/systems/${system.id}/workspace`;
  }

  return undefined;
};

export default getCedarSystemRoute;
