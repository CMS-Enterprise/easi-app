export type Flags = {
  taskListLite: Boolean;
  sandbox: Boolean;
};

export type FlagsState = {
  flags: Flags;
  isLoaded: boolean;
  error?: string;
};
