import debounce from 'lodash/debounce';
import { useEffect, useCallback } from 'react';

type AutoSaveProps = {
  values: any;
  onSave: () => void;
};

const AutoSave = ({ values, onSave }: AutoSaveProps) => {
  const debounceSave = useCallback(debounce(onSave, 3000), [onSave]);

  useEffect(() => {
    debounceSave();
  }, [values, onSave]);

  return null;
};

export default AutoSave;
