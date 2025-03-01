export interface VerifyOTPResponseInterface {
  status: string;
  detail: InterviewInterface | string;
}

export interface InterviewInterface {
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
}

export interface FitmentQuestion {
  id: string;
  tag: string;
  name: string;
  type: string;
  question: string;
  isEditable: boolean;
  question_type: QuestionType;
}

export interface QuestionType {
  label: string;
  value: string;
}

export interface SubscriptionPlanDetails {
  ai_questions: boolean;
  speech_to_text: boolean;
  ai_interview_report: boolean;
  advanced_proctoring: boolean;
  candidate_proxy_matching: boolean;
  avatar: boolean;
  whitelabel: boolean;
}

export interface SessionInterface {
  session_uid?: string;
  cheating_monitoring_details?: object;
  last_submitted_at?: string;
  session_started_at?: string | Date;
  session_ended_at?: string | Date;
}

export interface SessionResponseInterface {
  id: number;
  candidate_name: string;
  job_title: string;
  interview_status: string;
  flow_type: string;
  ats_sid: null | string;
  ats_updates: any[];
  session_started_at: string;
  session_ended_at: null | string;
  last_submitted_at: string;
  session_report: null | string;
  session_candidate_selfie_url: null | string;
  session_report_pdf_url: null | string;
  communication_skills_level: null | string;
  session_average_accuracy: string;
  session_invite_sent: boolean;
  session_score: string;
  cheating_monitoring: object;
  video_recording_data: any[];
  is_deleted: boolean;
}

export interface SitePalProps {
  embed: string;
  sayAudio: string[] | null;
  sayText: string[] | null;
  setFacialExpression: string[] | null;
  setIdleMovement: string[] | null;
  setSpeechMovement: string[] | null;
  followCursor: string[] | null;
  freezeToggle: string[] | null;
  recenter: string[] | null;
  setGaze: string[] | null;
  clearExpressionList: string[] | null;
  setBlinking: string[] | null;
  loadAudio: string[] | null;
  loadText: string[] | null;
  sayAI: string[] | null;
  saySilent: string[] | null;
  setPlayerVolume: string[] | null;
  stopSpeech: string[] | null;
  replay: string[] | null;
  getSceneAttributes: string[] | null;
  setBackground: string[] | null;
  setBackgroundColor: string[] | null;
  setColor: string[] | null;
  setStatus: string[] | null;
  dynamicResize: string[] | null;
  is3D: string[] | null;
  overlayOpen: string[] | null;
  overlayClose: string[] | null;
  loadSceneByID: string[] | null;
  unloadScene: string[] | null;
  selectPortal: string[] | null;
}

export interface QuestionInterface {
  uid: string;
  question: string;
  question_type: 'DESCRIPTIVE' | 'MULTIPLE_CHOICE' | 'CODING';
  is_asked: boolean;
  is_followup: boolean;
  answer: any;
  options?: any;
  asked_at: string;
  answered_at: string;
}

export interface AnswerResponseInterface {
  status: 'success' | 'error';
  followup: boolean;
  followup_question_uid: string;
}

interface SessionJobCandidateInterface {
  candidate_id: number;
  session_id: number;
  jobposting_id: number;
}

export interface QuestionIdInterface extends SessionJobCandidateInterface {
  question_id: number;
}

export interface AnswerInterface {
  answer: string;
  uid: string;
}

export interface CustomEventInterface extends Event {
  detail?: {
    isAvatarSpeaking?: 'NOT_SPEAKING' | 'SPEAKING' | 'IDLE';
  };
}

export interface fetchNextQuestionByIdUntilGetQuestionInterface {
  question: QuestionInterface;
  questionIds: string[];
  error?: string;
  success?: boolean;
  message?: string;
}
