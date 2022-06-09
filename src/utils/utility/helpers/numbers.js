// Formats argument with dollar sign, two decimals and commas
export function currencyFormatter(num, minimumFractionDigits = 2) {
  if (num !== 0 && !num) return ''; // for numbers !0 returns false otherwise true

  num = num.toString();
  if (num.indexOf('$') !== -1) {
    num = num.split('$')[1];
  }

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits,
  });

  return formatter.format(num);
}

// Formats argument with dollar sign, two decimals and commas
export function numberFormatter(num, minimumFractionDigits = 2) {
  if (!num || num !== Number(num)) return ''; // accept only numbers

  num = num.toString();

  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
  });

  return formatter.format(num);
}

