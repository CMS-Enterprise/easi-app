import React from 'react';
import { Link } from 'react-router-dom';
import { Table } from '@trussworks/react-uswds';

import SecondaryNavigation from '../components/SecondaryNavigation';
import useDocumentTitle from '../hooks/DocumentTitle';
import { useGlobalState } from '../state';
import { RequestStep } from '../types';

const ProjectsPage = () => {
  const { state } = useGlobalState();

  useDocumentTitle(`EASi: Active 508 projects`);

  const projects = Object.values(state.projects)
    .filter(project =>
      [
        RequestStep.DocumentsReceived,
        RequestStep.RequestReceived,
        RequestStep.TestScheduled,
        RequestStep.ValidationTestingScheduled
      ].includes(project.status)
    )
    .sort(
      (a, b) => b.submissionDate.toSeconds() - a.submissionDate.toSeconds()
    );

  return (
    <>
      <SecondaryNavigation />
      <main
        id="main-content"
        className="easi-main-content grid-container margin-bottom-5"
      >
        <h1>Requests in Remediation</h1>
        <Table bordered={false} fullWidth>
          <caption className="usa-sr-only">List of active 508 requests</caption>
          <thead>
            <tr>
              <th scope="col" style={{ whiteSpace: 'nowrap' }}>
                Request Name
              </th>
              <th scope="col" style={{ whiteSpace: 'nowrap' }}>
                Business Owner
              </th>
              <th scope="col" style={{ whiteSpace: 'nowrap' }}>
                Remediation Started On
              </th>
              <th scope="col" style={{ whiteSpace: 'nowrap' }}>
                Test Date
              </th>
              <th scope="col" style={{ whiteSpace: 'nowrap' }}>
                Point of Contact
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map(project => {
              return (
                <tr key={project.id}>
                  <th scope="row">
                    <Link to={`/508/v2/requests/${project.id}`}>
                      {project.name}
                    </Link>
                  </th>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {project.businessOwner.name},{' '}
                    {project.businessOwner.component}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {project.remediationStartDate
                      ? project.remediationStartDate.toFormat('LLLL d y')
                      : null}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {project.testDate
                      ? project.testDate.toFormat('LLLL d y')
                      : null}
                  </td>

                  <td>{project.businessOwner.name}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </main>
    </>
  );
};

export default ProjectsPage;
