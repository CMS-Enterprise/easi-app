import React from 'react';
import { withRouter } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import GetProjectsQuery from 'queries/GetProjectsQuery';
import { GetProjects } from 'queries/types/GetProjects';

const Projects = () => {
  const { loading, error, data } = useQuery<GetProjects>(GetProjectsQuery);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <ul>
      {data.projects.map(project => {
        return <li>{project.name}</li>;
      })}
    </ul>
  );
};
export default withRouter(Projects);
