import { useMemo } from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { systemProfileSections } from 'constants/systemProfile';
import { SystemProfileSection } from 'types/systemProfile';

type UseSystemProfileSectionsProps = {
  sectionKey: SystemProfileSection;
  includeDisabledSections?: boolean;
};

export type SystemProfileSectionData = {
  key: SystemProfileSection;
  /** Returns correct route based on feature flag state */
  route: string;
  /** Computed value: true if section is enabled OR feature flag is on */
  isEnabled: boolean;
};

type UseSystemProfileSectionsReturn = {
  currentSection: SystemProfileSectionData | undefined;
  nextSection: SystemProfileSectionData | undefined;
};

/**
 * Resolves system profile section data routes and navigation order based on
 * the section's enabled state and the editableSystemProfile feature flag.
 *
 * @param sectionKey - The current section key or enum value.
 * @param includeDisabledSections - If false, only includes enabled sections.
 *
 * @returns Current section data and next section for sequential navigation
 */
// TODO EASI-4984 - this should be removed and replaced with a plain array of sections
// once editable system profile work is complete and feature flag is removed.
function useSystemProfileSections({
  sectionKey,
  includeDisabledSections = true
}: UseSystemProfileSectionsProps): UseSystemProfileSectionsReturn {
  const flags = useFlags();

  /**
   * Section data with routes resolved based on section enabled state and feature flags.
   *
   * If `includeDisabledSections` is false, filters to only enabled sections.
   */
  const resolvedSections: SystemProfileSectionData[] = useMemo(() => {
    let sections = systemProfileSections.map(section => {
      const isEnabled = section.enabled || flags.editableSystemProfile;
      const route = isEnabled ? `edit/${section.route}` : section.legacyRoute;

      return {
        key: section.key,
        route,
        isEnabled
      };
    });

    if (!includeDisabledSections) {
      sections = sections.filter(section => section.isEnabled);
    }

    return sections;
  }, [flags.editableSystemProfile, includeDisabledSections]);

  const currentSectionIndex = useMemo(
    () => resolvedSections.findIndex(section => section.key === sectionKey),
    [resolvedSections, sectionKey]
  );

  const currentSection =
    currentSectionIndex !== -1
      ? resolvedSections[currentSectionIndex]
      : undefined;

  const nextSection =
    currentSection && currentSectionIndex < resolvedSections.length - 1
      ? resolvedSections[currentSectionIndex + 1]
      : undefined;

  return {
    currentSection,
    nextSection
  };
}

export default useSystemProfileSections;
