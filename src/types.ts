export type Language = 'bn' | 'en';
export type Role = 'admin' | 'member' | 'public';

export interface Member {
  id: string;
  name: string;
  nameBn: string;
  share: number; // Percentage / share units (e.g., 10 = 10%)
  designationEn: string;
  designationBn: string;
  committeeGroup: 'management' | 'advisor';
  locationEn: string;
  locationBn: string;
  phone: string;
  email: string;
  addressEn: string;
  addressBn: string;
  joinedDate: string;
  avatarUrl?: string;
  nid?: string;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface Installment {
  id: string;
  receiptNo: string;
  memberId: string;
  memberName: string;
  memberNameBn: string;
  month: string;
  year: number;
  amount: number;
  lateFee: number;
  method: string;
  accountNo?: string;
  trxId: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
  isDeleted?: boolean;
  deletedAt?: string;
  deletedBy?: string;
}

export interface LedgerTransaction {
  id: string;
  voucherNo: string;
  type: 'credit' | 'debit'; // credit = আয়/জমা, debit = ব্যয়/খরচ
  title: string;
  titleBn?: string;
  category: string;
  categoryBn?: string;
  amount: number;
  date: string;
  method: string;
  accountNo?: string;
  notes?: string;
  recordedBy: string;
  refReceiptNo?: string;
  isDeleted?: boolean;
  createdAt?: string;
}

export interface PaymentAccountConfig {
  id: string;
  titleEn: string;
  titleBn: string;
  type: 'bkash' | 'nagad' | 'bank' | 'rocket' | 'upay' | 'cash' | 'other';
  accountTypeEn: string; // Merchant / Personal / Corporate
  accountTypeBn: string;
  accountNumber: string;
  accountNameEn?: string;
  accountNameBn?: string;
  bankNameEn?: string;
  bankNameBn?: string;
  branchEn?: string;
  branchBn?: string;
  routingNumber?: string;
  instructionsEn?: string;
  instructionsBn?: string;
  isActive: boolean;
}

export interface Project {
  id: string;
  titleEn: string;
  titleBn: string;
  categoryEn: string;
  categoryBn: string;
  locationEn: string;
  locationBn: string;
  targetBudget: number;
  raisedBudget: number;
  status: 'planning' | 'ongoing' | 'completed';
  expectedReturnEn: string;
  expectedReturnBn: string;
  descriptionEn: string;
  descriptionBn: string;
  shariahModelEn: string;
  shariahModelBn: string;
  startDate: string;
  image: string;
}

export interface Notice {
  id: string;
  titleEn: string;
  titleBn: string;
  date: string;
  category: 'general' | 'agm' | 'installment' | 'dividend';
  contentEn: string;
  contentBn: string;
  important?: boolean;
  readBy?: string[];
  dismissedBy?: string[];
}

export interface CompanyPost {
  id: string;
  titleEn: string;
  titleBn: string;
  summaryEn: string;
  summaryBn: string;
  contentEn: string;
  contentBn: string;
  categoryEn: string;
  categoryBn: string;
  date: string;
  authorEn: string;
  authorBn: string;
  image: string;
  readTimeEn: string;
  readTimeBn: string;
  tagsEn: string[];
  tagsBn: string[];
}

export interface ExpenseRecord {
  id: string;
  category: string;
  title: string;
  amount: number;
  date: string;
  approvedBy: string;
}

