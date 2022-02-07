import { useEffect, useState } from 'react';

import deviceBreakpoints from 'stylesheets/_variables.module.scss';

type deviceProps = 'mobile' | 'tablet' | 'desktop';

export const mobile: number = parseInt(deviceBreakpoints.tablet, 10);
export const tablet: number = parseInt(deviceBreakpoints.desktop, 10);

const useCheckResponsiveScreen = (device: deviceProps) => {
  const [width, setWidth] = useState(window.innerWidth);
  const handleWindowSizeChange = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  switch (device) {
    case 'mobile':
      return width < mobile;
    case 'tablet':
      return width < tablet;
    case 'desktop':
      return true;
    default:
      return true;
  }
};

export default useCheckResponsiveScreen;
