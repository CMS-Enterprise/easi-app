/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OKTA_REDIRECT_LOGIN_ENABLED?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
