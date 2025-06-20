import { z } from "zod";

export const createChamaSchema = z.object({
  // Chama Details
  profileImage: z.string().min(1),
  name: z.string().min(1).max(30),
  description: z.string().min(1).max(100),
  location: z.string().min(1),

  // Membership Details
  maximumMembers: z
    .number()
    .min(1)
    .describe("The maximum number of members that can be in the chama."),
  registrationFeeRequired: z
    .boolean()
    .describe("Whether a registration fee is required to join the chama."),
  registrationFeeAmount: z
    .number()
    .min(1)
    .describe("The amount of money that a member will pay to join the chama."),
  payoutPeriod: z
    .enum(["daily", "weekly", "monthly", "yearly"])
    .describe("The period in which the chama will pay out the members.")
    .optional()
    .default("yearly"),
  payoutPercentageAmount: z
    .number()
    .min(1)
    .max(100)
    .describe(
      "The percentage of a member's total shares that will be paid out to the members during the payout period."
    )
    .optional()
    .default(80),
  registrationFeeCurrency: z
    .string()
    .min(1)
    .describe("The currency of the registration fee."),

  // Contributions Details
  contributionAmount: z
    .number()
    .min(1)
    .describe(
      "The amount of money that a member will pay to contribute to the chama every contribution period."
    ),
  contributionPeriod: z
    .enum(["daily", "weekly", "monthly", "yearly"])
    .describe(
      "The period in which the chama will collect contributions from the members."
    ),
  contributionPenalty: z
    .number()
    .min(1)
    .describe(
      "The penalty that a member will pay if they miss a contribution period."
    ),
  penaltyExpirationPeriod: z
    .number()
    .min(1)
    .describe(
      "The period in contribution periods in which the penalty will expire after a member misses a contribution."
    ),

  // Loans Details
  maximumLoanAmount: z
    .number()
    .min(1)
    .describe(
      "The maximum amount of money that a member can borrow from the chama."
    ),
  loanInterestRate: z
    .number()
    .min(1)
    .describe("The interest rate that a member will pay for a loan."),
  loanTerm: z.string().describe("The term of a loan."),
  loanPenalty: z
    .number()
    .min(1)
    .describe(
      "The penalty that a member will pay if they miss a loan repayment period."
    ),
  loanPenaltyExpirationPeriod: z
    .number()
    .min(1)
    .describe(
      "The period in days in which the penalty will expire after a member misses a loan repayment period."
    ),
  minContributionRatio: z
    .number()
    .min(1)
    .describe(
      "The minimum contributions a member must have participated in to borrow a loan from the chama."
    ),

  // Additional Non-Form Details
  chamaId: z.string().describe("A unique 8 digit identifier for the chama."),
  dateCreated: z.string().describe("The date and time the chama was created."),
  members: z.array(z.string()).describe("The members of the chama."),
  loans: z
    .array(z.string())
    .describe("The loans that have been given to the members."),
  penalties: z
    .array(z.string())
    .describe("The penalties that have been paid to the chama."),
  contributions: z
    .array(z.string())
    .describe("The contributions that have been made to the chama."),
  payouts: z
    .array(z.string())
    .describe("The payouts that have been made to the members."),
  totalContributions: z
    .number()
    .describe(
      "The total contributions that have been made to the chama in KES."
    ),
  totalPayouts: z
    .number()
    .describe("The total payouts that have been made to the members in KES."),
  totalLoans: z
    .number()
    .describe("The total loans that have been given to the members in KES."),
  totalLoanRepayments: z
    .number()
    .describe(
      "The total loan repayments that have been made to the chama in KES."
    ),
  totalLoanPenalties: z
    .number()
    .describe(
      "The total loan penalties that have been paid to the chama in KES."
    ),
  chamaAddress: z.string().describe("The blockchain address of the chama."),
});

export type CreateChamaSchema = z.infer<typeof createChamaSchema>;
