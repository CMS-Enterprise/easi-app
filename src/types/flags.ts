export type Flags = {
  taskListLite?: Boolean;
  sandbox?: Boolean;
  pdfExport?: Boolean;
};

export type FlagsState = {
  flags: Flags;
  isLoaded: boolean;
  error?: string;
};
