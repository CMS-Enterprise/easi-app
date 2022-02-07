// Custom hook for handling mouse clicks outside of mobile expanded side nav

import { RefObject, useEffect } from 'react';

const useOutsideClick = <T extends HTMLElement>(
  ref: RefObject<T> | null,
  callback: (state: boolean) => void
) => {
  useEffect(() => {
    const handleClickOutside = (evt: Event) => {
      if (ref?.current && !ref?.current?.contains(evt.target as HTMLElement)) {
        callback(false);
      }
    };
    document.addEventListener('mouseup', handleClickOutside);
    return () => {
      document.removeEventListener('mouseup', handleClickOutside);
    };
  });
};

export default useOutsideClick;
