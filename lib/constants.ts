export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
export const FRONTEND_HOSTED_URL = process.env.NEXT_PUBLIC_FRONTEND_HOSTED_URL;
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL as string;

export const TOKEN_SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;
export const GEOPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOPIFY_API_KEY;

// sitepal constants
export const SITEPAL_ACCOUNT_ID = process.env.NEXT_PUBLIC_SITEPAL_ACCOUNT_ID;
export const SITEPAL_EMBED_ID = process.env.NEXT_PUBLIC_SITEPAL_EMBED_ID;
export const SITEPAL_SCENE_ID = process.env.NEXT_PUBLIC_SITEPAL_SCENE_ID;
export const SITEPAL_VOICE = 6;
export const SITEPAL_LANG = 1;
export const SITEPAL_ENGINE = 7;

// heygen constants
export const HEYGEN_API_KEY = process.env.NEXT_PUBLIC_HEYGEN_API_KEY;
export const HEYGEN_AVATAR_ID = process.env.NEXT_PUBLIC_HEYGEN_AVATAR_ID;
export const HEYGEN_VOICE_ID = process.env.NEXT_PUBLIC_HEYGEN_VOICE_ID;
export const HEYGEN_VOICE_EMOTION = process.env.HEYGEN_VOICE_EMOTION;

// cookies
export const COOKIE_OTP_TOKEN = 'nw-opt-token';
export const COOKIE_SESSION_TOKEN = 'nw-session-token';

// localstorage keys
export const NO_TIME_USER_LEAVE_CURRENT_TAB = 'ls-ntulct'; //ls-no-time-user-leave-current-tab;
export const TIME_SPENT_OUTSIDE_CURRENT_TAB = 'ls-tsoct'; //ls-time-spent-outside-current-tab
export const TIMER_KEY = 'ls-t'; //ls-timer

export const WEB_APP_VERSION = process.env.NEXT_PUBLIC_WEB_APP_VERSION;

export const PROFILES = 'profiles';
export const FITMENT = 'fitment';

// candidate social media links
export const LINKEDIN = 'linkedin';
export const GITHUB = 'github';
export const FACEBOOK = 'facebook';
export const STACKOVERFLOW = 'stackoverflow';
export const ANSWER = 'answer';
export const CERTIFICATES = 'certificates';

// Flow Type:
export const ONLY_INTERVIEW_WEB = 'ONLY_INTERVIEW_WEB';
export const ONLY_INTERVIEW_WA = 'ONLY_INTERVIEW_WA';
export const ALL_WEB = 'ALL_WEB';
export const WA_WEB = 'WA_WEB';
export const ALL_WA = 'ALL_WA';
export const ONLY_PRESCREENING_WA = 'ONLY_PRESCREENING_WA';
export const SURVEY = 'SURVEY';

// Interview Status:
export const PENDING = 'PENDING';
export const INVITE_SENT = 'INVITE_SENT';
export const INTERVIEW_GIVEN = 'INTERVIEW_GIVEN';

// Prescreening:
export const PRE_SCREENING_IN_PROGRESS = 'IN_PROGRESS';
export const PRE_SCREENING_PASSED = 'PASSED';
export const PRE_SCREENING_FAILED = 'FAILED';

// Question Type:
export const QUESTION_TYPE_DESCRIPTIVE = 'DESCRIPTIVE';
export const QUESTION_TYPE_MULTIPLE_CHOICE = 'MULTIPLE_CHOICE';
export const QUESTION_TYPE_CODING = 'CODING';

export const WIDTH = 400;
export const HEIGHT = 400;

export const INTER_COLOR = '#FB607F';
export const INTER_LIGHT_COLOR = '#000000';
export const ALERT_COLOR = '#614344';
// path
export const JOB_DESCRIPTION_PAGE = '/candidate/interview/job-description';
export const FITMENT_QUESTION_PAGE = '/candidate/fitment-questions';
export const WEB_CAM_PAGE = '/candidate/interview/web-cam';
export const ABOUT_TO_START_PAGE =
  '/candidate/interview/about-to-start-interview';

export const REMAINING_TEST_TIME = 'remaining_test_time';

export enum AvatarMode {
  NONE = 'NONE', // free plan
  SITEPAL = 'SITEPAL', // basic plan
  HEYGEN = 'HEYGEN', // premium plan
}

export const INTERVIEW_ROUTES = {
  [AvatarMode.NONE]: '/interview/v0', // no avatar
  [AvatarMode.SITEPAL]: '/interview/v1', // sitepal
  [AvatarMode.HEYGEN]: '/interview/v1', // heygen
};
