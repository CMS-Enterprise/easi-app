export type Flags = {
  sandbox: boolean;
  downgradeGovTeam: boolean;
  downgrade508User: boolean;
  downgrade508Tester: boolean;
  systemProfile: boolean;
  help: boolean;
};

export type FlagsState = {
  flags: Flags;
  isLoaded: boolean;
  error?: string;
};
