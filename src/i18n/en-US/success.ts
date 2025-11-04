export const operationSuccesses: Record<string, string> = {
  CreateSystemIntakeGRBReviewers:
    'You added <strong>1 reviewer</strong> to this GRB review.',
  CreateSystemIntakeGRBReviewers_plural:
    'You added <strong>{{count}} reviewers</strong> to this GRB review.',
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
  CreateTRBRequestFeedback:
    'There was an issue submitting your feedback. Please try again, and if the problem persists, try again later.',
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
    'You have successfully added to the discussion board.',
  CreateSystemIntakeGRBDiscussionReply: 'Success! Your reply has been added.',
  DeleteSystemIntakeDocument: 'You have successfully removed {{documentName}}.',
  CreateSystemIntakeDocument:
    'Your document has been uploaded and is being scanned.',
  UpdateSystemIntakeGRBReviewer:
    'You updated roles for {{commonName}} for this GRB review.',
  DeleteSystemIntakeGRBReviewer:
    'You removed <strong>{{commonName}}</strong> as a GRB reviewer.',
  ExtendGRBReviewDeadlineAsync:
    'You added time to this GRB review. The new end date is {{date}} at 5:00pm EST.',
  CastGRBReviewerVote:
    'There was an issue submitting your vote. Please try again, and if the problem persists, try again later.',
  DeleteSystemIntakeGRBPresentationLinks:
    'There was an issue deleting the presentation details. Please try again, and if the problem persists, try again later.',
  UpdateSystemIntakeGRBReviewAsyncPresentation:
    'There was an issue uploading your presentation. Please try again, and if the issue persists please try again later.',
  RestartGRBReviewAsync:
    'There was an issue restarting this review. Please try again, and if the problem persists, try again later.',
  SendPresentationDeckReminder:
    'There was an issue sending the reminder. Please try again.',
  SendSystemIntakeGRBReviewerReminder:
    'There was an issue sending your reminder. Please try again, and if the problem persists, try again later.',
  UploadSystemIntakeGRBPresentationDeck:
    'There was an issue uploading your presentation. Please try again, and if the issue persists please try again later.',
  UnlinkSystemIntakeRelation:
    'You have removed all linked systems from this request.',
  DeleteSystemLink: 'You have removed a linked system from this request.',
  AddSystemLink:
    'You linked <span>{{updatedSystem}}</span> to this IT Governance request.',
  UpdateSystemLink:
    'You saved changes to the system link for <span>{{updatedSystem}}</span>.',
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
    'There was a problem removing a team member. Please try again. If the error persists, please try again at a later date.'
};

export default {
  global: {
    success: 'Operation completed successfully'
  },
  operationSuccesses
};
