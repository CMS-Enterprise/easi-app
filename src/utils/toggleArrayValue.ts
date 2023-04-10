const toggleArrayValue = (array: any[], value: string) => {
  if (array.includes(value)) {
    return array.filter(item => item !== value);
  }
  return [...array, value];
};

export default toggleArrayValue;
