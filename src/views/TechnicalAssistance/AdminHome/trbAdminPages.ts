import i18next from 'i18next';

import { TrbAdminPage } from 'types/technicalAssistance';

import AdviceLetter from './AdviceLetter';
import Feedback from './Feedback';
import InitialRequestForm from './InitialRequestForm';
import Notes from './Notes';
import RequestHome from './RequestHome';
import SupportingDocuments from './SupportingDocuments';

const trbAdminPages = (trbRequestId: string): TrbAdminPage[] => [
  {
    route: `/trb/${trbRequestId}/request`,
    text: i18next.t('technicalAssistance:adminHome.requestHome', {
      returnObjects: true
    }),
    component: RequestHome,
    groupEnd: true
  },
  {
    route: `/trb/${trbRequestId}/initial-request-form`,
    text: i18next.t('technicalAssistance:adminHome.initialRequestForm', {
      returnObjects: true
    }),
    component: InitialRequestForm
  },
  {
    route: `/trb/${trbRequestId}/documents`,
    text: i18next.t('technicalAssistance:adminHome.supportingDocuments', {
      returnObjects: true
    }),
    component: SupportingDocuments
  },
  {
    route: `/trb/${trbRequestId}/feedback`,
    text: i18next.t('technicalAssistance:adminHome.feedback', {
      returnObjects: true
    }),
    component: Feedback
  },
  {
    route: `/trb/${trbRequestId}/advice`,
    text: i18next.t('technicalAssistance:adminHome.adviceLetter', {
      returnObjects: true
    }),
    component: AdviceLetter,
    groupEnd: true
  },
  {
    route: `/trb/${trbRequestId}/notes`,
    text: i18next.t('technicalAssistance:adminHome.notes', {
      returnObjects: true
    }),
    component: Notes
  }
];

export default trbAdminPages;
