const formatDollars = (amount: number | undefined): string => {
  if (amount) {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    });
  }
  return '$0';
};

export default formatDollars;
