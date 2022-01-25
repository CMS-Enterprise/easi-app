import { useEffect, useState } from 'react';

type deviceProps = 'mobile' | 'tablet' | 'desktop';

export const mobile: number = 640;
export const tablet: number = 1024;

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
      return width <= mobile;
    case 'tablet':
      return width <= tablet;
    case 'desktop':
      return true;
    default:
      return true;
  }
};

export default useCheckResponsiveScreen;
