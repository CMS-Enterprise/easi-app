export type Flags = {
  atoProcessList: boolean;
  downgradeGovTeam: boolean;
  downgradeTrbAdmin: boolean;
  systemProfileHiddenFields: boolean;
  systemWorkspace: boolean;
  systemWorkspaceRequestsCard: boolean;
  grbReviewTab: boolean;
};

export type FlagsState = {
  flags: Flags;
  isLoaded: boolean;
  error?: string;
};
