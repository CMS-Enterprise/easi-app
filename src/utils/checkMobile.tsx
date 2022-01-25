import { useEffect, useState } from 'react';

type deviceProps = 'mobile' | 'tablet' | 'desktop';

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
      return width <= 640;
    case 'tablet':
      return width <= 1024;
    case 'desktop':
      return true;
    default:
      return true;
  }
};

export default useCheckResponsiveScreen;
