import { Flags } from 'types/flags';

/** IT Gov reviewer types - used for GRT and GRB view routing */
export type ReviewerKey = 'it-governance' | 'governance-review-board';

type SubNavItems = {
  route: `/${ReviewerKey}/${string}/${string}`;
  text: string;
  aria?: string;
  /** Value used to designate end of sidenav subgrouping / border-bottom */
  groupEnd?: boolean;
}[];

/**
 * Sub navigation links for IT Gov admin pages
 *
 * Returns correct nav links based on `reviewerRoute` prop (ex: excludes GRT-specific links from GRB view)
 * */
const subNavItems = (
  systemId: string,
  /** Base reviewer route for nav item links */
  reviewerRoute: ReviewerKey,
  flags?: Flags
): SubNavItems => {
  const grbReview: SubNavItems[number] = {
    route: `/${reviewerRoute}/${systemId}/grb-review`,
    text: 'grbReview:title',
    aria: 'grbReview:aria',
    groupEnd: true
  };

  const items: SubNavItems = [
    {
      route: `/${reviewerRoute}/${systemId}/intake-request`,
      text: 'general:intake',
      aria: 'aria.openIntake'
    },
    {
      route: `/${reviewerRoute}/${systemId}/documents`,
      text: 'intake:documents.supportingDocuments',
      aria: 'aria.openDocuments'
    },
    {
      route: `/${reviewerRoute}/${systemId}/business-case`,
      text: 'general:businessCase',
      aria: 'aria.openBusiness',
      groupEnd: flags && !flags.grbReviewTab
    },
    // Add GRB review tab to nav items if flag is on
    ...(flags?.grbReviewTab ? [grbReview] : []),
    {
      route: `/${reviewerRoute}/${systemId}/feedback`,
      text: 'feedback.title',
      aria: 'aria.openFeedback'
    },
    {
      route: `/${reviewerRoute}/${systemId}/decision`,
      text: 'decision.title',
      aria: 'aria.openDecision'
    },
    {
      route: `/${reviewerRoute}/${systemId}/lcid`,
      text: 'lifecycleID.title',
      aria: 'aria.openLcid',
      groupEnd: true
    },
    {
      route: `/${reviewerRoute}/${systemId}/additional-information`,
      text: 'additionalInformation.title',
      aria: 'aria.openAdditionalInformation',
      groupEnd: reviewerRoute === 'it-governance'
    },
    {
      route: `/it-governance/${systemId}/actions`,
      text: 'actions'
    },
    {
      route: `/it-governance/${systemId}/notes`,
      text: 'notes.heading'
    },
    {
      route: `/it-governance/${systemId}/dates`,
      text: 'dates.heading'
    }
  ];

  // Filter so array only includes nav items with correct routes
  // Excludes GRT links from GRB view navigation
  return items.filter(item => item.route.includes(reviewerRoute));
};

export default subNavItems;
