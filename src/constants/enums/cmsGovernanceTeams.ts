const cmsGovernanceTeams = [
  {
    key: 'technicalReviewBoard',
    label: 'Technical Review Board (TRB)',
    acronym: 'TRB',
    name: 'Technical Review Board',
    collaboratorKey: 'trbCollaboratorName'
  },
  {
    key: 'securityPrivacy',
    label: "OIT's Security and Privacy Group (ISPG)",
    acronym: 'ISPG',
    name: "OIT's Security and Privacy Group",
    collaboratorKey: 'oitSecurityCollaboratorName'
  },
  {
    key: 'enterpriseArchitecture',
    label: 'Enterprise Architecture (EA)',
    acronym: 'EA',
    name: 'Enterprise Architecture',
    collaboratorKey: 'eaCollaboratorName'
  }
] as const;

export default cmsGovernanceTeams;
