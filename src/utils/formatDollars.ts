const formatDollars = (amount: any) => {
  if (amount) {
    return amount.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
  }
  return `$${amount}`;
};

export default formatDollars;
