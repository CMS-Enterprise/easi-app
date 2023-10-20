import { FetchResult, useMutation } from '@apollo/client';

import {
  CreateTrbAdminNoteAdviceLetterQuery,
  CreateTrbAdminNoteConsultSessionQuery,
  CreateTrbAdminNoteGeneralRequestQuery,
  CreateTrbAdminNoteInitialRequestFormQuery,
  CreateTrbAdminNoteSupportingDocumentsQuery
} from 'queries/TrbAdminNoteQueries';
import {
  CreateTRBAdminNoteAdviceLetter,
  CreateTRBAdminNoteAdviceLetterVariables
} from 'queries/types/CreateTRBAdminNoteAdviceLetter';
import {
  CreateTRBAdminNoteConsultSession,
  CreateTRBAdminNoteConsultSessionVariables
} from 'queries/types/CreateTRBAdminNoteConsultSession';
import {
  CreateTRBAdminNoteGeneralRequest,
  CreateTRBAdminNoteGeneralRequestVariables
} from 'queries/types/CreateTRBAdminNoteGeneralRequest';
import {
  CreateTRBAdminNoteInitialRequestForm,
  CreateTRBAdminNoteInitialRequestFormVariables
} from 'queries/types/CreateTRBAdminNoteInitialRequestForm';
import {
  CreateTRBAdminNoteSupportingDocuments,
  CreateTRBAdminNoteSupportingDocumentsVariables
} from 'queries/types/CreateTRBAdminNoteSupportingDocuments';
import { TRBAdminNoteCategory } from 'types/graphql-global-types';

type AddNoteCommonFields<T extends TRBAdminNoteCategory> = {
  category: T;
  noteText: string;
};

type AddNoteInitialRequestFormFields = {
  appliesToBasicRequestDetails: boolean;
  appliesToSubjectAreas: boolean;
  appliesToAttendees: boolean;
} & AddNoteCommonFields<TRBAdminNoteCategory.INITIAL_REQUEST_FORM>;

type AddNoteAdviceLetterFields = {
  section: 'appliesToMeetingSummary' | 'appliesToNextSteps' | string;
  recommendationIDs: string[];
} & AddNoteCommonFields<TRBAdminNoteCategory.ADVICE_LETTER>;

type AddNoteSupportingDocumentsFields = {
  documentIDs: string[];
} & AddNoteCommonFields<TRBAdminNoteCategory.SUPPORTING_DOCUMENTS>;

/** Add note fields based on category */
export type AddNoteFields =
  | AddNoteInitialRequestFormFields
  | AddNoteAdviceLetterFields
  | AddNoteSupportingDocumentsFields
  | AddNoteCommonFields<TRBAdminNoteCategory.GENERAL_REQUEST>
  | AddNoteCommonFields<TRBAdminNoteCategory.CONSULT_SESSION>;

/**
 * Returns create TRB admin note mutation based on category field value
 */
const useAddNote = (trbRequestId: string) => {
  const [createNoteGeneralRequest] = useMutation<
    CreateTRBAdminNoteGeneralRequest,
    CreateTRBAdminNoteGeneralRequestVariables
  >(CreateTrbAdminNoteGeneralRequestQuery);

  const [createNoteInitialRequestForm] = useMutation<
    CreateTRBAdminNoteInitialRequestForm,
    CreateTRBAdminNoteInitialRequestFormVariables
  >(CreateTrbAdminNoteInitialRequestFormQuery);

  const [createNoteSupportingDocuments] = useMutation<
    CreateTRBAdminNoteSupportingDocuments,
    CreateTRBAdminNoteSupportingDocumentsVariables
  >(CreateTrbAdminNoteSupportingDocumentsQuery);

  const [createNoteConsultSession] = useMutation<
    CreateTRBAdminNoteConsultSession,
    CreateTRBAdminNoteConsultSessionVariables
  >(CreateTrbAdminNoteConsultSessionQuery);

  const [createNoteAdviceLetter] = useMutation<
    CreateTRBAdminNoteAdviceLetter,
    CreateTRBAdminNoteAdviceLetterVariables
  >(CreateTrbAdminNoteAdviceLetterQuery);

  const createNote = (formData: AddNoteFields): Promise<FetchResult> => {
    if (formData.category === TRBAdminNoteCategory.INITIAL_REQUEST_FORM) {
      const { category, ...values } = formData;
      return createNoteInitialRequestForm({
        variables: {
          input: {
            trbRequestId,
            ...values
          }
        }
      });
    }

    if (formData.category === TRBAdminNoteCategory.SUPPORTING_DOCUMENTS) {
      const { category, ...values } = formData;
      return createNoteSupportingDocuments({
        variables: {
          input: {
            trbRequestId,
            ...values
          }
        }
      });
    }

    if (formData.category === TRBAdminNoteCategory.CONSULT_SESSION) {
      const { category, ...values } = formData;
      return createNoteConsultSession({
        variables: {
          input: {
            trbRequestId,
            ...values
          }
        }
      });
    }

    if (formData.category === TRBAdminNoteCategory.ADVICE_LETTER) {
      return createNoteAdviceLetter({
        variables: {
          input: {
            trbRequestId,
            noteText: formData.noteText,
            appliesToMeetingSummary:
              formData.section === 'appliesToMeetingSummary',
            appliesToNextSteps: formData.section === 'appliesToNextSteps',
            recommendationIDs: formData.recommendationIDs
          }
        }
      });
    }

    const { category, ...values } = formData;
    return createNoteGeneralRequest({
      variables: {
        input: {
          trbRequestId,
          ...values
        }
      }
    });
  };

  return createNote;
};

export default useAddNote;
