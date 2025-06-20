// sets default to missing fields of a created chama

import { CreateChamaSchema } from "@/app/create/schema";
import { generateChamaId } from "./generateId";

interface CreatedChama {
  chamaAddress: string;
  name: string;
  profileImage: string;
  location: string;
  description: string;
  maximumMembers: number;
  registrationFeeRequired: boolean;
  registrationFeeAmount: number;
  contributionAmount: number;
  contributionPeriod: "weekly" | "monthly" | "daily" | "yearly";
  contributionPenalty: number;
  maximumLoanAmount: number;
  loanInterestRate: number;
  loanTerm: string;
  loanPenalty: number;
}

// {
//   "chamaAddress": "0x56D174D8C43b67D1f27EbeA75c934938839f8C61",
//   "chamaId": "velit in c",
//   "name": "est nostrud voluptate sint dolor",
//   "description": "reprehenderit ad nulla Ut",
//   "location": "nulla elit non officia incididunt",
//   "profileImage": "ut adipisicing",
//   "creator": {
//     "walletAddress": "0x56D174D8C43b67D1f27EbeA75c934938839f8C61",
//     "fullName": "Sylus",
//     "profileImage": "img.com"
//   },
//   "maximumMembers": 15,
//   "registrationFeeRequired": false,
//   "registrationFeeAmount": -47461809.00409489,
//   "registrationFeeCurrency": "ad",
//   "payoutPeriod": "Lorem est",
//   "payoutPercentageAmount": 42619700,
//   "contributionAmount": 36935698.63090712,
//   "contributionPeriod": "commodo ut proident",
//   "contributionPenalty": -63893760.17893307,
//   "penaltyExpirationPeriod": 54703925,
//   "maximumLoanAmount": 15136304.046278283,
//   "loanInterestRate": 65168016.81618559,
//   "loanTerm": "dolore fugiat",
//   "loanPenalty": 62872484.67096588,
//   "loanPenaltyExpirationPeriod": -16315154,
//   "minContributionRatio": -42105931,
//   "totalContributions": 75184136.50205868,
//   "totalPayouts": 27343120.591805413,
//   "totalLoans": -67720095.24114062,
//   "totalLoanRepayments": -56580764.69804021,
//   "totalLoanPenalties": -56785759.53503011,
//   "members": [],
//   "dateCreated": "2003-06-01T22:08:35.779Z",
//   "updatedAt": "1983-09-16T14:41:48.790Z"
// }

export const setDefaults = (data: CreatedChama): CreateChamaSchema => {
  const ID = generateChamaId();
  const finalChamaData: CreateChamaSchema = {
    ...data,
    chamaId: ID,
    dateCreated: new Date().toISOString(),
    payoutPeriod: "yearly",
    payoutPercentageAmount: 80,
    registrationFeeCurrency: "KES",
    totalContributions: 0,
    totalPayouts: 0,
    totalLoans: 0,
    totalLoanRepayments: 0,
    totalLoanPenalties: 0,
    penalties: [],
    contributions: [],
    loans: [],
    payouts: [],
    members: [],
    penaltyExpirationPeriod: 0,
    loanPenaltyExpirationPeriod: 0,
    minContributionRatio: 5,
  };
  return finalChamaData;
};
