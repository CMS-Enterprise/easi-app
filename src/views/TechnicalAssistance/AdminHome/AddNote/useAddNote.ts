import { ApolloCache, FetchResult, useMutation } from '@apollo/client';

import { TRBAdminNoteFragment } from 'queries/GetTrbAdminNotesQuery';
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
import { TRBAdminNoteFragment as TRBAdminNote } from 'queries/types/TRBAdminNoteFragment';
import {
  CreateTRBAdminNoteGuidanceLetterInput,
  TRBAdminNoteCategory
} from 'types/graphql-global-types';

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
  sections: Array<'appliesToMeetingSummary' | 'appliesToNextSteps' | string>;
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
  /** Modify notes in cache after mutation */
  const modifyCache = (
    cache: ApolloCache<any>,
    noteData: TRBAdminNote | undefined
  ) =>
    cache.modify({
      id: cache.identify({ __typename: 'TRBRequest', trbRequestId }),
      fields: {
        adminNotes(existingNotes = []) {
          const newNote = cache.writeFragment({
            data: noteData,
            fragment: TRBAdminNoteFragment
          });
          return [...existingNotes, newNote];
        }
      }
    });

  const [createNoteGeneralRequest] = useMutation<
    CreateTRBAdminNoteGeneralRequest,
    CreateTRBAdminNoteGeneralRequestVariables
  >(CreateTrbAdminNoteGeneralRequestQuery, {
    update: (cache, result) =>
      modifyCache(cache, result.data?.createTRBAdminNoteGeneralRequest)
  });

  const [createNoteInitialRequestForm] = useMutation<
    CreateTRBAdminNoteInitialRequestForm,
    CreateTRBAdminNoteInitialRequestFormVariables
  >(CreateTrbAdminNoteInitialRequestFormQuery, {
    update: (cache, result) =>
      modifyCache(cache, result.data?.createTRBAdminNoteInitialRequestForm)
  });

  const [createNoteSupportingDocuments] = useMutation<
    CreateTRBAdminNoteSupportingDocuments,
    CreateTRBAdminNoteSupportingDocumentsVariables
  >(CreateTrbAdminNoteSupportingDocumentsQuery, {
    update: (cache, result) =>
      modifyCache(cache, result.data?.createTRBAdminNoteSupportingDocuments)
  });

  const [createNoteConsultSession] = useMutation<
    CreateTRBAdminNoteConsultSession,
    CreateTRBAdminNoteConsultSessionVariables
  >(CreateTrbAdminNoteConsultSessionQuery, {
    update: (cache, result) =>
      modifyCache(cache, result.data?.createTRBAdminNoteConsultSession)
  });

  const [createNoteAdviceLetter] = useMutation<
    CreateTRBAdminNoteAdviceLetter,
    CreateTRBAdminNoteAdviceLetterVariables
  >(CreateTrbAdminNoteAdviceLetterQuery, {
    update: (cache, result) =>
      modifyCache(cache, result.data?.createTRBAdminNoteAdviceLetter)
  });

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
      /** Default input values */
      const input: CreateTRBAdminNoteGuidanceLetterInput = {
        trbRequestId,
        noteText: formData.noteText,
        appliesToMeetingSummary: false,
        appliesToNextSteps: false,
        recommendationIDs: []
      };

      // Set input values based on sections array
      formData.sections.forEach(value => {
        switch (value) {
          case 'appliesToMeetingSummary':
            input.appliesToMeetingSummary = true;
            break;
          case 'appliesToNextSteps':
            input.appliesToNextSteps = true;
            break;
          default:
            input.recommendationIDs.push(value);
            break;
        }
      });

      return createNoteAdviceLetter({
        variables: {
          input
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
