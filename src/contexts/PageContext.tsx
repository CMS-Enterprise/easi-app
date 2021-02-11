import { createContext } from 'react';

const PageContext = createContext<{
  page: string;
  setPage: (name: string) => void;
}>({
  page: '',
  setPage: () => {}
});

export default PageContext;
