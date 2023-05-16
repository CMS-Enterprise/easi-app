import i18next, { TFunction, TOptions } from 'i18next';

const mockTranslation = (namespace?: string): { t: TFunction } => {
  return {
    t: (key: string, options?: string | TOptions) =>
      i18next.t(`${namespace && `${namespace}:`}${key}`, options)
  };
};

export default mockTranslation;
