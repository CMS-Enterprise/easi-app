const formatDollars = (amount: any) => {
  if (amount || amount === 0) {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    });
  }
  return '-';
};

export default formatDollars;
