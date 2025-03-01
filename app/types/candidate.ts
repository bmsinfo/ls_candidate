declare type SendOTPFormType = {
  candidate_email: string;
  candidate_uid: number;
};

declare type ValidateInviteResponse = {
  data: {
    candidate_email: string;
    candidate_uid: number;
  };
};

declare type sendOTPResponse = {
  data: {
    message: string;
  };
};

declare type VerifyOTPType = {
  email: string;
  otp: string;
  candidate_uid: number;
};

declare type SocialMediaTupe = {
  candidate_id: number;
  job_posting_id: number;
  linkedin: string | null;
  github: string | null;
  facebook: string | null;
  stackoverflow: string | null;
  certificates: any;
};

declare type PreScreeningResponse = {
  status: 'success' | 'error';
  detail: string;
};

declare type SearchParamProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

declare type DetailInterface = {
  interview_status: string;
  job_title: string;
  job_description: string;
  flow_type: string;
  intro_message: string;
  role_description: string;
  jobposting_id: number;
  candidate_id: number;
  candidate_first_name: string;
  candidate_last_name: string;
  candidate_level: string;
  session_id: number;
  n_questions: number;
  n_followup_questions: number;
  test_time: number;
  question_ids: number[];
  asked_question_ids: number[];
  should_ask_fitment_questions: boolean;
  fitment_questions: any[];
  currency: string;
  company_name: string;
  company_logo_url: string;
  company_favicon_url: string;
  subscription_plan_details: object;
  avatar: boolean;
};

declare type QuestionType = {
  label: string;
  value: string;
};

declare type FitmentQuestion = {
  id: string;
  tag: string;
  name: string;
  type: string;
  question: string;
  isEditable: boolean;
  question_type: QuestionType;
};

declare type SubscriptionPlanDetails = {
  ai_questions: boolean;
  speech_to_text: boolean;
  ai_interview_report: boolean;
  advanced_proctoring: boolean;
  candidate_proxy_matching: boolean;
  avatar: boolean;
  whitelabel: boolean;
};

declare type InterviewInterface = {
  isResumingInterview: boolean | null;
  job_posting_uid: string | null;
  candidate_uid: string | null;
  session_uid: string | null;
  question_uids: string[];
  asked_question_uids: string[];
  job_title: string;
  job_description: string;
  flow_type:
    | 'ONLY_INTERVIEW_WEB'
    | 'ONLY_INTERVIEW_WA'
    | 'ALL_WEB'
    | 'ALL_WA'
    | 'WA_WEB'
    | 'ONLY_PRESCREENING_WA'
    | 'SURVEY'
    | null;
  intro_message: string;
  role_description: string;
  candidate_short_name: string;
  candidate_full_name: string;
  candidate_level: string;
  prescreening_status: 'IN_PROGRESS' | 'PASSED' | 'FAILED' | null;
  interview_status: string;
  n_questions: number;
  n_followup_questions: number;
  test_time: number;
  currency: string;
  org_name: string;
  org_logo_url: string;
  org_favicon_url: string;
  avatar: 'SITEPAL' | 'HEYGEN' | 'NONE';
};

declare type VerifyOTPResponseInterface = {
  status: 'success' | 'failure';
  detail: InterviewInterface;
};

declare type ErrorResponse = {
  success: boolean;
  error: string;
};
