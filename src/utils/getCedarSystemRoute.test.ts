import getCedarSystemRoute from './getCedarSystemRoute';

describe('getCedarSystemRoute', () => {
  const system = {
    id: 'cedar-1',
    viewerCanAccessProfile: true,
    viewerCanAccessWorkspace: true
  };

  it('prefers the workspace route when requested and available', () => {
    expect(getCedarSystemRoute(system, { preferWorkspace: true })).toBe(
      '/systems/cedar-1/workspace'
    );
  });

  it('falls back to the profile route when workspace is not preferred', () => {
    expect(getCedarSystemRoute(system)).toBe('/systems/cedar-1/home/top');
  });

  it('uses the workspace route when the profile is unavailable', () => {
    expect(
      getCedarSystemRoute({
        id: 'cedar-2',
        viewerCanAccessProfile: false,
        viewerCanAccessWorkspace: true
      })
    ).toBe('/systems/cedar-2/workspace');
  });

  it('returns no route when neither destination is allowed', () => {
    expect(
      getCedarSystemRoute({
        id: 'cedar-3',
        viewerCanAccessProfile: false,
        viewerCanAccessWorkspace: false
      })
    ).toBeUndefined();
  });
});
