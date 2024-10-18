import { CandidateStatusEnum, HighestLevelEnum } from "@/enum/CandidateEnum";
import { GenderEnum } from "@/enum/GenderEnum";
import { UserStatusEnum } from "@/enum/UserStatusEnum";
import { UserGenderEnum } from "@/enum/UserGenderEnum";
import { InterviewResultEnum, InterviewStatusEnum } from "@/enum/InterviewEnum";
import { JobStatusEnum } from "@/enum/JobEnum";
import { OfferContractTypeEnum, OfferStatusEnum } from "@/enum/OfferEnum";

export const formatCandidateStatus = (status: CandidateStatusEnum): string => {
    switch (status) {
        case CandidateStatusEnum.OPEN:
            return "Open";
        case CandidateStatusEnum.WAITING_FOR_INTERVIEW:
            return "Waiting for Interview";
        case CandidateStatusEnum.CANCELLED_INTERVIEW:
            return "Cancelled Interview";
        case CandidateStatusEnum.PASSED_INTERVIEW:
            return "Passed Interview";
        case CandidateStatusEnum.FAILED_INTERVIEW:
            return "Failed Interview";
        case CandidateStatusEnum.WAITING_FOR_APPROVAL:
            return "Waiting for Approval";
        case CandidateStatusEnum.APPROVED_OFFER:
            return "Approved Offer";
        case CandidateStatusEnum.REJECTED_OFFER:
            return "Rejected Offer";
        case CandidateStatusEnum.WAITING_FOR_RESPONSE:
            return "Waiting for Response";
        case CandidateStatusEnum.ACCEPTED_OFFER:
            return "Accepted Offer";
        case CandidateStatusEnum.DECLINED_OFFER:
            return "Declined Offer";
        case CandidateStatusEnum.CANCELLED_OFFER:
            return "Cancelled Offer";
        case CandidateStatusEnum.BANNED:
            return "Banned";
        default:
            return status; // Return the status as it is if no formatting is required
    }
};

export const formatCandidateGender = (gender: GenderEnum | string): string => {
    switch (gender) {
        case GenderEnum.MALE:
            return "Male";
        case GenderEnum.FEMALE:
            return "Female";
        case GenderEnum.OTHERS:
            return "Others";
        default:
            return gender; // Return the gender as it is if no formatting is required
    }
    ;

}
export const formatHighestLevel = (highestLevel: HighestLevelEnum | string): string => {
    switch (highestLevel) {
        case HighestLevelEnum.HIGH_SCHOOL:
            return "High School";
        case HighestLevelEnum.BACHELOR_DEGREE:
            return "Bachelor's Degree"
        case HighestLevelEnum.MASTER_DEGREE:
            return "Master's Degree";
        case HighestLevelEnum.PHD:
            return "PhD";
        default:
            return highestLevel;
    }
    ;

}

export const getColorByStatus = (status: CandidateStatusEnum | string): string => {
    switch (status) {
        case CandidateStatusEnum.OPEN:
        case CandidateStatusEnum.WAITING_FOR_INTERVIEW:
            return "primary"; // Example color for open/waiting statuses
        case CandidateStatusEnum.CANCELLED_INTERVIEW:
        case CandidateStatusEnum.FAILED_INTERVIEW:
        case CandidateStatusEnum.REJECTED_OFFER:
        case CandidateStatusEnum.BANNED:
            return "danger"; // Example color for negative statuses
        case CandidateStatusEnum.PASSED_INTERVIEW:
        case CandidateStatusEnum.WAITING_FOR_APPROVAL:
        case CandidateStatusEnum.APPROVED_OFFER:
        case CandidateStatusEnum.ACCEPTED_OFFER:
            return "success"; // Example color for positive statuses
        case CandidateStatusEnum.WAITING_FOR_RESPONSE:
            return "warning"; // Example color for pending/restricted statuses
        default:
            return "primary"; // Default color for unknown statuses
    }
};

// format status user

export const formatUserStatus = (status: UserStatusEnum | string): string => {
    switch (status) {
        case UserStatusEnum.ACTIVE:
            return "Active";
        case UserStatusEnum.INACTIVE:
            return "Inactive";
        default:
            return status; // Return the status as it is if no formatting is required
    }
};

export const ToggleUserActive = (status: UserStatusEnum | string): string => {
    switch (status) {
        case UserStatusEnum.ACTIVE:
            return "De-activate";
        case UserStatusEnum.INACTIVE:
            return "Activate";
        default:
            return status; // Return the status as it is if no formatting is required
    }
};
export const getColorToggleUserActive = (status: UserStatusEnum | string): string => {
    switch (status) {
        case UserStatusEnum.ACTIVE:
            return "warning"; // Example color for open/waiting statuses
        case UserStatusEnum.INACTIVE:
            return "primary"; // Example color for negative statuses
        default:
            return "primary"; // Default color for unknown statuses
    }
};


export const getColorByUserStatus = (status: UserStatusEnum | string): string => {
    switch (status) {
        case UserStatusEnum.ACTIVE:
            return "primary"; // Example color for open/waiting statuses
        case UserStatusEnum.INACTIVE:
            return "danger"; // Example color for negative statuses
        default:
            return "primary"; // Default color for unknown statuses
    }
};

//formatUserGender
export const formatUserGender = (gender: UserGenderEnum | string): string => {
    switch (gender) {
        case UserGenderEnum.MALE:
            return "Male";
        case UserGenderEnum.FEMALE:
            return "Female";
        default:
            return gender; // Return the gender as it is if no formatting is required
    }
}

export const getColorByInterviewStatus = (status: UserStatusEnum | string): string => {
    switch (status) {
        case InterviewStatusEnum.NEW:
            return "primary"; // Example color for open/waiting statuses
        case InterviewStatusEnum.INVITED:
            return "success"; // Example color for negative statuses
        case InterviewStatusEnum.INTERVIEWED:
            return "secondary"; // Example color for negative statuses
        default:
            return "danger"; // Default color for unknown statuses
    }
};

//formatUserGender
export const formatInterviewStatus = (status: InterviewStatusEnum | string): string => {
    switch (status) {
        case InterviewStatusEnum.NEW:
            return "New";
        case InterviewStatusEnum.INTERVIEWED:
            return "Interviewed";
        case InterviewStatusEnum.INVITED:
            return "Invited";
        case InterviewStatusEnum.CANCELLED:
            return "Cancelled";
        case InterviewStatusEnum.CLOSED:
            return "Closed";
        default:
            return status;
    }
}

//formatUserGender
export const formatInterviewResult = (status: InterviewResultEnum | string): string => {
    switch (status) {
        case InterviewResultEnum.PASSED:
            return "Passed";
        case InterviewResultEnum.FAILED:
            return "Failed";
        default:
            return status;
    }
}


export const getColorByJobStatus = (status: UserStatusEnum | string): string => {
    switch (status) {
        case JobStatusEnum.DRAFT:
            return "warning"; // Example color for open/waiting statuses
        case JobStatusEnum.CLOSE:
            return "default"; // Example color for negative statuses
        case JobStatusEnum.OPEN:
            return "primary"; // Example color for negative statuses
        default:
            return "default"; // Default color for unknown statuses
    }
};

//formatUserGender
export const formatJobStatus = (status: InterviewStatusEnum | string): string => {
    switch (status) {
        case JobStatusEnum.DRAFT:
            return "Draft"; // Example color for open/waiting statuses
        case JobStatusEnum.CLOSE:
            return "Close"; // Example color for negative statuses
        case JobStatusEnum.OPEN:
            return "Open"; // Example color for negative statuses
        default:
            return ""; // Default color for unknown statuses
    }
}

export const getColorByOfferStatus = (status: OfferStatusEnum | string): string => {
    switch (status) {
        case OfferStatusEnum.CANCELLED:
        case OfferStatusEnum.DECLINED_OFFER:
        case OfferStatusEnum.REJECTED_OFFER:
            return "danger"; // Example color for negative statuses
        case OfferStatusEnum.ACCEPTED_OFFER:
            return "success"; // Example color for positive statuses
        case OfferStatusEnum.APPROVED_OFFER:
            return "primary"; // Example color for positive statuses
        case OfferStatusEnum.WAITING_FOR_RESPONSE:
        case OfferStatusEnum.WAITING_FOR_APPROVAL:
            return "warning"; // Example color for pending/restricted statuses
        default:
            return "primary"; // Default color for unknown statuses
    }
};

//formatUserGender
export const formatOfferStatus = (status: InterviewStatusEnum | string): string => {
    switch (status) {
        case OfferStatusEnum.ACCEPTED_OFFER:
            return "Accepted offer"; // Example color for open/waiting statuses
        case OfferStatusEnum.APPROVED_OFFER:
            return "Approved offer"; // Example color for negative statuses
        case OfferStatusEnum.CANCELLED:
            return "Cancelled"; // Example color for negative statuses
        case OfferStatusEnum.DECLINED_OFFER:
            return "Declined offer"; // Example color for negative statuses
        case OfferStatusEnum.REJECTED_OFFER:
            return "Rejected offer"; // Example color for negative statuses
        case OfferStatusEnum.WAITING_FOR_RESPONSE:
            return "Waiting for response"; // Example color for negative statuses
        case OfferStatusEnum.WAITING_FOR_APPROVAL:
            return "Waiting for approval"; // Example color for negative statuses
        default:
            return ""; // Default color for unknown statuses
    }
}
export const formatContractType = (status: InterviewStatusEnum | string): string => {
    switch (status) {
        case OfferContractTypeEnum.ONE_YEAR:
            return "One year"; // Example color for open/waiting statuses
        case OfferContractTypeEnum.THREE_YEAR:
            return "Three year"; // Example color for negative statuses
        case OfferContractTypeEnum.TRAINEE_3_MONTHS:
            return "Trainee 3 months"; // Example color for negative statuses
        case OfferContractTypeEnum.TRIAL_2_MONTHS:
            return "Trial 2 months"; // Example color for negative statuses
        case OfferContractTypeEnum.UNLIMITED:
            return "Unlimited"; // Example color for negative statuses
        default:
            return ""; // Default color for unknown statuses
    }
}
