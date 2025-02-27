const tableAndPagination = {
  header: {
    mostRecentMeetingDate: 'Most recent meeting date',
    process: 'Process',
    requestName: 'Request name',
    requester: 'Requester',
    status: 'Status',
    submissionDate: 'Submission date',
    upcomingMeetingDate: 'Upcoming meeting date',
    lastMeetingDate: 'Most recent meeting date'
  },
  defaultVal: {
    draft: 'Draft',
    notSubmitted: 'Not submitted',
    none: 'None'
  },
  openClosedRequestsTabs: {
    label: 'Request Repository Table Navigation',
    open: 'Open requests',
    closed: 'Closed requests'
  },
  status: {
    requestState: {
      CLOSED: 'Closed'
    },
    requestStatus: {
      NEW: 'New',
      DRAFT_REQUEST_FORM: 'Draft request form',
      REQUEST_FORM_COMPLETE: 'Request form complete',
      READY_FOR_CONSULT: 'Ready for consult',
      CONSULT_SCHEDULED: 'Consult scheduled',
      CONSULT_COMPLETE: 'Consult complete',
      DRAFT_GUIDANCE_LETTER: 'Draft guidance letter',
      GUIDANCE_LETTER_IN_REVIEW: 'Guidance letter in review',
      GUIDANCE_LETTER_SENT: 'Guidance letter sent',
      FOLLOW_UP_REQUESTED: 'Follow-up requested'
    }
  },
  state: {
    noRequests: {
      open: 'There are currently no open requests that are in progress.',
      closed:
        'There are currently no closed requests. Continue to work on open requests. When they are closed, they will appear here.'
    }
  },
  pagination: {
    previous: 'Previous',
    next: 'Next'
  },
  results: {
    noResults: 'No results found ',
    results:
      'Showing <1>{{currentPage}}</1>-<1>{{pageRange}}</1> of <1>{{rows}}</1> results ',
    searchInput: ' for'
  },
  pageSize: {
    show: 'Show {{value}}'
  }
};

export default tableAndPagination;
