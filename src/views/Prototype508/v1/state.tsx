import React from 'react';
import { DateTime } from 'luxon';

import projects from './data';
import { Project } from './types';

interface IContextProps {
  dispatch: ({ type }: { type: string }) => void;
}

type GlobalState = {
  projects: Record<number, Project>;
};

const projectsContext = React.createContext<GlobalState>({
  projects
});
const updateProjectContext = React.createContext({} as IContextProps);

export const ProjectsProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = React.useReducer(
    (globalState: GlobalState, project: Project) => {
      return {
        projects: {
          ...globalState.projects,
          [project.id]: {
            ...project,
            lastUpdatedAt: DateTime.local()
          }
        }
      };
    },
    { projects }
  );
  return (
    <projectsContext.Provider value={state}>
      <updateProjectContext.Provider value={dispatch}>
        {children}
      </updateProjectContext.Provider>
    </projectsContext.Provider>
  );
};

export const useGlobalState = () => {
  return {
    state: React.useContext(projectsContext),
    updateProject: React.useContext(updateProjectContext)
  };
};
