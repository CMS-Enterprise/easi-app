import { useHistory, useLocation } from 'react-router-dom';

export type DiscussionMode = 'view' | 'start' | 'reply' | undefined;

export default function useDiscussion() {
  const history = useHistory();
  const location = useLocation();

  return {
    getDiscussionMode() {
      const q = new URLSearchParams(location.search);
      const discussionMode = (q.get('discussion') ||
        undefined) as DiscussionMode;
      return discussionMode;
    },
    setDiscussion(query: string | false) {
      if (query === false) {
        history.push(`${location.pathname}`);
        return;
      }
      history.push(`${location.pathname}?${query}`);
    }
  };
}
