// @hookform/resolvers 2.x omits a `types` condition for its Yup export.
// TypeScript's bundler resolution therefore cannot find the bundled declaration.
declare module '@hookform/resolvers/yup' {
  export { yupResolver } from '@hookform/resolvers/yup/yup/dist/yup';
}

// @toast-ui/editor includes declarations under `types/` but does not expose
// them through its package export map.
declare module '@toast-ui/editor' {
  export { default } from '@toast-ui/editor/types/index';
}
