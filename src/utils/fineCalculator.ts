export interface FineCalculationResult {
  isLate: boolean;
  lateFee: number;
  isFuture: boolean;
  statusTextEn: string;
  statusTextBn: string;
}

const MONTH_ORDER = [
  'january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'
];

/**
 * Calculates late fee for installment payments.
 * Fines (late fee) ONLY apply to:
 * 1. Overdue past months (prior to current month/year)
 * 2. Current month ONLY IF today is after the 10th of the month.
 * Future upcoming months NEVER receive a fine (lateFee = 0).
 */
export function calculateInstallmentFine(
  sharePercentage: number,
  monthName: string,
  year: number,
  currentDate = new Date()
): FineCalculationResult {
  const cleanMonth = (monthName || '').trim().toLowerCase();
  let targetMonthIndex = MONTH_ORDER.indexOf(cleanMonth);
  if (targetMonthIndex === -1) {
    // If not found in standard english, try matching prefix
    targetMonthIndex = MONTH_ORDER.findIndex(m => m.startsWith(cleanMonth.slice(0, 3)));
  }
  if (targetMonthIndex === -1) {
    targetMonthIndex = currentDate.getMonth();
  }

  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  const baseFeePerShare = 100; // ৳100 per 1% share (e.g. 3% share = ৳300 late fee)
  const share = Number(sharePercentage) || 1;

  // Case 1: Future Year OR Future Month in Current Year
  if (year > currentYear || (year === currentYear && targetMonthIndex > currentMonthIndex)) {
    return {
      isLate: false,
      lateFee: 0,
      isFuture: true,
      statusTextEn: 'Upcoming Installment (No fine applicable: ৳0)',
      statusTextBn: 'ভবিষ্যতের কিস্তি (কোনো জরিমানা নেই: ৳০)'
    };
  }

  // Case 2: Current Month of Current Year
  if (year === currentYear && targetMonthIndex === currentMonthIndex) {
    if (currentDay > 10) {
      const fee = share * baseFeePerShare;
      return {
        isLate: true,
        lateFee: fee,
        isFuture: false,
        statusTextEn: `Late Payment after 10th (Fine: ৳${fee.toLocaleString()})`,
        statusTextBn: `১০ তারিখের পর বিলম্বিত জমা (জরিমানা: ৳${fee.toLocaleString()})`
      };
    } else {
      return {
        isLate: false,
        lateFee: 0,
        isFuture: false,
        statusTextEn: 'Regular Installment before 10th (Fine: ৳0)',
        statusTextBn: '১০ তারিখের পূর্বে নিয়মিত কিস্তি (জরিমানা: ৳০)'
      };
    }
  }

  // Case 3: Past Overdue Month/Year
  const fee = share * baseFeePerShare;
  return {
    isLate: true,
    lateFee: fee,
    isFuture: false,
    statusTextEn: `Past Overdue Installment (Late Fine: ৳${fee.toLocaleString()})`,
    statusTextBn: `পূর্ববর্তী বকেয়া কিস্তি (বিলম্ব ফি: ৳${fee.toLocaleString()})`
  };
}
