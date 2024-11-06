import { TrbAdminPage } from 'types/technicalAssistance';

import AdditionalInformation from './components/AdditionalInformation';
import AdviceLetter from './AdviceLetter';
import Feedback from './Feedback';
import InitialRequestForm from './InitialRequestForm';
import Notes from './Notes';
import RequestHome from './RequestHome';
import SupportingDocuments from './SupportingDocuments';

const trbAdminPages: TrbAdminPage[] = [
  {
    path: 'request',
    text: 'technicalAssistance:adminHome.requestHome',
    component: RequestHome,
    groupEnd: true
  },
  {
    path: 'initial-request-form',
    text: 'technicalAssistance:adminHome.initialRequestForm',
    component: InitialRequestForm
  },
  {
    path: 'documents',
    text: 'technicalAssistance:adminHome.supportingDocuments',
    component: SupportingDocuments
  },
  {
    path: 'feedback',
    text: 'technicalAssistance:adminHome.feedback',
    component: Feedback
  },
  {
    path: 'advice',
    text: 'technicalAssistance:adminHome.adviceLetter',
    component: AdviceLetter,
    groupEnd: true
  },
  {
    path: 'additional-information',
    text: 'technicalAssistance:adminHome.additionalInformation',
    component: AdditionalInformation,
    groupEnd: true
  },
  {
    path: 'notes',
    text: 'technicalAssistance:adminHome.notes',
    component: Notes
  }
];

export default trbAdminPages;
