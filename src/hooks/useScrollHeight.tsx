// Custom hook for detecting scroll height for fixed elements

import { useEffect } from 'react';

const useScrollHeight = (
  topScrollHeight: number | null,
  callback: (state: boolean) => void
) => {
  useEffect(() => {
    const handleScroll = () => {
      if (topScrollHeight && window.scrollY > topScrollHeight) {
        callback(true);
      } else {
        callback(false);
      }
    };
    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  });
};

export default useScrollHeight;
