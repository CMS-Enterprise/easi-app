import { useContext } from 'react';

import PageContext from 'contexts/PageContext';

const usePageContext = (): {
  page: string;
  setPage: (page: string) => void;
} => {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error(
      'This custom hook cannot be used outside of the Page Context'
    );
  }

  return {
    page: context.page,
    setPage: context.setPage
  };
};

export default usePageContext;
