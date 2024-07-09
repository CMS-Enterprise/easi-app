import { Flags } from 'types/flags';

export type ReviewerKey = 'governance-review-team' | 'governance-review-board';

type SubNavItems = {
  route: `/${ReviewerKey}/${string}/${string}`;
  text: string;
  aria?: string;
  /** Value used to designate end of sidenav subgrouping / border-bottom */
  groupEnd?: boolean;
}[];

const subNavItems = (
  systemId: string,
  reviewerRoute: ReviewerKey,
  flags?: Flags
): SubNavItems => [
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
    groupEnd: true
  },
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
    groupEnd: reviewerRoute === 'governance-review-team'
  },
  {
    route: `/governance-review-team/${systemId}/actions`,
    text: 'actions'
  },
  {
    route: `/governance-review-team/${systemId}/notes`,
    text: 'notes.heading'
  },
  {
    route: `/governance-review-team/${systemId}/dates`,
    text: 'dates.heading'
  }
];

export default subNavItems;
