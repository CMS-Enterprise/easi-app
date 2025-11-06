export const operationSuccesses: Record<string, string> = {
  CreateSystemIntakeGRBReviewers:
    'You added <strong>1 reviewer</strong> to this GRB review.',
  CreateSystemIntakeGRBReviewers_plural:
    'You added <strong>{{count}} reviewers</strong> to this GRB review.',
  UpdateTRBGuidanceLetterInsightOrder:
    'There was an issue saving your guidance. Please try again, and if the problem persists, try again later.',
  UpdateTRBRequestLead:
    '{{name}} is assigned as the TRB lead for this request.',
  CreateTRBAdminNoteGeneralRequest: 'Your note has been added.',
  CreateTRBAdminNoteInitialRequestForm: 'Your note has been added.',
  CreateTRBAdminNoteSupportingDocuments: 'Your note has been added.',
  CreateTRBAdminNoteConsultSession: 'Your note has been added.',
  CreateTRBAdminNoteGuidanceLetter: 'Your note has been added.',
  CloseTRBRequest: 'Action complete. This request is now closed.',
  ReopenTRBRequest: 'Action complete. This request is now open.',
  UpdateTRBRequestConsultMeeting:
    'The date for this request’s TRB consult session is set for {{date}} at {{time}}.',
  DeleteTRBGuidanceLetterInsight: 'Your guidance was removed from this letter.',
  RequestReviewForTRBGuidanceLetter: 'Your guidance was added to this letter.',
  UpdateTRBRequestAndForm:
    'There was an issue updating this request. Please try again, and if the problem persists, try again later.',
  UpdateTRBRequestFundingSources:
    'Your basic request details were not saved. Please try again. If the error persists, please try again at a later date.',
  DeleteTRBRequestFundingSource:
    'Your basic request details were not saved. Please try again. If the error persists, please try again at a later date.',
  DeleteTRBRequestDocument: 'You have successfully removed {{-documentName}}.',
  CreateTRBRequestDocument:
    'There was an issue uploading your document. Please try again, and if the problem persists, try again later.',
  CreateTRBRequestAttendee: 'Your attendee has been added.',
  UpdateTRBRequestAttendee: 'Your attendee has been edited.',
  DeleteTRBRequestAttendee: 'Your attendee has been removed.',
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
    'Presentation links have been removed.',
  UpdateSystemIntakeGRBReviewAsyncPresentation:
    'Your presentation details have been added.',
  RestartGRBReviewAsync:
    'You restarted this GRB review. The new end date is <bold>{{date}}</bold> at 5:00pm EST.',
  SendPresentationDeckReminder:
    'There was an issue sending the reminder. Please try again.',
  SendSystemIntakeGRBReviewerReminder:
    'You sent a voting reminder for this GRB review. GRB members added to this review will receive a voting reminder email.',
  UploadSystemIntakeGRBPresentationDeck:
    'You have successfully uploaded your GRB presentation.',
  SetSystemIntakeGRBPresentationLinks:
    'You have successfully uploaded your GRB presentation.',
  UnlinkSystemIntakeRelation:
    'You have removed all linked systems from this request.',
  deleteSystemLink: 'You have removed a linked system from this request.',
  addSystemLink:
    'You linked <span>{{system}}</span> to this IT Governance request.',
  updateSystemLink:
    'You saved changes to the system link for <span>{{system}}</span>.',
  SetRolesForUserOnSystem: '{{commonName}} has been removed as a team member.',
  ArchiveSystemIntake: 'You archived this request.',
  CreateSystemIntakeContact:
    'You have added <bold>{{name}}</bold> as a project point of contact.',
  EditSystemIntakeContact: 'You have edited a project point of contact.',
  DeleteSystemIntakeContact:
    'You successfully removed a project point of contact.'
};

export default {
  global: {
    success: 'Operation completed successfully'
  },
  operationSuccesses
};
