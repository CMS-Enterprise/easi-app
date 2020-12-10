const convertBoolToYesNo = (bool: boolean | null) => {
  switch (bool) {
    case true:
      return 'Yes';
    case false:
      return 'No';
    case null:
      return 'N/A';
    default:
      return '';
  }
};

export default convertBoolToYesNo;
