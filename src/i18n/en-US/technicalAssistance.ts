const technicalAssistance = {
  heading: 'Technical Assistance',
  nextStep: 'Start a new request',
  table: {
    header: {
      requestName: 'Request Name',
      submissionDate: 'Submission date',
      status: 'Status'
    }
  },
  requestForm: {
    heading: 'TRB Request',
    description: [
      'Tell the Technical Review Board (TRB) what type of technical support you need. The information you provide on this form helps the TRB understand context around your request in order to offer more targeted help.',
      'After submitting this form, you will receive an automatic email from the TRB mailbox, and an TRB team member will reach out regarding next steps.'
    ],
    steps: [
      { name: 'Basic request details' },
      {
        name: 'Subject areas',
        description:
          'Select any and all subjects or topics that are relevant to your request or that you would like specific help with. This will help the TRB invite any additional subject matter experts (SMEs) who may be able to provide additional assistance.'
      },
      {
        name: 'Attendees',
        description:
          'As the primary requester, please add your CMS component and role on the project. You may also add the names and contact information for any additional individuals who should be present at the IT Tech Lounge or other meetings.'
      },
      {
        name: 'Supporting documents',
        description:
          'Upload any documents relevant to your request. This could include documents such as presentation slide decks, concept papers, architecture diagrams, or other system information documents.'
      },
      {
        name: 'Check and submit',
        longName: 'Check your answers and submit your TRB Request'
      }
    ]
  }
};

export default technicalAssistance;
