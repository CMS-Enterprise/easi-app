import { useLocation } from 'react-router-dom';

export default function useIsWorkspaceParam(): boolean {
  const loc = useLocation();
  const par = new URLSearchParams(loc.search);
  return par.has('workspace');
}
