import React, { useState } from 'react';
import { Language, Role, Member } from '../types';
import { 
  FileText, ShieldCheck, Scale, CheckCircle2, 
  Users, Building2, Landmark, AlertTriangle, 
  Printer, Search, ChevronDown, ChevronUp, 
  Clock, DollarSign, BookOpen, Check, Award,
  Sparkles, Download, ArrowRight, Calculator,
  Gavel, Share2, Compass, ShieldAlert, BadgeCheck
} from 'lucide-react';

interface Props {
  lang: Language;
  role?: Role;
  currentUser?: Member | any;
  onNavigateToDeposit?: () => void;
}

export const ConstitutionView: React.FC<Props> = ({
  lang,
  role = 'public',
  currentUser,
  onNavigateToDeposit
}) => {
  const [activeSection, setActiveSection] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedClauses, setExpandedClauses] = useState<Record<string, boolean>>({
    'sec-1': true,
    'sec-2': true,
    'sec-3': true,
    'sec-4': true,
    'sec-5': true,
    'sec-6': true,
    'sec-7': true,
    'sec-8': true,
    'sec-9': true,
  });

  // Late Fee Calculator state
  const [calcShare, setCalcShare] = useState<number>(currentUser?.share || 10);
  const [isLate, setIsLate] = useState<boolean>(false);

  const toggleClause = (id: string) => {
    setExpandedClauses(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    for (let i = 1; i <= 9; i++) {
      allExpanded[`sec-${i}`] = true;
    }
    setExpandedClauses(allExpanded);
  };

  const collapseAll = () => {
    setExpandedClauses({});
  };

  const handlePrint = () => {
    window.print();
  };

  const sectionsData = [
    {
      id: 'sec-1',
      numberBn: '১',
      numberEn: '1',
      titleBn: 'কোম্পানির নাম, কার্যালয় ও গঠনগত পটভূমি',
      titleEn: 'Company Name, Office & Formation Background',
      icon: Building2,
      clauses: [
        {
          code: '১.১',
          codeEn: '1.1',
          headingBn: 'প্রতিষ্ঠার প্রস্তাব ও প্রাথমিক রূপরেখা',
          headingEn: 'Initial Proposal & Founding Framework',
          textBn: 'অত্র কোম্পানি গঠনের প্রাথমিক প্রস্তাব ও আলোচনা ২০ আগস্ট ২০২৬ তারিখে গৃহীত হয়। সকল প্রতিষ্ঠাতা অংশীদার পারস্পরিক বিশ্বাস ও দীর্ঘমেয়াদী টেকসই অর্থনৈতিক সমৃদ্ধির ভিত্তিতে যৌথ ব্যবসায়িক উদ্যোগে একমত পোষণ করেন।',
          textEn: 'The initial proposal and founding discussion for establishing the company was adopted on August 20, 2026, establishing a shared vision for long-term halal joint investments.'
        },
        {
          code: '১.২',
          codeEn: '1.2',
          headingBn: 'কোম্পানি গঠন ও কার্যনির্বাহী কমিটি চূড়ান্তকরণ',
          headingEn: 'Formal Inception & Executive Board Finalization',
          textBn: 'সকল অংশীদারের স্বতঃস্ফূর্ত উপস্থিতি ও সর্বসম্মত সম্মতিতে ২২ আগস্ট ২০২৬ তারিখে আনুষ্ঠানিকভাবে "Nexora Limited"-এর গঠন ও কার্যনির্বাহী কমিটি চূড়ান্ত করা হয়।',
          textEn: 'With the spontaneous presence and unanimous consent of all founding partners, the establishment of "Nexora Limited" and its executive governing committee was officially finalized on August 22, 2026.'
        },
        {
          code: '১.৩',
          codeEn: '1.3',
          headingBn: 'প্রাতিষ্ঠানিক কার্যক্রম শুরুর সময়সীমা',
          headingEn: 'Official Operations Commencement Date',
          textBn: '১ সেপ্টেম্বর ২০২৬ তারিখ থেকে কোম্পানির পূর্ণাঙ্গ ব্যবসায়িক, দাপ্তরিক ও মূলধন সংগ্রহের কার্যক্রম আনুষ্ঠানিকভাবে শুরু হবে।',
          textEn: 'Official commercial, administrative, and capital operations of the company will formally commence on September 1, 2026.'
        },
        {
          code: '১.৪',
          codeEn: '1.4',
          headingBn: 'প্রাতিষ্ঠানিক অফিশিয়াল নাম',
          headingEn: 'Official Corporate Name',
          textBn: 'প্রতিষ্ঠানের অফিশিয়াল নাম হবে "Nexora Limited" (নেক্সোরা লিমিটেড)। সমস্ত ব্যাংকিং, আইনি ও করপোরেট নথিপত্রে এই নাম ব্যবহৃত হবে।',
          textEn: 'The official corporate name of the enterprise shall be "Nexora Limited". This registered name shall be utilized across all banking, legal, and operational documents.'
        },
        {
          code: '১.৫',
          codeEn: '1.5',
          headingBn: 'প্রধান কার্যালয় ও দাপ্তরিক অবস্থান',
          headingEn: 'Registered Head Office Location',
          textBn: 'কোম্পানির যাবতীয় দাপ্তরিক ও ব্যবসায়িক কার্যক্রম নির্দিষ্ট প্রধান কার্যালয় বা নিবন্ধিত স্থান থেকে সুশৃঙ্খলভাবে পরিচালিত হবে।',
          textEn: 'All executive, official, and statutory operations of the company shall be systematically administered from its registered principal corporate office.'
        }
      ]
    },
    {
      id: 'sec-2',
      numberBn: '২',
      numberEn: '2',
      titleBn: 'মূলনীতি, ব্যবসায়িক দর্শন ও শরীয়াহ্ পরিপালন',
      titleEn: 'Core Principles, Business Philosophy & Shariah Compliance',
      icon: ShieldCheck,
      clauses: [
        {
          code: '২.১',
          codeEn: '2.1',
          headingBn: 'হালাল ও শরীয়াহভিত্তিক পরিচালনা',
          headingEn: '100% Halal & Shariah-Compliant Operations',
          textBn: 'কোম্পানির সকল ব্যবসায়িক উদ্যোগ, বিনিয়োগ ও আর্থিক লেনদেন সম্পূর্ণ হালাল, স্বচ্ছ এবং ইসলামী শরীয়াহর নীতিমালা (মুদারাবা ও মুশারাকা) অনুযায়ী পরিচালিত হবে। কোনো প্রকার অনৈতিক বা অস্পষ্ট লেনদেন কঠোরভাবে নিষিদ্ধ।',
          textEn: 'All business ventures, investments, and treasury transactions of the company must strictly adhere to transparent, 100% halal Islamic Shariah governance models (Mudarabah & Musharakah).'
        },
        {
          code: '২.২',
          codeEn: '2.2',
          headingBn: 'সুদমুক্ত লেনদেন ও সুদী ব্যাংক ঋণ গ্রহণ সম্পূর্ণ নিষেধাজ্ঞা',
          headingEn: 'Zero Riba / Absolute Ban on Conventional Interest Loans',
          textBn: 'সর্বাবস্থায় প্রতিষ্ঠানের সকল কার্যক্রম সম্পূর্ণ সুদমুক্ত থাকবে। ব্যবসা পরিচালনা বা মূলধন বৃদ্ধির উদ্দেশ্যে কোনো প্রকার সুদী ব্যাংক ঋণ বা আর্থিক দায় গ্রহণ করা সম্পূর্ণ নিষিদ্ধ।',
          textEn: 'Under all circumstances, the company must maintain a zero-interest (riba-free) framework. Taking interest-bearing bank loans or conventional liabilities for business expansion is strictly prohibited.'
        },
        {
          code: '২.৩',
          codeEn: '2.3',
          headingBn: 'দাপ্তরিক সরঞ্জাম, প্যাড, রসিদ বই ও সিলমোহর',
          headingEn: 'Official Corporate Stationery, Pads & Authorized Seals',
          textBn: 'প্রতিষ্ঠানের নামে নিজস্ব অফিশিয়াল প্যাড, রসিদ বই এবং সিলমোহর থাকবে। প্রতিটি আর্থিক লেনদেন লিখিত রসিদের মাধ্যমে নিশ্চিত করতে হবে।',
          textEn: 'The company shall maintain official serialized receipt vouchers, corporate stationery, and authorized corporate seals. Every single transaction must be certified with an official printed or digital receipt.'
        }
      ]
    },
    {
      id: 'sec-3',
      numberBn: '৩',
      numberEn: '3',
      titleBn: 'মূলধন কাঠামো, শেয়ার বণ্টন ও সীমা সংক্রান্ত নীতিমালা',
      titleEn: 'Capital Structure, Share Allocation & Limits',
      icon: Scale,
      clauses: [
        {
          code: '৩.১',
          codeEn: '3.1',
          headingBn: 'মোট মূলধন ও ১০০% শেয়ার কাঠামো',
          headingEn: 'Authorized Capital & 100% Total Equity Pool',
          textBn: 'কোম্পানির মোট শেয়ার ১০০% হিসেবে নির্ধারিত থাকবে। প্রতিটি অংশীদারের ইকুইটি এই মোট ১০০%-এর সাপেক্ষে নির্ধারিত হবে।',
          textEn: 'The authorized equity base of the company is fixed at exactly 100% total shares.'
        },
        {
          code: '৩.২',
          codeEn: '3.2',
          headingBn: 'বর্তমান বিক্রিত শেয়ার (৭৩%) ও ১৩ জন প্রতিষ্ঠাতা অংশীদার',
          headingEn: 'Current Subscribed Equity (73%) across 13 Founders',
          textBn: 'প্রতিষ্ঠাকালীন সময়ে সর্বমোট বিক্রিত শেয়ার ৭৩% (১৩ জন প্রতিষ্ঠাতা অংশীদার কর্তৃক গৃহীত)।',
          textEn: 'At the time of inception, exactly 73% equity has been formally subscribed and held by the 13 founding partners.'
        },
        {
          code: '৩.৩',
          codeEn: '3.3',
          headingBn: 'অবিক্রিত শেয়ার (২৭%) ব্যবস্থাপনা নীতিমালা',
          headingEn: 'Unallocated Treasury Shares (27%) Management Policy',
          textBn: 'অবিক্রিত ২৭% শেয়ার পরিচালনা পরিষদের সর্বসম্মত সিদ্ধান্ত অনুযায়ী ভবিষ্যতে নতুন যোগ্য বিনিয়োগকারী অন্তর্ভুক্তিকরণ অথবা বিদ্যমান অংশীদারদের মধ্যে আনুপাতিক হারে বরাদ্দ/বিক্রয় করা যাবে।',
          textEn: 'The remaining 27% unallocated treasury shares may be issued to new qualified investors or offered to existing partners strictly upon board resolution.'
        },
        {
          code: '৩.৪',
          codeEn: '3.4',
          headingBn: 'শেয়ারের মাসিক মূল্য ও জমার হার (প্রতি ১% = ১,০০০/- টাকা)',
          headingEn: 'Share Valuation & Monthly Installment Rate (1% = 1,000 BDT)',
          textBn: 'প্রতিটি ১% শেয়ারের নির্ধারিত মাসিক মূল্য ১,০০০/- (এক হাজার) টাকা। প্রত্যেক অংশীদার তার গৃহীত শেয়ারের আনুপাতিক হারে প্রতি মাসে এই অর্থ নিয়মিত জমা প্রদান করবেন (যেমন: ১০% শেয়ারের জন্য ১০,০০০/- টাকা, ৫% শেয়ারের জন্য ৫,০০০/- টাকা, ৩% শেয়ারের জন্য ৩,০০০/- টাকা)।',
          textEn: 'Each 1% equity unit corresponds to a mandatory monthly installment of 1,000 BDT (e.g. 10% = 10,000 BDT/month, 5% = 5,000 BDT/month, 3% = 3,000 BDT/month).'
        },
        {
          code: '৩.৫',
          codeEn: '3.5',
          headingBn: 'একক ব্যক্তির জন্য সর্বোচ্চ শেয়ার ধারণের সীমা (১০%)',
          headingEn: 'Maximum Individual Shareholding Ceiling (10%)',
          textBn: 'কোম্পানিতে ক্ষমতার ভারসাম্য ও অংশীদারিত্বের সমতা রক্ষার্থে কোনো একজন অংশীদার ব্যক্তিগতভাবে সর্বোচ্চ ১০% শেয়ার ধারণ করতে পারবেন। কোনো অবস্থাতেই একক ব্যক্তির শেয়ার ১০%-এর অধিক হতে পারবে না।',
          textEn: 'To prevent concentrated ownership and preserve decentralized governance, no single partner may personally hold more than 10% equity under any circumstance.'
        },
        {
          code: '৩.৬',
          codeEn: '3.6',
          headingBn: 'শেয়ার বৃদ্ধির সুযোগ ও অগ্রাধিকার',
          headingEn: 'Equity Enhancement Opportunity for Existing Members',
          textBn: 'বর্তমানে যাদের শেয়ার ১০%-এর কম রয়েছে, তারা চাইলে ভবিষ্যতে অবিক্রিত শেয়ারের প্রাপ্যতা সাপেক্ষে নিজেদের শেয়ার সর্বোচ্চ ১০% পর্যন্ত উন্নীত করতে পারবেন।',
          textEn: 'Founding partners currently holding less than 10% equity hold the first right of refusal to scale their equity up to the 10% ceiling from available treasury shares.'
        },
        {
          code: '৩.৭',
          codeEn: '3.7',
          headingBn: '৬ মাস পর পর্যালোচনা ও অতিরিক্ত ২% পর্যন্ত শেয়ার বরাদ্দের বিশেষ সুযোগ',
          headingEn: '6-Month Review & Special 2% Equity Increment Provision',
          textBn: 'কোম্পানি কার্যক্রম শুরুর ৬ (ছয়) মাস পর সকল অংশীদারের শেয়ার ধারণ এবং সামগ্রিক ব্যবসায়িক অগ্রগতি পর্যালোচনা করা হবে। পর্যালোচনায় যদি দেখা যায় যে সকল অংশীদারের ন্যূনতম শেয়ার ৫% বা তদূর্ধ্ব রয়েছে, তবে সর্বসম্মত সিদ্ধান্ত অনুযায়ী প্রত্যেক অংশীদারকে অতিরিক্ত ২% পর্যন্ত শেয়ার বৃদ্ধির বিশেষ সুযোগ প্রদান করা যাবে (যা মোট ১০০% এবং অবশিষ্ট অবিক্রিত শেয়ারের প্রাপ্যতার সাথে সমন্বিত হবে)।',
          textEn: 'After 6 months of active operations, the board will conduct an equity review. If all partners maintain at least 5% equity, each partner may be granted an option to expand their stake by up to an additional 2% from available unallocated equity.'
        }
      ]
    },
    {
      id: 'sec-4',
      numberBn: '৪',
      numberEn: '4',
      titleBn: 'তহবিল জমা, বিলম্ব ফি (জরিমানা) ও নিয়মানুবর্তিতা',
      titleEn: 'Fund Deposit, Late Fee (Fine) Policy & Discipline',
      icon: DollarSign,
      clauses: [
        {
          code: '৪.১',
          codeEn: '4.1',
          headingBn: 'ব্যাংক হিসাবে জমা ও সময়সীমা (প্রতি মাসের ১ থেকে ১০ তারিখ)',
          headingEn: 'Mandatory Banking Deposit Window (1st to 10th of Every Month)',
          textBn: 'প্রতি মাসের ০১ (এক) থেকে ১০ (দশ) তারিখের মধ্যে মাসিক জমার কিস্তির টাকা কোম্পানির অফিশিয়াল ব্যাংকিং হিসাবে বাধ্যতামূলকভাবে পরিশোধ করতে হবে।',
          textEn: 'All shareholders must deposit their monthly installments into the official corporate bank account strictly between the 1st and 10th calendar day of each month.'
        },
        {
          code: '৪.২',
          codeEn: '4.2',
          headingBn: 'রসিদ ও ডিজিটাল গ্রুপে জমা নিশ্চিতকরণ',
          headingEn: 'Receipt Preservation & Instant WhatsApp Group Verification',
          textBn: 'টাকা জমা দেওয়ার পর ব্যাংক ট্রানজেকশন স্লিপ/রসিদ সংরক্ষণ করতে হবে এবং তাৎক্ষণিকভাবে কোম্পানির অফিশিয়াল WhatsApp Group-এ শেয়ার করে জমা নিশ্চিত করতে হবে।',
          textEn: 'Upon deposit, shareholders must preserve bank transaction slips and immediately transmit the voucher to the official corporate WhatsApp group for administrative verification.'
        },
        {
          code: '৪.৩',
          codeEn: '4.3',
          headingBn: 'বিলম্ব ফি / জরিমানা নীতি (প্রতি ১% শেয়ারের জন্য ১০০/- টাকা)',
          headingEn: 'Mandatory Late Fine Policy (100 BDT per 1% Share)',
          textBn: 'নির্ধারিত সময়ের (১০ তারিখ) মধ্যে মাসিক কিস্তি প্রদানে ব্যর্থ হলে বিলম্ব ফি বা জরিমানা বাধ্যতামূলকভাবে আরোপ করা হবে। জরিমানার পরিমাণ প্রতি ১% শেয়ারের জন্য ১০০/- (একশত) টাকা নির্ধারণ করা হলো (যেমন: ১০% শেয়ারের জন্য ১,০০০/- টাকা জরিমানা, ৫% শেয়ারের জন্য ৫০০/- টাকা, ৩% শেয়ারের জন্য ৩০০/- টাকা)।',
          textEn: 'If a shareholder fails to deposit by the 10th of the month, a mandatory late fee is levied at exactly 100 BDT per 1% share (e.g., 10% share = 1,000 BDT late fee, 5% share = 500 BDT, 3% share = 300 BDT).'
        },
        {
          code: '৪.৪',
          codeEn: '4.4',
          headingBn: 'জরিমানা মওকুফ কঠোর নিষেধাজ্ঞা ও পরিচালনা পরিষদের জবাবদিহিতা',
          headingEn: 'Absolute Ban on Fine Waivers & Director Accountability',
          textBn: 'কোনো অবস্থাতেই কিংবা ব্যক্তিগত সহমর্মিতার খাতিরে বিলম্ব ফি/জরিমানা মওকুফ করা যাবে না। পরিচালনা কমিটির কোনো সদস্য নিয়মবহির্ভূতভাবে জরিমানা মওকুফ বা শিথিল করলে তা সুস্পষ্ট শৃঙ্খলাভঙ্গ হিসেবে গণ্য হবে এবং উক্ত পরিচালকের পদ বাতিলের বিষয়টি পরিচালনা পরিষদে বিবেচনা ও সিদ্ধান্ত গৃহীত হবে।',
          textEn: 'Late fees cannot be waived under any circumstance or personal sympathy. Any director or committee member unlawfully granting a waiver commits a severe breach of discipline, subjecting their office to immediate board revocation.'
        },
        {
          code: '৪.৫',
          codeEn: '4.5',
          headingBn: 'ধারাবাহিক খেলাপি ও সদস্যপদ স্বয়ংক্রিয় বাতিল নীতি',
          headingEn: 'Default Policy & Automatic Membership Termination',
          textBn: 'পরপর অথবা সর্বমোট ৩ (তিন) মাস মাসিক কিস্তি প্রদানে ব্যর্থ হলে সংশ্লিষ্ট অংশীদারের সদস্যপদ স্বয়ংক্রিয়ভাবে বাতিল বলে গণ্য হবে।',
          textEn: 'Failing to pay monthly installments for 3 consecutive or cumulative months triggers automatic forfeiture and cancellation of shareholder membership.'
        },
        {
          code: '৪.৬',
          codeEn: '4.6',
          headingBn: 'বাতিলকৃত সদস্যের মূলধন ফেরত নীতি',
          headingEn: 'Capital Refund Policy for Defaulted / Revoked Members',
          textBn: 'কিস্তি খেলাপির কারণে সদস্যপদ বাতিল হলে, কোম্পানি চলমান থাকা অবস্থায় তার জমাকৃত মূল টাকা (কোনো প্রকার লভ্যাংশ বা মুনাফা ব্যতীত) কোম্পানির পরিচালনা পরিষদের নির্ধারিত নিয়ম ও সুবিধা অনুযায়ী পরবর্তী সময়ে ফেরত প্রদান করা হবে।',
          textEn: 'Upon membership revocation due to non-payment, only the net principal contribution (excluding any profit/dividends) shall be refunded in accordance with board bylaws.'
        }
      ]
    },
    {
      id: 'sec-5',
      numberBn: '৫',
      numberEn: '5',
      titleBn: 'কোম্পানির তহবিল নগদায়ন ও শেয়ার হস্তান্তর',
      titleEn: 'Fund Liquidation & Share Transfer Governance',
      icon: Landmark,
      clauses: [
        {
          code: '৫.১',
          codeEn: '5.1',
          headingBn: 'মেয়াদকালীন তহবিল উত্তোলন বা নগদায়ন নিষেধাজ্ঞা',
          headingEn: 'Strict Ban on Premature Capital Withdrawal / Liquidation',
          textBn: 'অংশীদারদের ব্যক্তিগত প্রয়োজনে তাৎক্ষণিকভাবে কোম্পানি থেকে মূলধন উত্তোলন বা তহবিল নগদায়ন করা সম্পূর্ণ নিষিদ্ধ। সমস্ত তহবিল চলমান ব্যবসায় বিনিয়োগ থাকবে।',
          textEn: 'Immediate unilateral capital withdrawals for personal reasons during active business cycles are strictly prohibited to protect operational solvency.'
        },
        {
          code: '৫.২',
          codeEn: '5.2',
          headingBn: 'অভ্যন্তরীণ শেয়ার হস্তান্তর ও বিক্রয় নীতি',
          headingEn: 'Internal Share Transfer & Preemptive Rights Protocol',
          textBn: 'কোনো অংশীদার জরুরি প্রয়োজনে শেয়ার হস্তান্তর বা বিক্রি করতে চাইলে সর্বপ্রথম বিদ্যমান অংশীদারদের নিকট বিক্রির লিখিত প্রস্তাব পেশ করতে হবে। বিদ্যমান অংশীদারদের লিখিত সম্মতি ব্যতীত বাইরের কোনো তৃতীয় পক্ষের নিকট শেয়ার হস্তান্তর বা বিক্রি করা সম্পূর্ণ নিষিদ্ধ।',
          textEn: 'Any partner intending to sell or transfer shares must first submit a written offer to existing partners. Transferring or selling equity to external third parties without unanimous board consent is prohibited.'
        },
        {
          code: '৫.৩',
          codeEn: '5.3',
          headingBn: 'উত্তরাধিকার ও মনোনীত নমিনি (Nominee) সংক্রান্ত নিয়ম',
          headingEn: 'Succession & Designated Nominee Legal Rights',
          textBn: 'কোনো অংশীদারের আকস্মিক মৃত্যু ঘটলে তার পূর্বে মনোনীত নমিনি (Nominee) অথবা বৈধ আইনি ওয়ারিশ উক্ত শেয়ারের স্বত্ব, মূলধন ও লভ্যাংশের পূর্ণ অধিকার লাভ করবেন।',
          textEn: 'In the event of an unfortunate demise of a partner, the legally designated nominee or statutory heirs shall inherit all rights and entitlements attached to the shares.'
        }
      ]
    },
    {
      id: 'sec-6',
      numberBn: '৬',
      numberEn: '6',
      titleBn: 'আর্থিক ব্যবস্থাপনা, হিসাবরক্ষণ ও লভ্যাংশ বণ্টন',
      titleEn: 'Financial Management, Treasury & Dividend Distribution',
      icon: BookOpen,
      clauses: [
        {
          code: '৬.১',
          codeEn: '6.1',
          headingBn: 'স্বীকৃত ব্যাংকিং চ্যানেল ও যৌথ ব্যাংক হিসাব পরিচালনা',
          headingEn: 'Recognized Banking Channels & Triple-Signatory Corporate Account',
          textBn: 'প্রতিষ্ঠানের সকল আর্থিক লেনদেন বৈধ ও স্বীকৃত ব্যাংকিং চ্যানেলের মাধ্যমে পরিচালিত হবে। ব্যাংকে "Nexora Limited"-এর নামে যৌথ অ্যাকাউন্ট থাকবে। চেয়ারম্যান, ম্যানেজিং ডিরেক্টর (MD) এবং পরিচালক (অর্থ)—এই তিনজনের যৌথ স্বাক্ষরে হিসাব পরিচালিত ও টাকা উত্তোলন করা হবে।',
          textEn: 'All finances shall be routed via authorized banking channels. The corporate bank account in the name of "Nexora Limited" shall be operated by the joint signatures of the Chairman, Managing Director (MD), and Director (Finance).'
        },
        {
          code: '৬.২',
          codeEn: '6.2',
          headingBn: 'ব্যক্তিগত ব্যবসা বা প্রয়োজনে ব্যবহারের কঠোর নিষেধাজ্ঞা',
          headingEn: 'Absolute Prohibition on Personal Use of Company Capital',
          textBn: 'কোনো পরিচালক বা অংশীদার প্রতিষ্ঠানের কোনো অর্থ নিজের ব্যক্তিগত ব্যবসা বা ব্যক্তিগত প্রয়োজনে ব্যবহার করতে পারবেন না।',
          textEn: 'No director, executive, or partner may utilize corporate treasury funds for personal commercial interests or personal expenditures under any circumstance.'
        },
        {
          code: '৬.৩',
          codeEn: '6.3',
          headingBn: 'হিসাবরক্ষণ, ভাউচার ও বার্ষিক আর্থিক অডিট রিপোর্ট',
          headingEn: 'Rigorous Accounting, Audit Vouchers & Annual Statement',
          textBn: 'পরিচালক (অর্থ) নিয়মিতভাবে প্রত্যেক সদস্যের জমা, জরিমানা ও বকেয়া হিসাব নিখুঁতভাবে সংরক্ষণ করবেন এবং প্রতি বছর বার্ষিক সাধারণ সভায় পূর্ণাঙ্গ আয়-ব্যয় ও অডিট রিপোর্ট উপস্থাপন করবেন।',
          textEn: 'The Director of Finance must meticulously maintain records of all deposits, penalties, and operational vouchers, presenting a full certified annual audit report at the AGM.'
        },
        {
          code: '৬.৪',
          codeEn: '6.4',
          headingBn: 'নিট মুনাফা ও লভ্যাংশ বণ্টন নীতি',
          headingEn: 'Pro-Rata Net Dividend Distribution Framework',
          textBn: 'ব্যবসায় অর্জিত নিট মুনাফা/লভ্যাংশ অংশীদারদের শেয়ারের শতকরা হার (Percentage) অনুযায়ী আনুপাতিক হারে বণ্টন করা হবে।',
          textEn: 'All declared net profits and dividend distributions shall be disbursed strictly in proportion to each shareholder\'s verified equity percentage.'
        }
      ]
    },
    {
      id: 'sec-7',
      numberBn: '৭',
      numberEn: '7',
      titleBn: 'পরিচালনা পরিষদ, ব্যবস্থাপনা কমিটি, উপদেষ্টা পরিষদ ও দায়িত্বাবলি',
      titleEn: 'Governance, Management Committee & Advisory Board',
      icon: Users,
      clauses: [
        {
          code: '৭.১',
          codeEn: '7.1',
          headingBn: 'দ্বৈত পরিচালনা কাঠামো (ব্যবস্থাপনা কমিটি ও প্রবাসী উপদেষ্টা পরিষদ)',
          headingEn: 'Dual Governance Framework (Domestic Management & Global Advisory)',
          textBn: 'কোম্পানির বৈশ্বিক অংশীদারদের সক্রিয় অংশগ্রহণ এবং দেশের ব্যবসায়িক কার্যক্রম গতিশীল ও সুশৃঙ্খল রাখার জন্য পরিচালনা কাঠামোকে দুটি স্তরে বিন্যস্ত করা হলো:\n\n১) ব্যবস্থাপনা কমিটি (বাংলাদেশ - দেশীয় অংশীদারগণ):\n• চেয়ারম্যান (১ জন): সভা আহ্বান করবেন, সভায় সভাপতিত্ব করবেন এবং প্রতিষ্ঠানের সার্বিক নীতিনির্ধারণে দিকনির্দেশনা দেবেন।\n• ম্যানেজিং ডিরেক্টর / MD (১ জন): দৈনিক ব্যবসায়িক কার্যক্রম পরিচালনা, পর্যবেক্ষণ ও মাঠপর্যায়ের তদারকি করবেন।\n• পরিচালক (অর্থ) (১ জন): সকল প্রকার হিসাব-নিকাশ, তহবিল ব্যবস্থাপনা, আয়-ব্যয় বিবরণী এবং বার্ষিক রিপোর্ট প্রণয়ন ও সংরক্ষণ করবেন।\n• অপারেশনস বিভাগ (২ জন): মাঠপর্যায়ের কার্যক্রম, সাপ্লাই চেইন ও দৈনন্দিন অপারেশনাল কাজগুলো সুচারুভাবে পরিচালনা ও তদারকি করবেন।\n• বিজনেস রিসার্চ বিভাগ (৩ জন): নতুন ব্যবসায়িক সম্ভাবনা খোঁজা, বাজার বিশ্লেষণ এবং কোম্পানির প্রবৃদ্ধি বাড়াতে কৌশলগত গবেষণা ও পরিকল্পনা প্রণয়ন করবেন।\n\n২) উপদেষ্টা পরিষদ (প্রবাসী অংশীদারগণ):\n• প্রধান উপদেষ্টা (১ জন): প্রবাসে অবস্থানরত অংশীদারদের নেতৃত্ব দেবেন এবং নীতিনির্ধারণী পরামর্শ প্রদান করবেন।\n• আন্তর্জাতিক প্রচার সম্পাদক (১ জন): প্রবাস থেকে আন্তর্জাতিক অঙ্গনে কোম্পানির ব্র্যান্ডিং, প্রচার-প্রচারণা এবং বৈদেশিক নেটওয়ার্ক সম্প্রসারণের দায়িত্ব পালন করবেন।\n• উপদেষ্টাবৃন্দ: বাকি প্রবাসে অবস্থানরত অংশীদারগণ সক্রিয় উপদেষ্টা হিসেবে যুক্ত থাকবেন।',
          textEn: 'The organizational structure is engineered into dual tiers:\n1) Domestic Management Committee (Bangladesh): Chairman, Managing Director, Director (Finance), Operations Division (2 Members), and Business Research Division (3 Members).\n2) Advisory Board (Expatriate Partners): Chief Advisor, International Publicity Secretary, and Advisory Council Members.'
        },
        {
          code: '৭.২',
          codeEn: '7.2',
          headingBn: 'জবাবদিহিতা, সমন্বয় ও অনলাইন যৌথ সভা',
          headingEn: 'Strict Accountability & Online Joint Council Sessions',
          textBn: 'দেশের ব্যবস্থাপনা কমিটি কোম্পানির সকল আর্থিক লেনদেন, ব্যবসায়িক অগ্রগতি এবং হিসাব-নিকাশ প্রবাসের উপদেষ্টা পরিষদের নিকট পেশ করিতে এবং তাদের নিকট জবাবদিহি করিতে বাধ্য থাকিবে। যেকোনো বড় ধরনের বিনিয়োগ বা নীতিগত সিদ্ধান্ত গ্রহণের পূর্বে উপদেষ্টা পরিষদের সাথে অনলাইন সভার মাধ্যমে পরামর্শ ও চূড়ান্ত সম্মতি গ্রহণ করিতে হইবে।',
          textEn: 'The domestic management committee is strictly accountable to the global advisory council. Prior to any major capital allocation, a joint online council meeting must be convened for formal board approval.'
        },
        {
          code: '৭.৩',
          codeEn: '7.3',
          headingBn: 'পরিষদের মেয়াদকাল ও ১ বছর পর পুনর্গঠন',
          headingEn: '1-Year Term of Office & Annual General Meeting Reconstitution',
          textBn: 'উভয় কমিটির সামগ্রিক মেয়াদ হইবে ০১ (এক) বছর। মেয়াদান্তে সাধারণ সভা ডেকে সর্বসম্মতিক্রমে পরবর্তী ১ বছরের জন্য নতুন কমিটি পুনর্গঠন করা হইবে এবং বিগত ১ বছরের পুঙ্খানুপুঙ্খ আর্থিক ও ব্যবসায়িক হিসাব পেশ করা বাধ্যতামূলক থাকিবে।',
          textEn: 'All committee appointments are tenure-limited to exactly 1 (one) year. At the conclusion of the term, an Annual General Meeting shall be convened to present full financial accounts and elect the incoming board.'
        }
      ]
    },
    {
      id: 'sec-8',
      numberBn: '৮',
      numberEn: '8',
      titleBn: 'সভা, কোরাম ও নীতিগত সিদ্ধান্ত গ্রহণ',
      titleEn: 'Meetings, Quorum & Strategic Decisions',
      icon: Clock,
      clauses: [
        {
          code: '৮.১',
          codeEn: '8.1',
          headingBn: 'নিয়মিত মাসিক পর্যালোচনা সভা',
          headingEn: 'Mandatory Monthly Performance & Review Meetings',
          textBn: 'প্রতি মাসে অন্তত ০১ (এক) টি সাধারণ বা পরিচালনা পরিষদের পর্যালোচনা সভা ভার্চুয়াল প্ল্যাটফর্ম বা দপ্তরে নিয়মিতভাবে অনুষ্ঠিত হবে।',
          textEn: 'The board shall convene at least 1 (one) formal review session each month to audit project milestones and treasury status.'
        },
        {
          code: '৮.২',
          codeEn: '8.2',
          headingBn: 'সভার কোরাম নির্ধারণ (মোট সদস্যের দুই-তৃতীয়াংশ / ২/৩)',
          headingEn: 'Statutory Meeting Quorum (Two-Thirds / 2/3 Attendance)',
          textBn: 'পরিচালনা পরিষদ বা সাধারণ সভার মোট সদস্যের দুই-তৃতীয়াংশ (২/৩) উপস্থিত থাকলে সভার কোরাম পূর্ণ হবে এবং সিদ্ধান্ত গ্রহণ বৈধ বলে গণ্য হবে।',
          textEn: 'A valid quorum requires the attendance of at least two-thirds (2/3) of the active shareholder body.'
        },
        {
          code: '৮.৩',
          codeEn: '8.3',
          headingBn: 'নতুন শেয়ার ইস্যু ও মূলধন কাঠামো পরিবর্তন',
          headingEn: 'New Share Issuance & Capital Re-structuring Protocol',
          textBn: 'যেকোনো নতুন শেয়ার ইস্যু বা মূলধন কাঠামোর পরিবর্তনের ক্ষেত্রে সংখ্যাগরিষ্ঠ অংশীদারদের লিখিত সম্মতি বাধ্যতামূলক।',
          textEn: 'Issuing additional shares or altering the capital structure mandates written authorization from the majority shareholder body.'
        }
      ]
    },
    {
      id: 'sec-9',
      numberBn: '৯',
      numberEn: '9',
      titleBn: 'শৃঙ্খলাভঙ্গ, বহিষ্কার ও গঠনতন্ত্র সংশোধন নীতি',
      titleEn: 'Breach of Discipline, Removal & Amendments',
      icon: Gavel,
      clauses: [
        {
          code: '৯.১',
          codeEn: '9.1',
          headingBn: 'শৃঙ্খলাভঙ্গ, অনিয়ম ও প্রশাসনিক বহিষ্কার ব্যবস্থা',
          headingEn: 'Breach of Ethics, Fraud & Administrative Expulsion',
          textBn: 'কোনো অংশীদার প্রতিষ্ঠান-বিরোধী কার্যকলাপ, আর্থিক অনিয়ম, প্রতারণা বা অনৈতিক আচরণের সাথে যুক্ত থাকলে পরিচালনা পরিষদ অবিলম্বে তার সদস্যপদ বাতিলসহ প্রয়োজনীয় আইনি ও প্রশাসনিক ব্যবস্থা গ্রহণ করতে পারবে।',
          textEn: 'Any partner engaging in activities detrimental to the company, fraud, or ethical violations is subject to immediate expulsion and statutory legal proceedings.'
        },
        {
          code: '৯.২',
          codeEn: '9.2',
          headingBn: 'গঠনতন্ত্র সংশোধন ও পরিমার্জন প্রস্তাব',
          headingEn: 'Formal Procedure for Constitutional Amendments',
          textBn: 'গঠনতন্ত্রের কোনো ধারা বা নীতিমালা সংশোধন, সংযোজন বা বিয়োজন করতে হলে পরিচালনা পরিষদে লিখিত প্রস্তাব পেশ করতে হবে।',
          textEn: 'Any proposed amendment, addition, or clause deletion must be formally submitted in writing to the executive board.'
        },
        {
          code: '৯.৩',
          codeEn: '9.3',
          headingBn: 'শেয়ারভিত্তিক ভোটাভুটি নীতি (Share-based Voting Principle)',
          headingEn: 'Proportional Share-Based Voting & Majority Rule',
          textBn: 'কোনো নীতিগত সিদ্ধান্ত বা সংশোধনের ক্ষেত্রে মতানৈক্য সৃষ্টি হলে শেয়ারের শতকরা হার (%) অনুযায়ী ভোটাভুটির মাধ্যমে বিষয়টি নিষ্পত্তি হবে। যে পক্ষের পক্ষে অধিক শেয়ারের (Majority Shares) সমর্থন থাকবে, সেই সিদ্ধান্তই চূড়ান্ত বলে কার্যকর হবে।',
          textEn: 'In case of disputes or strategic disagreements, voting power is calculated strictly by equity percentage (Share-Based Voting). The resolution commanding majority equity support shall prevail as final and binding.'
        }
      ]
    }
  ];

  // Founders Table from PDF Page 6
  const foundersTable = [
    { no: 1, nameBn: 'তুফায়েল আহমেদ', nameEn: 'Tufayel Ahmed', share: 10, designationBn: 'আন্তর্জাতিক প্রচার সম্পাদক', designationEn: 'International Publicity Secretary', location: 'Italy (ইতালি)', status: 'Approved & Signed' },
    { no: 2, nameBn: 'মেহেরাব হোসেন', nameEn: 'Mehrab Hossain', share: 10, designationBn: 'উপদেষ্টা', designationEn: 'Advisor', location: 'France (ফ্রান্স)', status: 'Approved & Signed' },
    { no: 3, nameBn: 'বায়েজিদ আহমেদ', nameEn: 'Bayezid Ahmed', share: 10, designationBn: 'প্রধান উপদেষ্টা', designationEn: 'Chief Advisor', location: 'Saudi Arabia (সৌদি আরব)', status: 'Approved & Signed' },
    { no: 4, nameBn: 'রাসেল আহমেদ', nameEn: 'Rasel Ahmed', share: 10, designationBn: 'চেয়ারম্যান (ব্যবস্থাপনা কমিটি)', designationEn: 'Chairman (Management Committee)', location: 'Sylhet, Bangladesh', status: 'Approved & Signed' },
    { no: 5, nameBn: 'হুমায়ুন খালিদ', nameEn: 'Humayun Khalid', share: 5, designationBn: 'উপদেষ্টা', designationEn: 'Advisor', location: 'UAE (দুবাই)', status: 'Approved & Signed' },
    { no: 6, nameBn: 'ইমরান আহমেদ', nameEn: 'Imran Ahmed', share: 5, designationBn: 'অর্থ ও হিসাব বিভাগ', designationEn: 'Finance & Accounts Division', location: 'Sylhet, Bangladesh', status: 'Approved & Signed' },
    { no: 7, nameBn: 'জুয়েল আহমেদ', nameEn: 'Juwel Ahmed', share: 5, designationBn: 'ম্যানেজিং ডিরেক্টর (MD)', designationEn: 'Managing Director (MD)', location: 'Sylhet, Bangladesh', status: 'Approved & Signed' },
    { no: 8, nameBn: 'কাওসার আহমেদ', nameEn: 'Kawsar Ahmed', share: 3, designationBn: 'অপারেশনস বিভাগ', designationEn: 'Operations Division', location: 'Sylhet, Bangladesh', status: 'Approved & Signed' },
    { no: 9, nameBn: 'শিমুল আহমেদ', nameEn: 'Shimul Ahmed', share: 3, designationBn: 'উপদেষ্টা', designationEn: 'Advisor', location: 'Saudi Arabia (সৌদি আরব)', status: 'Approved & Signed' },
    { no: 10, nameBn: 'উজ্জল আহমেদ', nameEn: 'Uzzol Ahmed', share: 3, designationBn: 'বিজনেস রিসার্চ বিভাগ', designationEn: 'Business Research Division', location: 'Sylhet, Bangladesh', status: 'Approved & Signed' },
    { no: 11, nameBn: 'জাকির আহমেদ', nameEn: 'Zakir Ahmed', share: 3, designationBn: 'বিজনেস রিসার্চ বিভাগ', designationEn: 'Business Research Division', location: 'Sylhet, Bangladesh', status: 'Approved & Signed' },
    { no: 12, nameBn: 'তাহের আহমেদ', nameEn: 'Taher Ahmed', share: 3, designationBn: 'অপারেশনস বিভাগ', designationEn: 'Operations Division', location: 'Sylhet, Bangladesh', status: 'Approved & Signed' },
    { no: 13, nameBn: 'দেলোয়ার আহমেদ', nameEn: 'Delowar Ahmed', share: 3, designationBn: 'বিজনেস রিসার্চ বিভাগ', designationEn: 'Business Research Division', location: 'Sylhet, Bangladesh', status: 'Approved & Signed' }
  ];

  const filteredSections = sectionsData.filter(sec => {
    if (activeSection !== 'all' && sec.id !== activeSection) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchesTitle = sec.titleBn.toLowerCase().includes(q) || sec.titleEn.toLowerCase().includes(q);
    const matchesClauses = sec.clauses.some(
      c => c.headingBn.toLowerCase().includes(q) || 
           c.headingEn.toLowerCase().includes(q) || 
           c.textBn.toLowerCase().includes(q) || 
           c.textEn.toLowerCase().includes(q)
    );
    return matchesTitle || matchesClauses;
  });

  // Calculate live fine based on Constitution section 4 formula
  const baseMonthlyAmount = calcShare * 1000;
  const calculatedFine = isLate ? calcShare * 100 : 0;
  const totalPayable = baseMonthlyAmount + calculatedFine;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 print:p-0 print:m-0 print:max-w-full">
      
      {/* 1. TOP HERO HEADER WITH CORPORATE BADGES & ACTION TOOLS */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-10 shadow-2xl print:border-none print:shadow-none print:p-4 print:bg-white print:text-black">
        {/* Background decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none print:hidden" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none print:hidden" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wide flex items-center gap-1.5 print:border-black print:text-black">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 print:hidden" />
                <span>{lang === 'bn' ? '১০০% শরিয়াহ অনুসারী গঠনতন্ত্র' : '100% Shariah Compliant Constitution'}</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold print:border-black print:text-black">
                {lang === 'bn' ? 'সংস্করণ: ১.০ (চূড়ান্ত অনুমোদিত)' : 'Version 1.0 (Officially Ratified)'}
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-medium border border-slate-700 print:hidden">
                {lang === 'bn' ? 'কার্যকরী: ১ সেপ্টেম্বর ২০২৬' : 'Effective: Sept 1, 2026'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight print:text-black">
              {lang === 'bn' ? 'নেক্সোরা লিমিটেড — পূর্ণাঙ্গ গঠনতন্ত্র ও নীতিমালা' : 'Nexora Limited — Full Constitution & Bylaws'}
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed print:text-slate-700">
              {lang === 'bn' 
                ? 'একটি সুসংগঠিত শরিয়াহভিত্তিক যৌথ ব্যবসায়িক উদ্যোগ। পারস্পরিক বিশ্বাস, সততা এবং দীর্ঘমেয়াদী হালাল আর্থিক সমৃদ্ধির উদ্দেশ্যে সকল প্রতিষ্ঠাতা শেয়ারহোল্ডারদের সর্বসম্মত অনুমোদনে প্রণীত।' 
                : 'A structured Shariah-governed joint business enterprise. Formulated and unanimously ratified by all founding shareholders for long-term halal growth, transparency, and integrity.'}
            </p>

            {/* Quick Timeline markers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 print:bg-slate-50 print:border-slate-300">
                <p className="text-slate-400 text-[11px] print:text-slate-600">{lang === 'bn' ? 'প্রতিষ্ঠার প্রস্তাব' : 'Proposal Date'}</p>
                <p className="text-white font-bold font-mono text-xs print:text-black">{lang === 'bn' ? '২০ আগস্ট ২০২৬' : 'Aug 20, 2026'}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 print:bg-slate-50 print:border-slate-300">
                <p className="text-slate-400 text-[11px] print:text-slate-600">{lang === 'bn' ? 'কমিটি চূড়ান্তকরণ' : 'Committee Finalized'}</p>
                <p className="text-white font-bold font-mono text-xs print:text-black">{lang === 'bn' ? '২২ আগস্ট ২০২৬' : 'Aug 22, 2026'}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 print:bg-slate-50 print:border-slate-300">
                <p className="text-slate-400 text-[11px] print:text-slate-600">{lang === 'bn' ? 'কার্যক্রম শুরু' : 'Operations Live'}</p>
                <p className="text-emerald-400 font-bold font-mono text-xs print:text-black">{lang === 'bn' ? '১ সেপ্টেম্বর ২০২৬' : 'Sept 1, 2026'}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 print:bg-slate-50 print:border-slate-300">
                <p className="text-slate-400 text-[11px] print:text-slate-600">{lang === 'bn' ? 'বিক্রীত শেয়ার' : 'Sold Equity'}</p>
                <p className="text-amber-400 font-bold font-mono text-xs print:text-black">৭৩% (১৩ জন)</p>
              </div>
            </div>

          </div>

          {/* Action buttons */}
          <div className="flex flex-row md:flex-col gap-2.5 shrink-0 print:hidden">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === 'bn' ? 'প্রিন্ট / সেভ কপি' : 'Print / Save Copy'}</span>
            </button>

            {onNavigateToDeposit && (
              <button
                onClick={onNavigateToDeposit}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-95"
              >
                <DollarSign className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'bn' ? 'কিস্তি পরিশোধ করুন' : 'Pay Installment'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. PREAMBLE CARD (বিসমিল্লাহির রাহমানির রাহিম ও ভূমিকা) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl print:bg-white print:text-black print:border-slate-300">
        <div className="text-center pb-2 border-b border-slate-800/80 print:border-slate-300">
          <p className="text-emerald-400 font-serif font-bold text-lg sm:text-xl tracking-wider print:text-black">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
          <p className="text-xs text-slate-400 font-medium mt-1 print:text-slate-600">
            {lang === 'bn' ? 'বিসমিল্লাহির রাহমানির রাহিম (পরম করুণাময় অসীম দয়ালু আল্লাহর নামে শুরু করছি)' : 'In the name of Allah, the Most Gracious, the Most Merciful'}
          </p>
        </div>

        <div className="space-y-3 text-slate-200 text-sm sm:text-base leading-relaxed print:text-slate-800">
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 print:text-black">
            <BookOpen className="w-4 h-4 text-amber-400 print:hidden" />
            <span>{lang === 'bn' ? 'ভূমিকা ও মূল ব্যবসায়িক দর্শন:' : 'Preamble & Strategic Objective:'}</span>
          </h2>
          <p className="text-justify leading-relaxed">
            {lang === 'bn' ? (
              <>
                আমরা নিম্নস্বাক্ষরকারী প্রতিষ্ঠাতা অংশীদারগণ পারস্পরিক বিশ্বাস, সততা, যৌথ উদ্যোগ এবং দীর্ঘমেয়াদী আর্থিক উন্নয়নের লক্ষ্যে একটি সুসংগঠিত ব্যবসায়িক প্রতিষ্ঠান হিসেবে <strong>"Nexora Limited"</strong> গঠন করছি। আমাদের মূল লক্ষ্য হলো—প্রতি মাসে নিয়মিত অর্থ জমা করে একটি শক্তিশালী যৌথ তহবিল গঠন করা এবং সেই তহবিল ব্যবহার করে লাভজনক ও বৈধ ব্যবসায় বিনিয়োগ, নতুন ব্যবসা প্রতিষ্ঠা কিংবা ব্যবসা সম্প্রসারণ করা।
                পরিচালনা পরিষদ ও সাধারণ সদস্যদের সর্বসম্মতিক্রমে প্রণীত এই গঠনতন্ত্র কোম্পানির সকল সদস্যের জন্য চূড়ান্ত ও বাধ্যতামূলক।
              </>
            ) : (
              <>
                We, the undersigned founding equity partners, united in mutual trust, integrity, and shared entrepreneurial ambition, hereby establish <strong>"Nexora Limited"</strong> as a formal corporate institution. Our primary mission is to aggregate disciplined monthly capital into a resilient investment treasury, channeling these funds strictly into profitable, halal, asset-backed ventures and sustainable commercial expansions. This Constitution and Bylaw framework, ratified unanimously, is final and binding upon all participating shareholders.
              </>
            )}
          </p>
        </div>
      </div>

      {/* 3. LATE FEE POLICY & DISCIPLINE SIMULATOR (ধারা ৪ ভিত্তিক লাইভ ক্যালকুলেটর) */}
      <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-400" />
              <h3 className="text-base sm:text-lg font-bold text-white">
                {lang === 'bn' ? 'গঠনতন্ত্রের ধারা ৪ অনুযায়ী কিস্তি ও বিলম্ব ফি (জরিমানা) ক্যালকুলেটর' : 'Constitution Section 4: Installment & Fine Calculator'}
              </h3>
            </div>
            <p className="text-xs text-slate-300">
              {lang === 'bn' 
                ? 'নিয়ম: প্রতি ১% শেয়ারের মাসিক জমার হার ১,০০০/- টাকা। প্রতি মাসের ১-১০ তারিখের মধ্যে পরিশোধ না করিলে প্রতি ১% শেয়ারের জন্য ১০০/- টাকা বিলম্ব ফি বাধ্যতামূলক।' 
                : 'Rule: 1,000 BDT per 1% share/month. Depositing after the 10th incurs a mandatory fine of 100 BDT per 1% share.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-300">
              {lang === 'bn' ? 'জমার সময়কাল:' : 'Deposit Timing:'}
            </span>
            <button
              onClick={() => setIsLate(false)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                !isLate 
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {lang === 'bn' ? '১–১০ তারিখ (০/- জরিমানা)' : '1st-10th (0 BDT Fine)'}
            </button>
            <button
              onClick={() => setIsLate(true)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                isLate 
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {lang === 'bn' ? '১০ তারিখের পর (বিলম্ব ফি সহ)' : 'After 10th (With Fine)'}
            </button>
          </div>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 3, 5, 10].map(s => (
            <button
              key={s}
              onClick={() => setCalcShare(s)}
              className={`p-3 rounded-2xl border text-left transition ${
                calcShare === s 
                  ? 'bg-amber-500/20 border-amber-500 text-white shadow-md' 
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm">{s}% {lang === 'bn' ? 'শেয়ার' : 'Share'}</span>
                {calcShare === s && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                {lang === 'bn' ? `মূল কিস্তি: ${(s * 1000).toLocaleString('bn-BD')} ৳` : `Base: ${(s * 1000).toLocaleString()} BDT`}
              </p>
            </button>
          ))}
        </div>

        {/* Summary pill */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-slate-400 text-[11px]">{lang === 'bn' ? 'নির্বাচিত শেয়ার:' : 'Selected Equity:'}</p>
              <p className="text-white font-bold font-mono">{calcShare}%</p>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <p className="text-slate-400 text-[11px]">{lang === 'bn' ? 'মূল কিস্তির পরিমাণ:' : 'Base Installment:'}</p>
              <p className="text-white font-bold font-mono">{baseMonthlyAmount.toLocaleString()} BDT</p>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <p className="text-slate-400 text-[11px]">{lang === 'bn' ? 'বিলম্ব ফি (জরিমানা):' : 'Late Fee (Fine):'}</p>
              <p className={`font-bold font-mono ${calculatedFine > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {calculatedFine.toLocaleString()} BDT
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-slate-400 text-[11px]">{lang === 'bn' ? 'মোট প্রদেয় অর্থ:' : 'Total Payable:'}</p>
            <p className="text-lg font-extrabold text-amber-400 font-mono">{totalPayable.toLocaleString()} BDT</p>
          </div>
        </div>

      </div>

      {/* 4. SEARCH & SECTION JUMP NAVIGATION */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 print:hidden">
        
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'bn' ? 'গঠনতন্ত্রের ধারা বা বিষয় খুঁজুন...' : 'Search constitutional clauses...'}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick controls */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          <button
            onClick={expandAll}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition"
          >
            {lang === 'bn' ? 'সকল ধারা খুলুন (+)' : 'Expand All'}
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition"
          >
            {lang === 'bn' ? 'সকল ধারা বন্ধ করুন (-)' : 'Collapse All'}
          </button>
        </div>
      </div>

      {/* Section Quick Jump Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin print:hidden">
        <button
          onClick={() => setActiveSection('all')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            activeSection === 'all'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
          }`}
        >
          {lang === 'bn' ? 'সকল ধারা (১ থেকে ৯)' : 'All Sections (1 to 9)'}
        </button>

        {sectionsData.map(sec => (
          <button
            key={sec.id}
            onClick={() => {
              setActiveSection(sec.id);
              setExpandedClauses(prev => ({ ...prev, [sec.id]: true }));
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeSection === sec.id
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>{lang === 'bn' ? `ধারা ${sec.numberBn}` : `Sec ${sec.numberEn}`}</span>
          </button>
        ))}
      </div>

      {/* 5. THE 9 CORE CONSTITUTIONAL SECTIONS (ACCORDION / DOCUMENT VIEW) */}
      <div className="space-y-6">
        {filteredSections.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
            <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto" />
            <p className="text-white font-bold">{lang === 'bn' ? 'কোনো ধারা পাওয়া যায়নি।' : 'No matching constitutional clauses found.'}</p>
            <p className="text-xs text-slate-400">{lang === 'bn' ? 'অনুগ্রহ করে অন্য শব্দ দিয়ে অনুসন্ধান করুন।' : 'Try searching with different keywords.'}</p>
          </div>
        ) : (
          filteredSections.map(sec => {
            const Icon = sec.icon;
            const isExpanded = !!expandedClauses[sec.id];

            return (
              <div 
                key={sec.id}
                id={sec.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl transition-all print:bg-white print:text-black print:border-slate-300 print:shadow-none print:break-inside-avoid"
              >
                {/* Section Header Banner */}
                <div 
                  onClick={() => toggleClause(sec.id)}
                  className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 flex items-center justify-between cursor-pointer hover:bg-slate-850 transition select-none print:bg-slate-100 print:text-black"
                >
                  <div className="flex items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 font-bold font-mono shadow-md print:border-slate-400 print:text-black">
                      {lang === 'bn' ? sec.numberBn : sec.numberEn}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] sm:text-xs font-mono font-bold text-amber-400 uppercase tracking-wider print:text-slate-700">
                          {lang === 'bn' ? `ধারা ${sec.numberBn}` : `SECTION ${sec.numberEn}`}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono print:hidden">
                          {sec.clauses.length} {lang === 'bn' ? 'টি উপধারা' : 'Clauses'}
                        </span>
                      </div>
                      <h2 className="text-base sm:text-xl font-bold text-white leading-tight mt-0.5 print:text-black">
                        {lang === 'bn' ? sec.titleBn : sec.titleEn}
                      </h2>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-slate-400 print:hidden">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>

                {/* Section Clauses List */}
                {isExpanded && (
                  <div className="p-5 sm:p-7 pt-2 space-y-4 border-t border-slate-800/80 print:border-slate-300 print:p-4">
                    {sec.clauses.map((clause, idx) => (
                      <div 
                        key={idx}
                        className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition space-y-2.5 print:bg-white print:border-slate-200 print:p-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-xs shrink-0 print:border-slate-400 print:text-black">
                              {lang === 'bn' ? clause.code : clause.codeEn}
                            </span>
                            <h3 className="text-sm sm:text-base font-bold text-white leading-snug print:text-black">
                              {lang === 'bn' ? clause.headingBn : clause.headingEn}
                            </h3>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-0 sm:pl-9 whitespace-pre-line print:text-slate-800">
                          {lang === 'bn' ? clause.textBn : clause.textEn}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* 6. FOUNDER SHAREHOLDERS DIRECTORY & RATIFICATION TABLE (পৃষ্ঠা ৬ হুবহু চার্ট) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl print:bg-white print:text-black print:border-slate-300 print:break-inside-avoid">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 print:border-slate-300">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg sm:text-xl font-bold text-white print:text-black">
                {lang === 'bn' ? 'প্রতিষ্ঠাতা অংশীদারবৃন্দের নাম, শেয়ার বণ্টন ও সম্মতি সনদ' : 'Founder Shareholders Equity Allocation & Ratification'}
              </h2>
            </div>
            <p className="text-xs text-slate-400 print:text-slate-600">
              {lang === 'bn' 
                ? 'অত্র গঠনতন্ত্রের সকল ধারা ও উপধারা পাঠ করে, বুঝে এবং পূর্ণ সম্মতির সাথে স্বাক্ষরকারী ১৩ জন প্রতিষ্ঠাতা অংশীদার।' 
                : 'The 13 founding shareholders who have fully read, understood, ratified, and digitally signed this Constitution.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold print:border-black print:text-black">
              {lang === 'bn' ? 'বিক্রীত শেয়ার: ৭৩%' : 'Subscribed: 73%'}
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold print:border-black print:text-black">
              {lang === 'bn' ? 'অবিক্রিত: ২৭%' : 'Treasury: 27%'}
            </div>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 print:border-slate-300">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800 print:bg-slate-100 print:text-black print:border-slate-300">
              <tr>
                <th className="py-3 px-3 sm:px-4 font-mono">#</th>
                <th className="py-3 px-3 sm:px-4">{lang === 'bn' ? 'অংশীদারের নাম' : 'Shareholder Name'}</th>
                <th className="py-3 px-3 sm:px-4">{lang === 'bn' ? 'পদবী ও বিভাগ' : 'Designation & Division'}</th>
                <th className="py-3 px-3 sm:px-4 text-center">{lang === 'bn' ? 'শেয়ারের হার (%)' : 'Equity %'}</th>
                <th className="py-3 px-3 sm:px-4">{lang === 'bn' ? 'অবস্থান / দেশ' : 'Location'}</th>
                <th className="py-3 px-3 sm:px-4 text-center">{lang === 'bn' ? 'সম্মতি ও স্বাক্ষর' : 'Status'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 print:divide-slate-200">
              {foundersTable.map((f) => (
                <tr key={f.no} className="hover:bg-slate-850/50 transition print:hover:bg-transparent">
                  <td className="py-3 px-3 sm:px-4 font-mono text-slate-400 print:text-black">{f.no}</td>
                  <td className="py-3 px-3 sm:px-4 font-bold text-white print:text-black">
                    {lang === 'bn' ? f.nameBn : f.nameEn}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-slate-300 print:text-slate-800">
                    {lang === 'bn' ? f.designationBn : f.designationEn}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono font-bold print:border-slate-400 print:text-black">
                      {f.share}%
                    </span>
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-slate-400 font-mono text-xs print:text-slate-700">
                    {f.location}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold text-[11px] print:border-slate-400 print:text-black">
                      <Check className="w-3 h-3 text-emerald-400 print:hidden" />
                      <span>{lang === 'bn' ? 'অনুমোদিত' : 'Ratified'}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-950 font-bold text-white border-t-2 border-slate-700 print:bg-slate-100 print:text-black print:border-slate-400">
              <tr>
                <td colSpan={3} className="py-3.5 px-3 sm:px-4 text-right">
                  {lang === 'bn' ? 'সর্বমোট বিক্রিত শেয়ার (১৩ জন অংশীদার):' : 'Total Subscribed Equity (13 Partners):'}
                </td>
                <td className="py-3.5 px-3 sm:px-4 text-center text-amber-400 font-mono font-extrabold text-sm sm:text-base print:text-black">
                  ৭৩%
                </td>
                <td colSpan={2} className="py-3.5 px-3 sm:px-4 text-xs text-slate-400 print:text-slate-700">
                  {lang === 'bn' ? '+ অবিক্রিত শেয়ার ২৭% = মোট ১০০%' : '+ 27% Treasury = 100% Total'}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Ratification signature note */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 leading-relaxed flex items-center justify-between gap-4 print:bg-slate-50 print:border-slate-300 print:text-slate-800">
          <div>
            <p className="font-semibold text-slate-300 print:text-black">
              {lang === 'bn' ? 'সার্বজনীন আইনি নিশ্চয়তা ও কার্যকরী সিদ্ধান্ত:' : 'Statutory Certification & Governance Statement:'}
            </p>
            <p className="mt-0.5">
              {lang === 'bn' 
                ? 'উক্ত গঠনতন্ত্র ও নীতিমালা পরিচালনা পরিষদ ও অংশীদারদের সর্বসম্মতিক্রমে অনুমোদিত ও স্বাক্ষরিত।' 
                : 'This Constitution & Operational Framework is formally signed, sealed, and executed on behalf of all founding partners.'}
            </p>
          </div>

          <div className="text-right shrink-0">
            <p className="font-mono text-emerald-400 font-bold text-xs print:text-black">Nexora Limited</p>
            <p className="text-[10px] text-slate-400 print:text-slate-600">Dhaka & Sylhet, Bangladesh</p>
          </div>
        </div>

      </div>

      {/* 7. PRINTABLE OFFICIAL SIGNATURE BLOCK FOR HARD COPIES */}
      <div className="hidden print:block pt-12 space-y-12 text-black">
        <div className="grid grid-cols-3 gap-8 text-center text-xs">
          <div className="space-y-1 pt-12 border-t border-black">
            <p className="font-bold">চেয়ারম্যান</p>
            <p className="text-slate-700">ব্যবস্থাপনা কমিটি</p>
          </div>
          <div className="space-y-1 pt-12 border-t border-black">
            <p className="font-bold">ম্যানেজিং ডিরেক্টর (MD)</p>
            <p className="text-slate-700">নেক্সোরা লিমিটেড</p>
          </div>
          <div className="space-y-1 pt-12 border-t border-black">
            <p className="font-bold">প্রধান উপদেষ্টা</p>
            <p className="text-slate-700">উপদেষ্টা পরিষদ (প্রবাসী)</p>
          </div>
        </div>
      </div>

    </div>
  );
};
