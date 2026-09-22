export default function powerPlatformLink(id?: string): string {
  let env: string = process.env.APP_ENV || '';
  if (import.meta?.env?.APP_ENV?.length > 0) {
    env = import.meta.env.APP_ENV;
  }

  if (env.length < 1) {
    return '';
  }

  const idSuffix = id ? `&id=${id}` : '';

  switch (env) {
    case 'prod':
      return `https://itgovernance.crm9.dynamics.com/main.aspx?appid=941458af-d8eb-f011-8544-001dd80f20e8${idSuffix}`;
    case 'impl':
      return `https://itgovernanceuat.crm9.dynamics.com/main.aspx?appid=e990c535-50eb-f011-8544-001dd83058c9${idSuffix}`;

    // send local and dev to same spot
    case 'local':
    case 'dev':
      return `https://itgovernancedev.crm9.dynamics.com/main.aspx?appid=110e68fa-41bf-4a23-a577-e58b353d60c7${idSuffix}`;
    default:
      return '';
  }
}
