import { PaymentAccountConfig } from '../types';

export const INITIAL_PAYMENT_ACCOUNTS: PaymentAccountConfig[] = [
  {
    id: 'pay-bkash-01',
    titleEn: 'bKash Merchant Payment',
    titleBn: 'বিকাশ মার্চেন্ট পেমেন্ট',
    type: 'bkash',
    accountTypeEn: 'Merchant Account (Make Payment)',
    accountTypeBn: 'মার্চেন্ট অ্যাকাউন্ট (পেমেন্ট অপশন)',
    accountNumber: '01712-345678',
    instructionsEn: 'Go to bKash App -> Make Payment -> Enter Merchant Number -> Reference: Member ID (e.g. NXR-001) & Month.',
    instructionsBn: 'বিকাশ অ্যাপে গিয়ে Make Payment নির্বাচন করুন -> মার্চেন্ট নম্বর দিন -> রেফারেন্সে আপনার মেম্বার আইডি (যেমন NXR-001) ও মাস লিখুন।',
    isActive: true
  },
  {
    id: 'pay-nagad-01',
    titleEn: 'Nagad Merchant Payment',
    titleBn: 'নগদ মার্চেন্ট পেমেন্ট',
    type: 'nagad',
    accountTypeEn: 'Merchant Account (Merchant Pay)',
    accountTypeBn: 'মার্চেন্ট অ্যাকাউন্ট (মার্চেন্ট পে)',
    accountNumber: '01798-765432',
    instructionsEn: 'Go to Nagad App -> Merchant Pay -> Enter Number -> Counter: 1 -> Reference: Member ID.',
    instructionsBn: 'নগদ অ্যাপে গিয়ে Merchant Pay নির্বাচন করুন -> নম্বর দিন -> কাউন্টার ১ -> রেফারেন্সে আপনার মেম্বার আইডি দিন।',
    isActive: true
  },
  {
    id: 'pay-bank-01',
    titleEn: 'Islami Bank Bangladesh PLC',
    titleBn: 'ইসলামী ব্যাংক বাংলাদেশ পিএলসি',
    type: 'bank',
    accountTypeEn: 'Corporate Current Account',
    accountTypeBn: 'করপোরেট চলতি হিসাব',
    accountNumber: '2050-1234-5678-9000',
    accountNameEn: 'NEXORA LIMITED',
    accountNameBn: 'নেক্সোরা লিমিটেড',
    bankNameEn: 'Islami Bank Bangladesh PLC',
    bankNameBn: 'ইসলামী ব্যাংক বাংলাদেশ পিএলসি',
    branchEn: 'Zindabazar Branch, Sylhet',
    branchBn: 'জিন্দাবাজার শাখা, সিলেট',
    routingNumber: '125261458',
    instructionsEn: 'Transfer via CellFin, NPSB, BEFTN, RTGS or direct cash deposit slip. Keep slip image or TrxID.',
    instructionsBn: 'সেলফিন, এনপিএসবি, বিইএফটিএন বা সরাসরি ডিপোজিট স্লিপে জমা দিয়ে ট্রানজেকশন আইডি বা স্লিপ কপি সংরক্ষণ করুন।',
    isActive: true
  },
  {
    id: 'pay-rocket-01',
    titleEn: 'DBBL Rocket (Biller ID: 4520)',
    titleBn: 'রকেট মার্চেন্ট / বিল পে',
    type: 'rocket',
    accountTypeEn: 'Corporate Biller ID',
    accountTypeBn: 'করপোরেট বিলার আইডি',
    accountNumber: '01700-112233-8',
    instructionsEn: 'Use Rocket App Bill Pay / Merchant option. Enter Biller ID or Number with Member ID reference.',
    instructionsBn: 'রকেট অ্যাপের বিল পে বা মার্চেন্ট অপশন থেকে পেমেন্ট করুন।',
    isActive: true
  }
];
