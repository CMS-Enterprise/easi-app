import { GetTrbAdminTeamHome_trbRequests as TrbRequests } from 'queries/types/GetTrbAdminTeamHome';

import { getTrbRequestDataAsCsv, trbRequestsCsvHeader } from './TeamHome';

describe('Trb Admin Team Home', () => {
  const trbRequests = [] as TrbRequests[];

  it('parses csv data from trb request data', () => {
    const csv = getTrbRequestDataAsCsv(trbRequests);
    expect(csv).toEqual([trbRequestsCsvHeader]);
  });
});
