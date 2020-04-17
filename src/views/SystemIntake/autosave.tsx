import debounce from 'lodash/debounce';
import { useEffect, useCallback } from 'react';

type AutosaveProps = {
  values: any;
  onSave: () => void;
};

const Autosave = ({ values, onSave }: AutosaveProps) => {
  const debounceSave = useCallback(debounce(onSave, 3000), [onSave]);

  useEffect(() => {
    debounceSave();
  }, [values, onSave]);

  return null;
};

export default Autosave;
