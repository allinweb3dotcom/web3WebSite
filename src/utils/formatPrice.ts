export const formatPrice = (price: number): string => {
  if (price === 0) return '$0.00';
  
  // Convert scientific notation to decimal string
  const decimalStr = price.toFixed(20);
  
  // Find first non-zero digit after decimal
  const match = decimalStr.match(/^0\.0*[1-9]/);
  if (!match) {
    return price < 0.01 ? '<$0.01' : `$${price.toFixed(2)}`;
  }
  
  // Count leading zeros after decimal point
  const leadingZeros = match[0].length - 2;
  
  // Format based on number of leading zeros
  if (leadingZeros > 6) {
    return `$0.${Array(leadingZeros).join('0')}${price.toFixed(20).slice(leadingZeros + 2, leadingZeros + 4)}`;
  }
  
  return `$${price.toFixed(Math.max(6, leadingZeros + 2))}`;
};

export const formatTokenAmount = (amount: number, decimals: number): string => {
  // Convert to decimal representation
  const value = amount / Math.pow(10, decimals);
  
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
};