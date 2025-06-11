import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { ApolloQueryResult, NetworkStatus } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  CreateTRBRequestDocumentDocument,
  DeleteTRBRequestDocumentDocument,
  GetTRBRequestDocumentsDocument,
  GetTRBRequestQuery,
  GetTRBRequestQueryVariables,
  TRBRequestState,
  TRBRequestType
} from 'gql/generated/graphql';
import i18next from 'i18next';
import { MATCH_ANY_PARAMETERS, WildcardMockLink } from 'wildcard-mock-link';

import { MessageProvider } from 'hooks/useMessage';

import Documents from './Documents';

const mockEmptyFormFields = {
  component: null,
  needsAssistanceWith: null,
  hasSolutionInMind: null,
  proposedSolution: null,
  whereInProcess: null,
  whereInProcessOther: null,
  hasExpectedStartEndDates: null,
  expectedStartDate: null,
  expectedEndDate: null,
  systemIntakes: [],
  collabGroups: [],
  collabDateSecurity: null,
  collabDateEnterpriseArchitecture: null,
  collabDateCloud: null,
  collabDatePrivacyAdvisor: null,
  collabDateGovernanceReviewBoard: null,
  collabDateOther: null,
  collabGroupOther: null,
  collabGRBConsultRequested: null,
  subjectAreaOptions: null,
  subjectAreaOptionOther: null,
  fundingSources: null,
  submittedAt: '2023-01-31T16:23:06.111436Z'
};

const mockTrbRequestData: GetTRBRequestQuery['trbRequest'] = {
  id: 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7',
  name: 'Draft',
  form: {
    ...mockEmptyFormFields,
    id: '452cf444-69b2-41a9-b8ab-ed354d209307',
    __typename: 'TRBRequestForm'
  },
  type: TRBRequestType.NEED_HELP,
  state: TRBRequestState.OPEN,
  taskStatuses: {} as any,
  feedback: [],
  relatedTRBRequests: [],
  relatedIntakes: [],
  __typename: 'TRBRequest'
};

const mockRefetch = async (
  variables?: Partial<GetTRBRequestQueryVariables> | undefined
): Promise<ApolloQueryResult<GetTRBRequestQuery>> => {
  return {
    loading: false,
    networkStatus: NetworkStatus.ready,
    data: {
      __typename: 'Query',
      trbRequest: mockTrbRequestData
    }
  };
};

const mockGetTrbRequestDocumentsQueryNoDocuments = {
  request: {
    query: GetTRBRequestDocumentsDocument,
    variables: { id: 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7' }
  },
  result: {
    data: {
      trbRequest: {
        id: 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7',
        documents: []
      }
    }
  }
};

const documents = (
  <Documents
    request={{
      id: 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7',
      name: 'Draft',
      form: {
        ...mockEmptyFormFields,
        id: '452cf444-69b2-41a9-b8ab-ed354d209307',
        __typename: 'TRBRequestForm'
      },
      type: TRBRequestType.NEED_HELP,
      state: TRBRequestState.OPEN,
      taskStatuses: {} as any,
      feedback: [],
      relatedTRBRequests: [],
      relatedIntakes: [],
      __typename: 'TRBRequest'
    }}
    stepUrl={{ current: '', next: '', back: '' }}
    refetchRequest={mockRefetch}
    setIsStepSubmitting={() => {}}
    setStepSubmit={() => {}}
    setFormAlert={() => {}}
    taskListUrl=""
  />
);

describe('Trb Request form: Supporting documents', () => {
  const testFile = new File(['1'], 'test.pdf', { type: 'application/pdf' });

  it('renders states without documents', async () => {
    const { getByRole, findByText, asFragment } = render(
      <MemoryRouter
        initialEntries={[
          '/trb/requests/f3b4cff8-321d-4d2a-a9a2-4b05810756d7/documents'
        ]}
      >
        <Route exact path="/trb/requests/:id/:step?/:view?">
          <MockedProvider
            mocks={[
              {
                request: {
                  query: GetTRBRequestDocumentsDocument,
                  variables: { id: 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7' }
                },
                result: {
                  data: {
                    trbRequest: {
                      id: 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7',
                      documents: []
                    }
                  }
                }
              }
            ]}
          >
            <MessageProvider>{documents}</MessageProvider>
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    await findByText(
      i18next.t<string>('technicalAssistance:documents.table.noDocuments')
    );

    expect(asFragment()).toMatchSnapshot();

    // Submit button state without any documents loaded
    getByRole('button', { name: 'Continue without adding documents' });

    getByRole('link', { name: 'Add a document' });
  });

  it('renders states with documents loaded', async () => {
    const { asFragment, findByRole, getByText, getByRole, getAllByText } =
      render(
        <MemoryRouter
          initialEntries={[
            '/trb/requests/f3b4cff8-321d-4d2a-a9a2-4b05810756d7/documents'
          ]}
        >
          <Route exact path="/trb/requests/:id/:step?/:view?">
            <MockedProvider
              mocks={[
                {
                  request: {
                    query: GetTRBRequestDocumentsDocument,
                    variables: { id: 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7' }
                  },
                  result: {
                    data: {
                      trbRequest: {
                        id: 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7',
                        documents: [
                          {
                            id: '21517ecf-a671-46f3-afec-35eebde49630',
                            fileName: 'foo.pdf',
                            documentType: {
                              commonType: 'ARCHITECTURE_DIAGRAM',
                              otherTypeDescription: ''
                            },
                            status: 'UNAVAILABLE',
                            uploadedAt: '2022-12-20T16:25:42.414064Z',
                            url: '' // Links are not used in test
                          },
                          {
                            id: 'd7efd8a7-4ad9-4ed3-80e4-c4b70f3498ae',
                            fileName: 'bar.pdf',
                            documentType: {
                              commonType: 'OTHER',
                              otherTypeDescription: 'test other'
                            },
                            status: 'AVAILABLE',
                            uploadedAt: '2022-12-20T19:04:12.50116Z',
                            url: ''
                          },
                          {
                            id: '940e062a-1f2c-4470-9bc5-d54ea9bd032e',
                            fileName: 'baz.pdf',
                            documentType: {
                              commonType: 'PRESENTATION_SLIDE_DECK',
                              otherTypeDescription: ''
                            },
                            status: 'PENDING',
                            uploadedAt: '2022-12-20T19:04:36.518916Z',
                            url: ''
                          }
                        ]
                      }
                    }
                  }
                }
              ]}
            >
              <MessageProvider>{documents}</MessageProvider>
            </MockedProvider>
          </Route>
        </MemoryRouter>
      );

    // Check some render states
    // Submit button is "Next" when there are documents
    await findByRole('button', { name: /Next/i });

    // Available file
    getByRole('button', { name: 'View' });
    getByRole('button', { name: 'Remove' });

    getByText('Virus scan in progress...'); // Pending
    getByText('Unavailable'); // Infected
    getAllByText('12/20/2022'); // Date formatting
    getByText('test other'); // Other text description

    expect(asFragment()).toMatchSnapshot();
  });

  it('opens and closes the document upload form', async () => {
    const { findByRole, getByRole, getByText } = render(
      <MemoryRouter
        initialEntries={[
          '/trb/requests/f3b4cff8-321d-4d2a-a9a2-4b05810756d7/documents'
        ]}
      >
        <Route exact path="/trb/requests/:id/:step?/:view?">
          <MockedProvider mocks={[mockGetTrbRequestDocumentsQueryNoDocuments]}>
            <MessageProvider>{documents}</MessageProvider>
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    // Add document button can open the upload document form
    userEvent.click(await findByRole('link', { name: /Add a document/i }));

    getByText('Upload a document', { selector: 'h1' });

    // Can close without uploading
    userEvent.click(
      getByRole('link', { name: /Don’t upload and return to previous page/i })
    );

    expect(getByRole('link', { name: /Add a document/i })).toBeInTheDocument();
  });

  it('successfully uploads a doc, starting from the documents table', async () => {
    const {
      getByRole,
      getByTestId,
      getByLabelText,
      findByText,
      findByTestId,
      getByText
    } = render(
      <MemoryRouter
        initialEntries={[
          '/trb/requests/f3b4cff8-321d-4d2a-a9a2-4b05810756d7/documents'
        ]}
      >
        <Route exact path="/trb/requests/:id/:step?/:view?">
          <MockedProvider
            link={
              new WildcardMockLink([
                {
                  request: {
                    query: GetTRBRequestDocumentsDocument,
                    variables: { id: 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7' }
                  },
                  result: {
                    data: {
                      trbRequest: {
                        id: 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7',
                        documents: []
                      }
                    }
                  }
                },
                // Create document
                {
                  request: {
                    query: CreateTRBRequestDocumentDocument,
                    variables: MATCH_ANY_PARAMETERS // File operations don't match traditional `mocks` in MockedProvider, so use this to always match the Create mutation
                  },
                  result: {
                    data: {
                      createTRBRequestDocument: {
                        document: {
                          id: '940e062a-1f2c-4470-9bc5-d54ea9bd032e',
                          documentType: {
                            commonType: 'ARCHITECTURE_DIAGRAM',
                            otherTypeDescription: ''
                          },
                          fileName: 'test.pdf'
                        }
                      }
                    }
                  }
                },
                // Documents list with uploaded file
                {
                  request: {
                    query: GetTRBRequestDocumentsDocument,
                    variables: { id: 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7' }
                  },
                  result: {
                    data: {
                      trbRequest: {
                        id: 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7',
                        documents: [
                          {
                            id: '940e062a-1f2c-4470-9bc5-d54ea9bd032e',
                            fileName: 'test.pdf',
                            documentType: {
                              commonType: 'ARCHITECTURE_DIAGRAM',
                              otherTypeDescription: ''
                            },
                            status: 'PENDING',
                            uploadedAt: '2022-12-20T19:04:36.518916Z',
                            url: ''
                          }
                        ]
                      }
                    }
                  }
                }
              ])
            }
          >
            <MessageProvider>{documents}</MessageProvider>
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    expect(
      await findByText(
        i18next.t<string>('technicalAssistance:documents.table.noDocuments')
      )
    ).toBeInTheDocument();

    // Add document button opens upload document form
    userEvent.click(getByRole('link', { name: /Add a document/i }));

    // Upload doc disabled on empty form
    const uploadButton = getByRole('button', { name: /Upload document/i });
    expect(uploadButton).toBeDisabled();

    const documentUploadLabel = getByLabelText('Document upload');
    userEvent.upload(documentUploadLabel, testFile);

    userEvent.click(getByTestId('documentType-ARCHITECTURE_DIAGRAM'));

    // Attempt submit
    expect(uploadButton).not.toBeDisabled();
    userEvent.click(uploadButton);

    // Successful if file info is displayed
    await findByTestId('table');
    await findByText('test.pdf');
    getByText('Architecture diagram');
    getByText('12/20/2022');
    getByText('Virus scan in progress...');
  });

  it('handles file upload errors', async () => {
    Element.prototype.scrollIntoView = vi.fn();

    const { getByRole, getByTestId, getByLabelText, findByText } = render(
      <MemoryRouter
        initialEntries={[
          '/trb/requests/f3b4cff8-321d-4d2a-a9a2-4b05810756d7/documents/upload'
        ]}
      >
        <Route exact path="/trb/requests/:id/:step?/:view?">
          <MockedProvider
            mocks={[
              mockGetTrbRequestDocumentsQueryNoDocuments,
              // Upload document file with forced network error
              {
                request: {
                  query: CreateTRBRequestDocumentDocument,
                  variables: {
                    input: {
                      requestID: 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7',
                      documentType: 'ARCHITECTURE_DIAGRAM',
                      fileData: testFile
                    }
                  }
                },
                error: new Error()
              }
            ]}
          >
            <MessageProvider>{documents}</MessageProvider>
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    const documentUploadLabel = getByLabelText('Document upload');
    userEvent.upload(documentUploadLabel, testFile);

    userEvent.click(getByTestId('documentType-ARCHITECTURE_DIAGRAM'));

    // Attempt submit
    const uploadButton = getByRole('button', { name: /Upload document/i });
    userEvent.click(uploadButton);

    await findByText(/There was an issue uploading your document/);
  });

  it('deletes a document from the table', async () => {
    const { findByText, findByRole } = render(
      <MemoryRouter
        initialEntries={[
          '/trb/requests/f3b4cff8-321d-4d2a-a9a2-4b05810756d7/documents'
        ]}
      >
        <Route exact path="/trb/requests/:id/:step?/:view?">
          <MockedProvider
            mocks={[
              // Table with available file to delete
              {
                request: {
                  query: GetTRBRequestDocumentsDocument,
                  variables: { id: 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7' }
                },
                result: {
                  data: {
                    trbRequest: {
                      id: 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7',
                      documents: [
                        {
                          id: '940e062a-1f2c-4470-9bc5-d54ea9bd032e',
                          fileName: 'test.pdf',
                          documentType: {
                            commonType: 'ARCHITECTURE_DIAGRAM',
                            otherTypeDescription: ''
                          },
                          status: 'AVAILABLE',
                          uploadedAt: '2022-12-20T19:04:36.518916Z',
                          url: ''
                        }
                      ]
                    }
                  }
                }
              },
              // Delete file
              {
                request: {
                  query: DeleteTRBRequestDocumentDocument,
                  variables: { id: '940e062a-1f2c-4470-9bc5-d54ea9bd032e' }
                },
                result: {
                  data: {
                    deleteTRBRequestDocument: {
                      document: {
                        fileName: 'test.pdf'
                      }
                    }
                  }
                }
              },
              // Refreshed empty doc list
              {
                request: {
                  query: GetTRBRequestDocumentsDocument,
                  variables: { id: 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7' }
                },
                result: {
                  data: {
                    trbRequest: {
                      id: 'f3b4cff8-321d-4d2a-a9a2-4b05810756d7',
                      documents: []
                    }
                  }
                }
              }
            ]}
          >
            <MessageProvider>{documents}</MessageProvider>
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    const fileText = await findByText('test.pdf');

    // ReactModel is throwing warning - App element is not defined. Please use `Modal.setAppElement(el)`.  The app is being set within the modal but RTL is not picking up on it
    // eslint-disable-next-line
    console.error = vi.fn();

    // Opens modal
    userEvent.click(await findByRole('button', { name: /Remove/i }));

    // Removes document from modal
    userEvent.click(await findByRole('button', { name: /Remove document/i }));

    await waitFor(() => {
      findByText('No documents uploaded');
      expect(fileText).toBeInTheDocument();
    });
  });

  it('toggles the optional other document type field', async () => {
    const { getByTestId, findByLabelText } = render(
      <MemoryRouter
        initialEntries={[
          '/trb/requests/f3b4cff8-321d-4d2a-a9a2-4b05810756d7/documents/upload'
        ]}
      >
        <Route exact path="/trb/requests/:id/:step?/:view?">
          <MockedProvider mocks={[mockGetTrbRequestDocumentsQueryNoDocuments]}>
            <MessageProvider>{documents}</MessageProvider>
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    // On
    userEvent.click(getByTestId('documentType-OTHER'));
    const otherLabel = await findByLabelText('What kind of document is this?');
    // Off
    userEvent.click(getByTestId('documentType-ARCHITECTURE_DIAGRAM'));
    await waitFor(() => {
      expect(otherLabel).not.toBeInTheDocument();
    });
  });

  it('handles invalid fields and error messages', async () => {
    Element.prototype.scrollIntoView = vi.fn();

    const { getByRole, getByTestId, getByLabelText, findByText } = render(
      <MemoryRouter
        initialEntries={[
          '/trb/requests/f3b4cff8-321d-4d2a-a9a2-4b05810756d7/documents/upload'
        ]}
      >
        <Route exact path="/trb/requests/:id/:step?/:view?">
          <MockedProvider mocks={[mockGetTrbRequestDocumentsQueryNoDocuments]}>
            <MessageProvider>{documents}</MessageProvider>
          </MockedProvider>
        </Route>
      </MemoryRouter>
    );

    const uploadButton = getByRole('button', { name: /Upload document/i });

    expect(uploadButton).toBeDisabled();

    // Add a document
    const documentUploadLabel = getByLabelText('Document upload');
    userEvent.upload(documentUploadLabel, testFile);

    // Select the "Other" document type so that the form submit button is enabled
    // The file input and the other text field will be left empty to catch errors
    userEvent.click(getByTestId('documentType-OTHER'));

    // Submit attempt
    userEvent.click(uploadButton);

    // Other document input error
    const otherDocError = await findByText('Please fill in the blank');

    // Text field error is still there
    expect(otherDocError).toBeInTheDocument();

    // Fill in text
    userEvent.type(getByLabelText('What kind of document is this?'), 'test');
    // Text error gone
    await waitFor(() => {
      expect(otherDocError).not.toBeInTheDocument();
    });
  });
});
