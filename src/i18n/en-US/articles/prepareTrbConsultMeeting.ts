const prepareTrbConsultMeeting = {
  title: 'Prepare for your TRB consult meeting',
  tag: 'Technical Review Board',
  description:
    'Learn what to expect during and after the meeting, including what to prepare for and what to bring.',
  what: {
    title: 'What is the Technical Review Board?',
    description:
      'The CMS Technical Review Board (TRB) is a technical assistance resource for project teams across the agency at all stages of their system’s life cycle. It offers consultations and reviews on an ongoing or one-off basis, allowing project teams to consult with a cross-functional team of technical advisors. It also guides project teams on adhering to CMS technical standards and leveraging existing technologies.'
  },
  whatToExpect: {
    title: 'What to expect at the meeting',
    description:
      'TRB consultation meetings are there to help the TRB understand what your problem or idea is, and details surrounding any proposed solution. You can expect the TRB and any additional Subject Matter Experts (SMEs) to ask many questions about your system, problem, and solution.'
  },
  tips: {
    title: 'Tips for the meeting',
    list: [
      'Keep it small, but make sure to bring any additional attendees who can help explain your problem or solution and can answer questions from the TRB.',
      'A presentation deck is not necessary but is recommended. You can download TRB template decks below.',
      'If you have specific questions you want answered by the TRB, make sure to bring a list with you.',
      'Keep presentations brief, but thorough.',
      'Don’t worry about running out of time. You can always schedule follow-up sessions with the TRB',
      'If you have one, show your architecture diagram during your presentation. Above all else, this document helps the TRB understand your system, problem, and proposed solution.'
    ]
  },
  whatToBring: {
    title: 'What to bring',
    description:
      'The following are important items to have with you at the TRB meeting:',
    list: [
      'an architecture diagram if you have one',
      'a presentation slide deck if you choose to share one. You may download TRB deck templates below.',
      'any additional materials you wish to discuss at the meeting, such as a business case, incident report, security findings, etc.'
    ]
  },
  downloadTemplates: {
    title: 'Download TRB presentation deck templates',
    description:
      'If you have any questions about the templates or would like help filling one out, you may contact the TRB at <a>{{email}}</a>.',
    link: 'Download deck templates (zip)'
  },
  outcomes: {
    title: 'Potential outcomes',
    description:
      'After the meeting, the TRB will deliberate and provide recommendations and next steps. Within 5 business days, the TRB will compile an guidance letter for your project and send it to you. The guidance letter may contain:',
    list: [
      'recommendations for changes to your system or solution',
      'additional teams or points of contact to reach out to who may be able to help you further',
      'suggestions for systems, services, or solutions to use to implement your idea or solve your problem',
      'a request for a follow-up consultation session'
    ]
  },
  help: {
    text: 'Contact the Technical Review Board:'
  }
};

export default prepareTrbConsultMeeting;
