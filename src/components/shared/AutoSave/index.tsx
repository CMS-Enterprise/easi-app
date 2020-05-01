import debounce from 'lodash/debounce';
import { useEffect, useCallback } from 'react';

type AutoSaveProps = {
  values: any;
  onSave: () => void;
  debounceDelay: number;
};

const AutoSave = ({ values, onSave, debounceDelay }: AutoSaveProps) => {
  const debounceSave = useCallback(debounce(onSave, debounceDelay), [
    onSave,
    debounceDelay
  ]);

  useEffect(debounceSave, [debounceSave, values]);

  return null;
};

export default AutoSave;
