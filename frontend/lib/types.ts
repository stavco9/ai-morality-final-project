export interface VerdictResponse {
  decision: string;
  winner: string;
  loser: string;
  reasoning: string;
  summary: string;
}

export interface ApiErrorResponse {
  error: string;
}

export interface ApiResponse {
  response: VerdictResponse;
}

export interface FormErrors {
  plaintiffName?: string;
  defendantName?: string;
  claimAmount?: string;
  claimCurrency?: string;
  claimSummary?: string;
}
