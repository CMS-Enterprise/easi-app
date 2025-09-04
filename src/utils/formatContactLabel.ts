import { CedarContactProps } from 'types/systemIntake';

/** Format contact label to include name, EUA, and email */
export default function formatContactLabel(contact: CedarContactProps) {
  const { commonName, euaUserId, email } = contact;
  return `${commonName}${euaUserId && `, ${euaUserId}`}${
    email ? ` (${email})` : ''
  }`;
}
