/**
 * Convert a number to its word representation in Indian English numbering system.
 * Uses lakhs/crores terminology (e.g., "Twenty-five lakhs thirty-two thousand Five hundred rupees").
 * Rounds to whole rupees before conversion.
 *
 * @param num - The number to convert (typically an invoice total)
 * @returns Word representation with "Only" appended (e.g., "Two Thousand Five Hundred Twenty Rupees Only")
 */
export function numberToIndianWords(num: number): string {
  // Round to whole rupees
  const amount = Math.round(num);

  if (amount === 0) {
    return 'Zero Rupees Only';
  }

  if (amount < 0) {
    throw new Error('Cannot convert negative numbers to words');
  }

  const ones = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
  ];

  const teens = [
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];

  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];

  const scales = [
    { name: 'Crore', value: 10000000 },
    { name: 'Lakh', value: 100000 },
    { name: 'Thousand', value: 1000 },
    { name: 'Hundred', value: 100 },
  ];

  function convertBelowHundred(n: number): string {
    if (n === 0) return '';
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];

    const tenDigit = Math.floor(n / 10);
    const oneDigit = n % 10;

    if (oneDigit === 0) return tens[tenDigit];
    return `${tens[tenDigit]} ${ones[oneDigit]}`;
  }

  let result = '';
  let remaining = amount;

  for (const scale of scales) {
    if (remaining >= scale.value) {
      const scaleAmount = Math.floor(remaining / scale.value);
      remaining = remaining % scale.value;

      const scalePart = convertBelowHundred(scaleAmount);
      if (scalePart) {
        result += `${scalePart} ${scale.name} `;
      }
    }
  }

  // Handle remaining amount (below 100)
  const belowHundred = convertBelowHundred(remaining);
  if (belowHundred) {
    result += belowHundred + ' ';
  }

  return result.trim() + ' Rupees Only';
}
