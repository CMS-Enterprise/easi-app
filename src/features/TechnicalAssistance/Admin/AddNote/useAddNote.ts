import { ApolloCache, FetchResult } from '@apollo/client';
import {
  CreateTRBAdminNoteGuidanceLetterInput,
  TRBAdminNoteCategory,
  TRBAdminNoteFragment,
  TRBAdminNoteFragmentDoc,
  useCreateTRBAdminNoteConsultSessionMutation,
  useCreateTRBAdminNoteGeneralRequestMutation,
  useCreateTRBAdminNoteGuidanceLetterMutation,
  useCreateTRBAdminNoteInitialRequestFormMutation,
  useCreateTRBAdminNoteSupportingDocumentsMutation
} from 'gql/generated/graphql';

type AddNoteCommonFields<T extends TRBAdminNoteCategory> = {
  category: T;
  noteText: string;
};

type AddNoteInitialRequestFormFields = {
  appliesToBasicRequestDetails: boolean;
  appliesToSubjectAreas: boolean;
  appliesToAttendees: boolean;
} & AddNoteCommonFields<TRBAdminNoteCategory.INITIAL_REQUEST_FORM>;

type AddNoteGuidanceLetterFields = {
  sections: Array<'appliesToMeetingSummary' | 'appliesToNextSteps' | string>;
} & AddNoteCommonFields<TRBAdminNoteCategory.GUIDANCE_LETTER>;

type AddNoteSupportingDocumentsFields = {
  documentIDs: string[];
} & AddNoteCommonFields<TRBAdminNoteCategory.SUPPORTING_DOCUMENTS>;

/** Add note fields based on category */
export type AddNoteFields =
  | AddNoteInitialRequestFormFields
  | AddNoteGuidanceLetterFields
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
    noteData: TRBAdminNoteFragment | undefined
  ) =>
    cache.modify({
      id: cache.identify({ __typename: 'TRBRequest', trbRequestId }),
      fields: {
        adminNotes(existingNotes = []) {
          const newNote = cache.writeFragment({
            data: noteData,
            fragment: TRBAdminNoteFragmentDoc
          });
          return [...existingNotes, newNote];
        }
      }
    });

  const [createNoteGeneralRequest] =
    useCreateTRBAdminNoteGeneralRequestMutation({
      update: (cache, result) =>
        modifyCache(cache, result.data?.createTRBAdminNoteGeneralRequest)
    });

  const [createNoteInitialRequestForm] =
    useCreateTRBAdminNoteInitialRequestFormMutation({
      update: (cache, result) =>
        modifyCache(cache, result.data?.createTRBAdminNoteInitialRequestForm)
    });

  const [createNoteSupportingDocuments] =
    useCreateTRBAdminNoteSupportingDocumentsMutation({
      update: (cache, result) =>
        modifyCache(cache, result.data?.createTRBAdminNoteSupportingDocuments)
    });

  const [createNoteConsultSession] =
    useCreateTRBAdminNoteConsultSessionMutation({
      update: (cache, result) =>
        modifyCache(cache, result.data?.createTRBAdminNoteConsultSession)
    });

  const [createNoteGuidanceLetter] =
    useCreateTRBAdminNoteGuidanceLetterMutation({
      update: (cache, result) =>
        modifyCache(cache, result.data?.createTRBAdminNoteGuidanceLetter)
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

    if (formData.category === TRBAdminNoteCategory.GUIDANCE_LETTER) {
      /** Default input values */
      const input: CreateTRBAdminNoteGuidanceLetterInput = {
        trbRequestId,
        noteText: formData.noteText,
        appliesToMeetingSummary: false,
        appliesToNextSteps: false,
        insightIDs: []
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
            input.insightIDs.push(value);
            break;
        }
      });

      return createNoteGuidanceLetter({
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
