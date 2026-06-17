// Sanitize data for CSV export by neutralizing spreadsheet formulas.
// https://github.com/react-csv/react-csv/issues/156#issuecomment-517017565
// https://jiraent.cms.gov/browse/EASI-2717
const spreadsheetFormulaPrefix = /^[\t\r\n ]*[=+\-@]/;

const cleanCSVString = (value: string): string => {
  const escapedValue = value.replace(/"/g, '""');

  if (spreadsheetFormulaPrefix.test(value)) {
    return `'${escapedValue}`;
  }

  return escapedValue;
};

const cleanCSVData = (data: any): any => {
  /** safety check because typeof null === 'object' */
  if (data === null) {
    return null;
  }

  /** if the child is an array, recursively sanitize the data */
  if (Array.isArray(data)) {
    return data.map(eachValue => {
      return cleanCSVData(eachValue);
    });
  }

  /** if the child is an object,  recursively clean the values of each key */
  if (typeof data === 'object') {
    return Object.keys(data).reduce((acc: any, eachKey) => {
      acc[eachKey] = cleanCSVData(data[eachKey]);
      return acc;
    }, {});
  }

  /** if it's a boolean or number, no need to sanitize */
  if (typeof data === 'boolean' || typeof data === 'number') {
    return data;
  }

  /**
   * fairly confident this should be typecast as a string by now
   * neutralize cells that spreadsheet apps may interpret as formulas
   */
  return cleanCSVString(data as string);
};

export default cleanCSVData;
