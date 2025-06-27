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
    key: 'clearanceOfficer508',
    label: '508 Clearance Officer',
    acronym: '508',
    name: '508 Clearance Officer',
    collaboratorKey: 'collaboratorName508'
  }
] as const;

export default cmsGovernanceTeams;
