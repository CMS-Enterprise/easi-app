export type Flags = {
  sandbox: boolean;
  downgradeGovTeam: boolean;
  downgrade508User: boolean;
  downgrade508Tester: boolean;
  lcidExtension: boolean;
  systemProfile: boolean;
};

export type FlagsState = {
  flags: Flags;
  isLoaded: boolean;
  error?: string;
};
