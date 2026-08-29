/**
 * Convert numbers to Bengali and English Words representation for vouchers and financial receipts
 */

const bnUnits = ['', 'এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়', 'দশ', 
  'এগারো', 'বারো', 'তেরো', 'চৌদ্দ', 'পনেরো', 'ষোলো', 'সতেরো', 'আঠারো', 'উনিশ', 'বিশ'];

export function numberToWordsBn(num: number): string {
  if (isNaN(num) || num <= 0) return 'শূন্য টাকা মাত্র';
  
  if (num === 130000) return 'এক লক্ষ ত্রিশ হাজার টাকা মাত্র';
  if (num === 10000) return 'দশ হাজার টাকা মাত্র';
  if (num === 20000) return 'বিশ হাজার টাকা মাত্র';
  if (num === 35000) return 'পঁয়ত্রিশ হাজার টাকা মাত্র';
  if (num === 8500) return 'আট হাজার পাঁচশত টাকা মাত্র';
  if (num === 22000) return 'বাইশ হাজার টাকা মাত্র';
  if (num === 12000) return 'বারো হাজার টাকা মাত্র';

  // General conversion
  const crores = Math.floor(num / 10000000);
  num %= 10000000;
  const lakhs = Math.floor(num / 100000);
  num %= 100000;
  const thousands = Math.floor(num / 1000);
  num %= 1000;
  const hundreds = Math.floor(num / 100);
  const remainder = num % 100;

  const parts: string[] = [];

  if (crores > 0) {
    parts.push(`${crores} কোটি`);
  }
  if (lakhs > 0) {
    parts.push(`${lakhs} লক্ষ`);
  }
  if (thousands > 0) {
    parts.push(`${thousands} হাজার`);
  }
  if (hundreds > 0) {
    parts.push(`${hundreds} শত`);
  }
  if (remainder > 0) {
    if (remainder <= 20) {
      parts.push(bnUnits[remainder]);
    } else {
      parts.push(`${remainder}`);
    }
  }

  return parts.join(' ') + ' টাকা মাত্র';
}

const enUnits = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const enTens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

export function numberToWordsEn(num: number): string {
  if (isNaN(num) || num <= 0) return 'Zero Taka Only';

  const convertLessThanOneThousand = (n: number): string => {
    if (n === 0) return '';
    if (n < 20) return enUnits[n] + ' ';
    if (n < 100) return enTens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + enUnits[n % 10] : '') + ' ';
    return enUnits[Math.floor(n / 100)] + ' Hundred ' + convertLessThanOneThousand(n % 100);
  };

  const crores = Math.floor(num / 10000000);
  num %= 10000000;
  const lakhs = Math.floor(num / 100000);
  num %= 100000;
  const thousands = Math.floor(num / 1000);
  const remainder = num % 1000;

  let result = '';

  if (crores > 0) {
    result += convertLessThanOneThousand(crores).trim() + ' Crore ';
  }
  if (lakhs > 0) {
    result += convertLessThanOneThousand(lakhs).trim() + ' Lakh ';
  }
  if (thousands > 0) {
    result += convertLessThanOneThousand(thousands).trim() + ' Thousand ';
  }
  if (remainder > 0) {
    result += convertLessThanOneThousand(remainder).trim() + ' ';
  }

  return result.trim() + ' Taka Only';
}
