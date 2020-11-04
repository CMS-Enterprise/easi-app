import React from 'react';
import { withRouter } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import getProjects from 'queries/getProjects';
import { GetProjects } from 'queries/types/GetProjects';

const Projects = () => {
  const { loading, error, data } = useQuery<GetProjects>(getProjects);

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
