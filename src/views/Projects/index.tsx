import React from 'react';
import { withRouter } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';

const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      name
    }
  }
`;

const Projects = () => {
  const { loading, error, data } = useQuery(GET_PROJECTS);

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
