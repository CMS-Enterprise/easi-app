import { useEffect, useRef } from 'react';

function useDocumentTitle(title: string) {
  const defaultTitle = useRef(document.title);

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    const newTitle = defaultTitle.current;
    return () => {
      if (newTitle) {
        document.title = newTitle;
      }
    };
  }, []);
}

export default useDocumentTitle;
