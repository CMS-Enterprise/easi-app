/**
 * Returns true if string is NOT a CMS email address
 */
const isExternalEmail = (email: string | undefined) => {
  if (!email) return true;
  return !email.includes('@cms.hhs.gov');
};

export default isExternalEmail;
