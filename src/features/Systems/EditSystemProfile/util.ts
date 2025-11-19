import { SystemProfileLockableSection } from 'gql/generated/graphql';

import { systemProfileSections } from 'constants/systemProfile';
import { Flags } from 'types/flags';
import { SystemProfileSection } from 'types/systemProfile';

type SystemProfileSectionData = {
  key: SystemProfileSection;
  /** Returns correct route based on feature flag state */
  route: string;
  /** Returns true if section OR global `editableSystemProfile` feature flag is enabled */
  isEnabled: boolean;
};

/** Returns true if a section feature flag OR the global `editableSystemProfile` feature flag is enabled */
const sectionIsEnabled = (sectionFlagKey: keyof Flags, flags: Flags) =>
  flags[sectionFlagKey] || flags.editableSystemProfile;

/**
 * Returns an array of enabled system profile sections filtered based on feature flags.
 *
 * Use for navigation in form wrapper.
 */
export const getEnabledSections = (
  flags: Flags
): SystemProfileSectionData[] => {
  const filteredSections = systemProfileSections.filter(section =>
    sectionIsEnabled(section.featureFlag, flags)
  );

  return filteredSections.map(section => ({
    key: section.key,
    route: `edit/${section.route}`,
    isEnabled: true
  }));
};

/**
 * Returns a map of system profile sections with routes and enabled status resolved based on
 * section feature flags and the global `editableSystemProfile` flag.
 */
export const getSystemProfileSectionMap = (
  flags: Flags
): Record<SystemProfileSection, SystemProfileSectionData> => {
  const map = {} as Record<SystemProfileSection, SystemProfileSectionData>;

  systemProfileSections.forEach(section => {
    const isEnabled = sectionIsEnabled(section.featureFlag, flags);

    // Use legacy route if section is disabled
    const route = isEnabled ? `edit/${section.route}` : section.legacyRoute;

    map[section.key] = {
      key: section.key,
      route,
      isEnabled
    };
  });

  return map;
};

/**
 * Maps a route segment to its corresponding SystemProfileLockableSection enum value.
 *
 * Only returns lockable sections (excludes CONTRACTS, FUNDING_AND_BUDGET, ATO_AND_SECURITY).
 */
export const getLockableSectionFromRoute = (
  route: string
): SystemProfileLockableSection | null => {
  const section = systemProfileSections.find(s => s.route === route);

  if (section && section.key in SystemProfileLockableSection) {
    return section.key as SystemProfileLockableSection;
  }

  return null;
};
