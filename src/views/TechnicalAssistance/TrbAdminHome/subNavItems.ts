import { SubNavItem } from 'types/technicalAssistance';

import AdviceLetter from './AdviceLetter';
import Feedback from './Feedback';
import InitialRequestForm from './InitialRequestForm';
import Notes from './Notes';
import RequestHome from './RequestHome';
import SupportingDocuments from './SupportingDocuments';

const subNavItems = (trbRequestId: string): SubNavItem[] => [
  {
    route: `/trb/${trbRequestId}`,
    text: 'technicalAssistance:adminHome.subnav.requestHome',
    groupEnd: true,
    component: RequestHome
  },
  {
    route: `/trb/${trbRequestId}/initial-request-form`,
    text: 'technicalAssistance:adminHome.subnav.initialRequestForm',
    component: InitialRequestForm
  },
  {
    route: `/trb/${trbRequestId}/documents`,
    text: 'technicalAssistance:adminHome.subnav.supportingDocuments',
    component: SupportingDocuments
  },
  {
    route: `/trb/${trbRequestId}/feedback`,
    text: 'technicalAssistance:adminHome.subnav.feedback',
    component: Feedback
  },
  {
    route: `/trb/${trbRequestId}/advice`,
    text: 'technicalAssistance:adminHome.subnav.adviceLetter',
    component: AdviceLetter
  },
  {
    route: `/trb/${trbRequestId}/notes`,
    text: 'technicalAssistance:adminHome.subnav.notes',
    component: Notes
  }
];

export default subNavItems;
