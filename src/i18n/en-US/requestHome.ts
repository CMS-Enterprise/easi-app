const requestHome = {
  requestHome: {
    title: 'Request home',
    description:
      'Review information about this IT Governance request using the navigation on this page, add additional context about the request and the project, update key information such as the requester and other points of contact, and take actions on this request via the Actions page.',
    sections: {
      adminInfo: {
        heading: 'Admin information',
        intakeSource: {
          title: 'Intake source',
          button: 'Add an intake source'
        },
        reviewTrigger: {
          title: 'Review Trigger(s)',
          button: 'Select a review trigger'
        }
      },
      teamInfo: {
        heading: 'Project team and points of contact',
        description:
          'These individuals are listed as team members or points of contact for this project and were added by the requester or by other Governance Admin Team members. You may designate a new primary requester by adding a new team member or editing an existing one. There must always be one primary requester designated.',
        addAnother: 'Add another project point of contact'
      },
      requestSummary: {
        heading: 'Request summary',
        intakeRequestForm: {
          title: 'Intake Request Form',
          view: 'View Intake Request form'
        },
        businessCase: {
          title: 'Business Case',
          view: 'View Business Case'
        },
        overview: {
          heading: 'Intake Request form overview',
          description:
            'In addition to the basic details in the header above, below are some of the key details about this project included in the submitted Intake Request form.',
          showMore: 'Show more',
          showLess: 'Show less'
        }
      }
    }
  }
};

export default requestHome;
