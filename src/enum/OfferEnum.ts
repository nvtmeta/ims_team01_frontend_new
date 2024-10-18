// List of offer status
// 1. Waiting for approval: When the offer is created
// 2. Approved offer: When Manager or Admin approves the offer
// 3. Rejected offer: When Manager or Admin rejects the offer
// 4. Waiting for response: When the offer is sent and waiting candidate to response
// 5. Accepted offer: When candidate accepts the offer
// 6. Declined offer: When candidate declines the offer
// 7. Cancelled: When the offer is cancelled

export enum OfferStatusEnum {
  WAITING_FOR_APPROVAL = "WAITING_FOR_APPROVAL",
  APPROVED_OFFER = "APPROVED_OFFER",
  REJECTED_OFFER = "REJECTED_OFFER",
  WAITING_FOR_RESPONSE = "WAITING_FOR_RESPONSE",
  ACCEPTED_OFFER = "ACCEPTED_OFFER",
  DECLINED_OFFER = "DECLINED_OFFER",
  CANCELLED = "CANCELLED",
}

export enum OfferContractTypeEnum {
  //  Trial 2 months, Trainee 3 months, 1 year, 3 years and Unlimited
  TRIAL_2_MONTHS = "TRIAL_2_MONTHS",
  TRAINEE_3_MONTHS = "TRAINEE_3_MONTHS",
  ONE_YEAR = "ONE_YEAR",
  THREE_YEAR = "THREE_YEAR",
  UNLIMITED = "UNLIMITED",
}
