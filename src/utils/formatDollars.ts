const formatDollars = (amount: any) => {
  if (amount) {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    });
  }
  return `$${amount}`;
};

export default formatDollars;
