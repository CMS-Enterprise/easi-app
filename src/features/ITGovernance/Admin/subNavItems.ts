import { NavLinkProps } from 'components/SideNavigation/types';
import { Flags } from 'types/flags';

/**
 * Sub navigation links for IT Gov admin pages
 *
 * Hides GRT admin links when user does not have admin job code
 */
const subNavItems = (
  systemId: string,
  /** Whether current user is IT Gov admin */
  isITGovAdmin: boolean,
  flags?: Flags
): NavLinkProps[] => {
  const links: Array<NavLinkProps & { hidden?: boolean }> = [
    {
      route: `/it-governance/${systemId}/intake-request`,
      text: 'general:intake'
    },
    {
      route: `/it-governance/${systemId}/documents`,
      text: 'intake:documents.supportingDocuments'
    },
    {
      route: `/it-governance/${systemId}/business-case`,
      text: 'general:businessCase',
      groupEnd: flags && !flags.grbReviewTab
    },
    {
      route: `/it-governance/${systemId}/grb-review`,
      text: 'grbReview:title',
      groupEnd: true,
      // Only show GRB Review tab when flag is turned on
      hidden: !flags?.grbReviewTab,
      children: [
        {
          route: `/it-governance/${systemId}/grb-review#details`,
          text: 'grbReview:reviewDetails.title'
        },
        {
          route: `/it-governance/${systemId}/grb-review#documents`,
          text: 'grbReview:supportingDocuments'
        },
        {
          route: `/it-governance/${systemId}/grb-review#discussions`,
          text: 'discussions:general.label'
        },
        {
          route: `/it-governance/${systemId}/grb-review#participants`,
          text: 'grbReview:participants'
        }
      ]
    },
    {
      route: `/it-governance/${systemId}/feedback`,
      text: 'governanceReviewTeam:feedback.title'
    },
    {
      route: `/it-governance/${systemId}/decision`,
      text: 'governanceReviewTeam:decision.title'
    },
    {
      route: `/it-governance/${systemId}/lcid`,
      text: 'governanceReviewTeam:lifecycleID.title',
      groupEnd: true
    },
    {
      route: `/it-governance/${systemId}/system-information`,
      text: 'governanceReviewTeam:systemInformation.title',
      groupEnd: isITGovAdmin
    },
    {
      route: `/it-governance/${systemId}/actions`,
      text: 'governanceReviewTeam:actions',
      // GRT only link
      hidden: !isITGovAdmin
    },
    {
      route: `/it-governance/${systemId}/notes`,
      text: 'governanceReviewTeam:notes.heading',
      // GRT only link
      hidden: !isITGovAdmin
    },
    {
      route: `/it-governance/${systemId}/dates`,
      text: 'governanceReviewTeam:dates.heading',
      // GRT only link
      hidden: !isITGovAdmin
    }
  ];

  return links.filter(({ hidden }) => !hidden);
};

export default subNavItems;
