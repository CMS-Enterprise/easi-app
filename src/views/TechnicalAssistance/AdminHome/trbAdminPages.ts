import i18next from 'i18next';

import { TrbAdminPage } from 'types/technicalAssistance';

import AdviceLetter from './AdviceLetter';
import Feedback from './Feedback';
import InitialRequestForm from './InitialRequestForm';
import Notes from './Notes';
import RequestHome from './RequestHome';
import SupportingDocuments from './SupportingDocuments';

const trbAdminPages: TrbAdminPage[] = [
  {
    path: 'request',
    text: i18next.t('technicalAssistance:adminHome.requestHome', {
      returnObjects: true
    }),
    component: RequestHome,
    groupEnd: true
  },
  {
    path: 'initial-request-form',
    text: i18next.t('technicalAssistance:adminHome.initialRequestForm', {
      returnObjects: true
    }),
    component: InitialRequestForm
  },
  {
    path: 'documents',
    text: i18next.t('technicalAssistance:adminHome.supportingDocuments', {
      returnObjects: true
    }),
    component: SupportingDocuments
  },
  {
    path: 'feedback',
    text: i18next.t('technicalAssistance:adminHome.feedback', {
      returnObjects: true
    }),
    component: Feedback
  },
  {
    path: 'advice',
    text: i18next.t('technicalAssistance:adminHome.adviceLetter', {
      returnObjects: true
    }),
    component: AdviceLetter,
    groupEnd: true
  },
  {
    path: 'notes',
    text: i18next.t('technicalAssistance:adminHome.notes', {
      returnObjects: true
    }),
    component: Notes
  }
];

export default trbAdminPages;
