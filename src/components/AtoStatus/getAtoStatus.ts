import { ATO_STATUS_DUE_SOON_DAYS } from 'constants/systemProfile';
import { AtoStatus } from 'types/systemProfile';
import { parseAsUTC } from 'utils/date';

/**
 * Get the ATO Status from a date property
 */
const getAtoStatus = (
  atoExpirationDate: string | null | undefined,
  oaStatus: string | null | undefined
): AtoStatus => {
  // override anything else if this system is an OA Member
  if (oaStatus === 'OA Member') {
    return 'Active';
  }

  // No ato if it doesn't exist or invalid empty string
  if (typeof atoExpirationDate !== 'string' || atoExpirationDate === '')
    return 'No ATO';

  const expiry = parseAsUTC(atoExpirationDate).toString();

  const date = new Date().toISOString();

  if (date >= expiry) return 'Expired';

  const soon = parseAsUTC(expiry)
    .minus({ days: ATO_STATUS_DUE_SOON_DAYS })
    .toString();

  if (date >= soon) return 'Due Soon';

  return 'Active';
};

export default getAtoStatus;
