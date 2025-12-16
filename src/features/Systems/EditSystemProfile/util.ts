import { SystemProfileLockableSection } from 'gql/generated/graphql';

import {
  SystemProfileSectionRoute,
  systemProfileSections
} from 'constants/systemProfile';
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

/** Lookup map from route strings to SystemProfileLockableSection enum values. */
const routeToEnumMap = new Map<
  SystemProfileSectionRoute,
  SystemProfileLockableSection
>(
  systemProfileSections
    .filter(section => section.key in SystemProfileLockableSection)
    .map(section => [
      section.route,
      section.key as SystemProfileLockableSection
    ])
);

/**
 * Returns the SystemProfileLockableSection enum value from a route string.
 *
 * If the route is not a valid lockable section route, returns null.
 */
export const getLockableSectionFromRoute = (
  route: SystemProfileSectionRoute | undefined
): SystemProfileLockableSection | null => {
  if (!route) return null;

  return routeToEnumMap.get(route) ?? null;
};
