/**
 * Copied from https://gist.github.com/ericdcobb/b7cc76a310a93b82ca0b55a42612bdc9
 * Could not get `react-router-hash-link` to work.
 */
import React from 'react';
import { useLocation } from 'react-router-dom';

const useScrollToLocation = () => {
  const scrolledRef = React.useRef(false);
  const { hash } = useLocation();
  const hashRef = React.useRef(hash);

  React.useEffect(() => {
    if (hash) {
      // We want to reset if the hash has changed
      if (hashRef.current !== hash) {
        hashRef.current = hash;
        scrolledRef.current = false;
      }

      // only attempt to scroll if we haven't yet (this could have just reset above if hash changed)
      if (!scrolledRef.current) {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          scrolledRef.current = true;
        }
      }
    }
  });
};

export default useScrollToLocation;
