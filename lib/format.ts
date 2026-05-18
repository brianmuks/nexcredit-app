export function formatZmw(amount: number): string {
  return `K ${amount.toLocaleString('en-ZM', { maximumFractionDigits: 0 })}`;
}

export function formatInterestRate(percent: number): string {
  return `${percent}%`;
}

export function formatTenure(months: number): string {
  if (months === 1) {
    return '1 month';
  }
  return `${months} months`;
}
