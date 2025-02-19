import { Flags } from '../types/flags';

declare module '@okta/okta-signin-widget';
declare module '@okta/okta-signin-widget/dist/js/okta-sign-in.min';
declare module 'launchdarkly-js-sdk-common' {
  export interface LDFlagSet extends Flags {}
}

declare global {
  // Here, declare things that go in the global namespace, or augment
  // existing declarations in the global namespace

  declare module '*.doc';
  declare module '*.pdf';
  declare module '*.docx';

  // These types are defined in GQL generated types.
  // Defining globally here for FE to recognize generated types.
   type UUID = string;
   type HTML = string;
   type Time = string;
   type EmailAddress = string;
   type Upload = File;

   interface Window {
    Cypress: any;
    store: any;
  }
}
