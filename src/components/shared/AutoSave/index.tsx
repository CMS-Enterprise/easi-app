import { useCallback, useEffect } from 'react';
import debounce from 'lodash/debounce';

type AutoSaveProps = {
  values: any;
  onSave: () => void;
  debounceDelay: number;
};

const AutoSave = ({ values, onSave, debounceDelay }: AutoSaveProps) => {
  const debounceSave = useCallback(debounce(onSave, debounceDelay), [
    debounceDelay,
    onSave
  ]);
  useEffect(debounceSave, [debounceSave, values]);
  return null;
};

export default AutoSave;
