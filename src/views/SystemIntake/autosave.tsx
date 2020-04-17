import _ from 'lodash';
import { useEffect, useRef } from 'react';

export function usePrevious<T>(value: T) {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current as T;
}

type AutosaveProps = {
  values: any;
  onSave: () => void;
};

const Autosave = ({ values, onSave }: AutosaveProps) => {
  // const previousValues = usePrevious(values);
  const debounceSave = useRef(_.debounce(onSave, 3000)).current;

  useEffect(() => {
    debounceSave();
  }, [values]);

  return null;
};

export default Autosave;
