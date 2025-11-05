// TODO: add known errors, develop BE method for implementing known errors
export const knownErrors: Record<string, string> = {};

export const operationErrors: Record<string, string> = {
  CreateSystemIntakeGRBReviewers:
    'There was an issue adding GRB reviewers. Please try again, and if the error persists, try again at a later date.',
  UpdateTRBGuidanceLetterInsightOrder:
    'There was an issue saving your guidance. Please try again, and if the problem persists, try again later.',
  UpdateTRBRequestLead:
    'There was an issue assigning a TRB lead for this request. Please try again, and if the problem persists, try again later.',
  CreateTRBAdminNoteGeneralRequest:
    'There was a problem saving your note. Please try again. If the error persists, please try again at a later date.',
  CreateTRBAdminNoteInitialRequestForm:
    'There was a problem saving your note. Please try again. If the error persists, please try again at a later date.',
  CreateTRBAdminNoteSupportingDocuments:
    'There was a problem saving your note. Please try again. If the error persists, please try again at a later date.',
  CreateTRBAdminNoteConsultSession:
    'There was a problem saving your note. Please try again. If the error persists, please try again at a later date.',
  CreateTRBAdminNoteGuidanceLetter:
    'There was a problem saving your note. Please try again. If the error persists, please try again at a later date.',
  CloseTRBRequest:
    'There was an issue closing this request. Please try again, and if the problem persists, try again later.',
  ReopenTRBRequest:
    'There was an issue re-opening this request. Please try again, and if the problem persists, try again later.',
  UpdateTRBRequestConsultMeeting:
    'There was an issue scheduling the consult session. Please try again, and if the problem persists, try again later.',
  DeleteTRBGuidanceLetterInsight:
    'There was an issue removing this guidance. Please try again, and if the problem persists, try again later.',
  RequestReviewForTRBGuidanceLetter:
    'There was an issue submitting your guidance letter for internal review. Please try again, and if the problem persists, try again later.',
  UpdateTRBRequestAndForm:
    'There was an issue updating this request. Please try again, and if the problem persists, try again later.',
  UpdateTRBRequestFundingSources:
    'Your basic request details were not saved. Please try again. If the error persists, please try again at a later date.',
  DeleteTRBRequestFundingSource:
    'Your basic request details were not saved. Please try again. If the error persists, please try again at a later date.',
  DeleteTRBRequestDocument:
    'There was an issue removing your document. Please try again, and if the problem persists, try again later.',
  CreateTRBRequestDocument:
    'There was an issue uploading your document. Please try again, and if the problem persists, try again later.',
  CreateTRBRequestAttendee:
    'There was an issue adding an attendee. Please try again, and if the problem persists, try again later.',
  UpdateTRBRequestAttendee:
    'There was an issue updating an attendee. Please try again, and if the problem persists, try again later.',
  DeleteTRBRequestAttendee:
    'There was an issue removing an attendee. Please try again, and if the problem persists, try again later.',
  CreateSystemIntakeGRBDiscussionPost:
    'There was an issue with adding to the discussion board, please try again.',
  CreateSystemIntakeGRBDiscussionReply:
    'There was an issue with adding your reply, please try again.',
  DeleteSystemIntakeDocument:
    'There was an issue removing your document. Please try again, and if the problem persists, try again later.',
  CreateSystemIntakeDocument:
    'There was an issue uploading your document. Please try again, and if the problem persists, try again later.',
  UpdateSystemIntakeGRBReviewer:
    'There was an issue updating this GRB reviewer. Please try again, and if the error persists, try again at a later date.',
  DeleteSystemIntakeGRBReviewer:
    'There was an issue removing this GRB reviewer. Please try again, and if the error persists, try again at a later date.',
  ExtendGRBReviewDeadlineAsync:
    'There was an issue adding time to this review. Please try again, and if the problem persists, try again later.',
  CastGRBReviewerVote:
    'There was an issue submitting your vote. Please try again, and if the problem persists, try again later.',
  DeleteSystemIntakeGRBPresentationLinks:
    'There was an issue deleting the presentation details. Please try again, and if the problem persists, try again later.',
  UpdateSystemIntakeGRBReviewAsyncPresentation:
    'There was an issue uploading your presentation. Please try again, and if the issue persists please try again later.',
  StartGRBReview:
    'There was a problem saving your GRB review form. Please try again. If the error persists, please try again at a later date.',
  UpdateSystemIntakeGRBReviewFormInputTimeframeAsync:
    'There was a problem saving your GRB review form. Please try again. If the error persists, please try again at a later date.',
  UpdateSystemIntakeGRBReviewStandardPresentation:
    'There was a problem saving your GRB review form. Please try again. If the error persists, please try again at a later date.',
  UpdateSystemIntakeGRBReviewType:
    'There was a problem saving your GRB review form. Please try again. If the error persists, please try again at a later date.',
  RestartGRBReviewAsync:
    'There was an issue restarting this review. Please try again, and if the problem persists, try again later.',
  SendPresentationDeckReminder:
    'There was an issue sending the reminder. Please try again.',
  SendSystemIntakeGRBReviewerReminder:
    'There was an issue sending your reminder. Please try again, and if the problem persists, try again later.',
  UploadSystemIntakeGRBPresentationDeck:
    'There was an issue uploading your presentation. Please try again, and if the issue persists please try again later.',
  SetSystemIntakeGRBPresentationLinks:
    'There was an issue uploading your presentation. Please try again, and if the issue persists please try again later.',
  UnlinkSystemIntakeRelation:
    'There was an issue removing the link between this request and all of the selected systems. Please try again, and if the problem persists, try again later.',
  DeleteSystemLink:
    'There was an issue removing the link between this request and the selected system. Please try again, and if the problem persists, try again later.',
  AddSystemLink:
    'There was an issue saving your changes. Please try again, and if the problem persists, try again later.',
  SetTrbRequestRelationNewSystem:
    'EASi encountered an issue. Please try again, and if the problem persists, try again later.',
  SetSystemIntakeRelationNewSystem:
    'EASi encountered an issue. Please try again, and if the problem persists, try again later.',
  SetTrbRequestRelationExistingSystem:
    'EASi encountered an issue. Please try again, and if the problem persists, try again later.',
  SetSystemIntakeRelationExistingSystem:
    'EASi encountered an issue. Please try again, and if the problem persists, try again later.',
  SetTrbRequestRelationExistingService:
    'EASi encountered an issue. Please try again, and if the problem persists, try again later.',
  SetSystemIntakeRelationExistingService:
    'EASi encountered an issue. Please try again, and if the problem persists, try again later.',
  UnlinkTrbRequestRelation:
    'EASi encountered an issue. Please try again, and if the problem persists, try again later.',
  SetRolesForUserOnSystem:
    'There was a problem removing a team member. Please try again. If the error persists, please try again at a later date.',
  ArchiveSystemIntake:
    'There was an issue archiving this request. Please try again, and if the problem persists, try again later.'
};

const error = {
  notFound: {
    heading: 'This page cannot be found.',
    thingsToTry: 'Here is a list of things you could try to check and fix:',
    list: [
      'Please check if the address you typed in is correct.',
      "If you've typed the address correctly, check the spelling.",
      "If you've copied and pasted the address, check that you've copied the entire address."
    ],
    tryAgain:
      'If none of the above have solved the problem, please return to the home page and try again.',
    goHome: 'Go back to the home page'
  },
  encounteredIssueTryAgain:
    'EASi encountered an issue. Please try again, and if the problem persists, try again later.',
  knownErrors,
  operationErrors,
  global: {
    generalError: 'Something went wrong with your request.',
    generalBody:
      'Please try again. If the problem persists, please contact support.',
    knownErrors,
    networkError: {
      heading: 'Unable to connect to the server.',
      body: 'Please check your connection and try again. If the problem persists, please contact support.'
    }
  }
};

export default error;
