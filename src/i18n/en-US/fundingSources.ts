const fundingSources = {
  fundingSource: 'Funding source',
  whichFundingSources: 'Which existing funding sources will fund this project?',
  helpText:
    'If you are unsure or need help, please get in touch with your Front Office or reach out to the Governance Admin Team at <a>IT_Governance@cms.hhs.gov</a>.',
  addFundingSource: 'Add a funding source',
  addFundingSource_plural: 'Add another funding source',
  projectNumber: 'Project number',
  projectNumberLabel: 'Project number: {{projectNumber}}',
  investment: 'Investment',
  investments: 'Investment(s)',
  investmentsLabel: 'Investments: {{investments}}',
  clearFundingSourcesCheckbox:
    'or, check this box if a new investment and/or project number is still being set up for this project',

  form: {
    projectNumberHelpText:
      'Must be 6 digits long. Comma-separate multiple project numbers.',
    projectNumberLink:
      'You can find your project number in the CMS Operating Plan page',
    selectedInvestments: 'Selected investments',
    addFundingSource: 'Add funding source'
  },

  clearFundingSourcesModal: {
    heading:
      'Are you sure this project does not use any existing investments and/or project numbers?',
    description:
      'Checking this box will remove all previously-added funding sources. Are you sure you want to continue? You may re-add funding sources again if needed.',
    removeFundingSources: 'Remove funding sources',
    dontRemove: "Don't remove"
  },

  removeFundingSourcesModal: {
    heading: 'Are you sure you want to remove this funding source?',
    description:
      'This action cannot be undone, though you may add this funding source again if needed.',
    removeFundingSource: 'Remove funding source'
  }
};

export default fundingSources;
