const governanceReviewTeam = {
  prepare: {
    title: 'Prepare for Governance Review Team meeting',

    whatToExpect: {
      title: 'What to expect',
      items: [
        'Subject Matter Experts (SMEs) from various components will help you refine your business case. Their role is to ensure that the Project Team has considered potential alternatives that the Governance Review Board (GRB) may consider viable, including pros, cons, and estimated costs, as well as the technical feasibility and process requirements of implementation for each solution.',
        'At that meeting, the GRT SMEs will discuss your draft business case and provide feedback both to you and the GRB about the alternative solutions you’re considering to meet your business need.'
      ]
    },

    howToBestPrepare: {
      title: 'How to best prepare',
      subtitle:
        'Sample questions and topics that might be asked during the meeting',
      body:
        'The Governance Review Team (GRT) SMEs may ask you a series of questions after you walk them through your business case. The best way to prepare for this conversation is to review and be able to respond to such questions as they pertain to your business case.'
    },

    capitalPlanning: {
      title: 'Capital Planning and Investment Control (CPIC)',
      items: [
        'Have you conducted a cost/benefit analysis that includes all elements required by OMB?',
        'How long will the current technology likely last before you need to replace it with something else to perform the same function?',
        'Have you established performance measures regarding the desired business outcome of your project',
        'Is your project aligned to any Agency Strategic Objectives or Agency Priority Goals?',
        'Is your project reflected under the appropriate Investment(s) in the CMS Portfolio Management Tool (PMT)?',
        'Is your project aligned and reflected under an Acquisition Strategy?'
      ]
    },

    enterpriseArchitecture: {
      title: 'Enterprise Architecture and Data',
      items: [
        'Have you checked to see if the project capabilities already exist within CMS and if so, is the current system owner willing to support your needs?',
        'Do you have a clearly identified business owner?',
        'What other CMS business processes/systems/programs will you interact with?',
        'How many users would you have and who are they?',
        'Are you compliant with the Technical Reference Architecture?',
        'Does your Project/System need access to any CMS Enterprise Data in order to meet program objectives? PHI, PII, etc.'
      ]
    },

    sharedServices: {
      title: 'Shared Services and Data Hosting',
      items: [
        'Have you explored leveraging one or more of CMS’ shared services as part of your IT solution?',
        'Where are you hosting or planning to host your systems?',
        'What, if any, type of cloud service are you planning to use? IaaS, PaaS, SaaS, etc?'
      ]
    },

    itSecurityPrivacy: {
      title: 'IT Security/Privacy',
      items: [
        'Who is your ISSO and CRA? Have you been in contact with them?',
        'What safeguard(s) will this solution entail (ie. FedRAMP, FISMA certification)?',
        'Is there an existing or new FISMA system ATO that will authorize this project?'
      ]
    },

    whatToBring: {
      title: 'What to bring',
      items: [
        'A copy of your business case',
        'Any contracting materials that you might have in place. For example, a statement of work, a performance work statement, etc.',
        'Additional materials that you’d like to talk through like a system concept diagram, etc.'
      ]
    }
  },
  intake: 'Intake Request',
  businessCase: 'Business Case',
  notes: 'Admin team notes',
  aria: {
    openIntake: 'Open intake request',
    openBusiness: 'Open business case',
    openNotes: 'Open admin team notes'
  },
  back: {
    allRequests: 'Back to all requests'
  },
  actions: 'Actions'
};

export default governanceReviewTeam;
