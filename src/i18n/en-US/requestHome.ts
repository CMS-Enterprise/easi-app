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
  },
  addPOC: {
    title: 'Add a project point of contact',
    description:
      'Add another project team member to this IT Governance request. You may also designate them as the primary requester for this project, giving them full edit access to the request in EASi.',
    addAlert:
      'Adding a project contact will send them an informational notification email with a brief summary of the request. If you have designated them as the primary requester, they will also receive a link to EASi and will be able to access all content about this IT Governance request, though they will not be able to take any actions on the request or see Admin-specific details such as Admin notes. Please make sure this individual should be able to access this information before you proceed.',
    isRequester: 'This team member is the primary requester',
    isRequesterHint:
      'Checking this box will replace the current primary requester and remove their edit access in EASi.',
    addButton: 'Add point of contact',
    dontAddAndReturn: 'Don’t add and return to request details',
    successAlert:
      'You have added <bold>{{name}}</bold> as a project point of contact.'
  },
  pocRemoval: {
    success: 'You successfully removed a project point of contact.',
    error:
      'There was an issue removing this project point of contact. Please try again. If the error persists, try again later.'
  },
  editPOC: {
    title: 'Edit a project point of contact',
    description:
      'Edit the details for this team member. You may also designate them as the primary requester for this project, giving them full edit access to the request in EASi. If they are already the primary requester and you wish to remove them, you must first designate a new primary requester.',
    notRemovePrimary:
      'You may not remove this primary requester until you designate a new one. Please add a new contact or edit an existing contact to do so.'
  },
  sharedPOC: {
    name_add: 'New contact name',
    name_edit: 'Project contact name',
    component_add: 'New contact component',
    component_edit: 'Project contact component',
    roles: 'New contact role'
  }
};

export default requestHome;
