import { useMemo } from 'react';
import { useFlags } from 'launchdarkly-react-client-sdk';

import { systemProfileSections } from 'constants/systemProfile';
import { SystemProfileSection } from 'types/systemProfile';

type UseSystemProfileSectionsProps = {
  sectionKey: SystemProfileSection;
  includeDisabledSections?: boolean;
};

type SystemProfileSectionData = {
  key: SystemProfileSection;
  /** Returns correct route based on feature flag state */
  route: string;
  /** Returns true if section OR global `editableSystemProfile` feature flag is enabled */
  isEnabled: boolean;
};

type UseSystemProfileSectionsReturn = {
  currentSection: SystemProfileSectionData | undefined;
  nextSection: SystemProfileSectionData | undefined;
};

/**
 * Resolves system profile section data routes and navigation order based on
 * the section feature flag.
 *
 * @param sectionKey - The current section key or enum value.
 * @param includeDisabledSections - If false, only includes sections with enabled feature flags.
 *
 * @returns Current section data and next section for sequential navigation
 */
// TODO EASI-4984 - this should be removed and replaced with a plain array of sections
// once editable system profile is fully enabled and we no longer need feature flag logic
function useSystemProfileSections({
  sectionKey,
  includeDisabledSections = true
}: UseSystemProfileSectionsProps): UseSystemProfileSectionsReturn {
  const flags = useFlags();

  /** Section data with routes resolved based on feature flags and `includeDisabledSections` parameter */
  const resolvedSections: SystemProfileSectionData[] = useMemo(() => {
    let sections = systemProfileSections.map(section => {
      // `editableSystemProfile` feature flag overrides section feature flags
      const isEnabled =
        flags[section.featureFlag] || flags.editableSystemProfile;

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
  }, [flags, includeDisabledSections]);

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
