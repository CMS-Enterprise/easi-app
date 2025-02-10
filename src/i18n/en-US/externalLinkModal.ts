const externalLinkModal = {
  heading: 'You are leaving EASi.',
  genericHeading: 'Are you sure you want to leave EASi?',
  modalTypes: {
    CFACTS: 'CFACTS',
    CLOUD: 'Cloud'
  },
  description: {
    cfacts:
      'CFACTS requires connectivity via VPN and may require job codes and/or permissions in order to access specific content in the system.',
    cloud:
      'The Cloud homepage requires connectivity via VPN and may require job codes and/or permissions in order to access specific content on the site.',
    generic:
      'If you are accessing another CMS system or site, it could require connectivity via VPN and/or job codes and permissions to access content.',
    contactInfo:
      'Please contact the CMS IT Service Desk at <span>410-786-2580</span> or <span>800-562-1963</span> if you need assistance.'
  },
  redirectingCopy: 'This link is redirecting you to:',
  notConfident:
    'If you are not confident in the safety of this site, you may return to EASi.',
  viewFullURL: 'View full URL',
  continueButton: 'Continue to {{value}}',
  leaveEasi: 'Leave EASi',
  goBackToEasi: 'Go back to EASi',
  returnButton: 'Return to EASi'
};

export default externalLinkModal;
