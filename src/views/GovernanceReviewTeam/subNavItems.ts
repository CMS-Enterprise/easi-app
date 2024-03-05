import { Flags } from 'types/flags';

type SubNavItems = {
  route: `/governance-review-team/${string}/${string}`;
  text: string;
  aria?: string;
  /** Value used to designate end of sidenav subgrouping / border-bottom */
  groupEnd?: boolean;
}[];

const subNavItems = (systemId: string, flags?: Flags): SubNavItems => [
  {
    route: `/governance-review-team/${systemId}/intake-request`,
    text: 'general:intake',
    aria: 'aria.openIntake'
  },
  {
    route: `/governance-review-team/${systemId}/documents`,
    text: 'intake:documents.supportingDocuments',
    aria: 'aria.openDocuments'
  },
  {
    route: `/governance-review-team/${systemId}/business-case`,
    text: 'general:businessCase',
    aria: 'aria.openBusiness',
    groupEnd: true
  },
  {
    route: `/governance-review-team/${systemId}/feedback`,
    text: 'feedback.title',
    aria: 'aria.openFeedback'
  },
  {
    route: `/governance-review-team/${systemId}/decision`,
    text: 'decision.title',
    aria: 'aria.openDecision'
  },
  ...(flags?.itgovLinkRequestsAdmin
    ? [
        {
          // Not sure why this isn't appeasing TS
          route: `/governance-review-team/${systemId}/additional-information` as `/governance-review-team/${string}/${string}`,
          text: 'additionalInformation.title',
          aria: 'aria.openAdditionalInformation'
        }
      ]
    : []),
  {
    route: `/governance-review-team/${systemId}/lcid`,
    text: 'lifecycleID.title',
    aria: 'aria.openLcid',
    groupEnd: true
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
