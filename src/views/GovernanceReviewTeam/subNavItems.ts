import { Flags } from 'types/flags';

/** IT Gov reviewer types - used for GRT and GRB view routing */
export type ReviewerKey = 'it-governance' | 'governance-review-board';

type SubNavItems = {
  route: `/it-governance/${string}/${string}`;
  text: string;
  aria?: string;
  /** Value used to designate end of sidenav subgrouping / border-bottom */
  groupEnd?: boolean;
  /** Hide link from navigation */
  hidden?: boolean;
}[];

/**
 * Sub navigation links for IT Gov admin pages
 *
 * Returns correct nav links based on `reviewerRoute` prop (ex: excludes GRT-specific links from GRB view)
 * */
const subNavItems = (
  systemId: string,
  /** Whether current user is IT Gov admin */
  itGovAdmin: boolean,
  flags?: Flags
): SubNavItems => [
  {
    route: `/it-governance/${systemId}/intake-request`,
    text: 'general:intake',
    aria: 'aria.openIntake'
  },
  {
    route: `/it-governance/${systemId}/documents`,
    text: 'intake:documents.supportingDocuments',
    aria: 'aria.openDocuments'
  },
  {
    route: `/it-governance/${systemId}/business-case`,
    text: 'general:businessCase',
    aria: 'aria.openBusiness',
    groupEnd: flags && !flags.grbReviewTab
  },
  {
    route: `/it-governance/${systemId}/grb-review`,
    text: 'grbReview:title',
    aria: 'grbReview:aria',
    groupEnd: true,
    // Only show GRB Review tab when flag is turned on
    hidden: !flags?.grbReviewTab
  },
  {
    route: `/it-governance/${systemId}/feedback`,
    text: 'feedback.title',
    aria: 'aria.openFeedback'
  },
  {
    route: `/it-governance/${systemId}/decision`,
    text: 'decision.title',
    aria: 'aria.openDecision'
  },
  {
    route: `/it-governance/${systemId}/lcid`,
    text: 'lifecycleID.title',
    aria: 'aria.openLcid',
    groupEnd: true
  },
  {
    route: `/it-governance/${systemId}/additional-information`,
    text: 'additionalInformation.title',
    aria: 'aria.openAdditionalInformation',
    groupEnd: itGovAdmin
  },
  {
    route: `/it-governance/${systemId}/actions`,
    text: 'actions',
    // GRT only link
    hidden: !itGovAdmin
  },
  {
    route: `/it-governance/${systemId}/notes`,
    text: 'notes.heading',
    // GRT only link
    hidden: !itGovAdmin
  },
  {
    route: `/it-governance/${systemId}/dates`,
    text: 'dates.heading',
    // GRT only link
    hidden: !itGovAdmin
  }
];

export default subNavItems;
