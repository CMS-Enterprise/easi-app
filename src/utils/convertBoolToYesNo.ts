const convertBoolToYesNo = (bool: boolean | null) => {
  switch (bool) {
    case true:
      return 'Yes';
    case false:
      return 'No';
    case null:
      return 'N/A';
    default:
      console.log('Unknown bool type');
      return '';
  }
};

export default convertBoolToYesNo;
