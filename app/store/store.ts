import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { sanitizeToText } from '@/lib/sanitize';
import { secureStorage } from '@/lib/secure-storage';

import { InterviewInterface, QuestionInterface } from '../types/interview';

export type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';

export type User = {
  first_name: string;
  last_name: string;
  company?: number;
};

export type State = {
  user: User | null;
  interview: InterviewInterface;
  isSocialMediaModalOpen: boolean;
  isLoading: boolean;
  isCountDownRunning: boolean;
  currentQuestion: QuestionInterface | null;
  appAskedQuestionIds: number[];
  appQuestionIds: string[];
  appFollowUpQuestionId: number[];
  isLastQuestion: boolean;
  hasErrorInSpeechToText: boolean;
  isScreenWebCamStreaming: boolean;
  isInputAudioDeviceChanged: boolean;
  isWebCamStreamStopped: boolean;
  isScreenStreamStopped: boolean;
  isJobDescriptionPageVisited: boolean;
  isCandidateSelfieCaptured: boolean;
  isTourCompleted: boolean;
  reasonForReload: string | null;
  remainingTime: number;
  remainingTestTime: number;
  isDeegramListening: boolean;
  collpseAnswerSection: boolean;
  isHydrated: boolean;
};

export type Actions = {
  //   dragTask: (id: string | null) => void;
  //   updateTask: (title: string, status: Status) => void;
  setInterview: (interview: InterviewInterface) => void;
  updateAvatarMode: (val: InterviewInterface['avatar']) => void;
  updateSocialMediaModal: (val: boolean) => void;
  updateLoadingState: (val: boolean) => void;
  startCountDown: () => void;
  stopCountDown: () => void;
  setUser: (user: User) => void;
  logout: () => void;
  addAskedQuestionId: (id: number) => void;
  removeQuestionId: (id: number) => void;
  setFollowUpQuestionId: (id: number) => void;
  setAppQuestionIds: (list: string[]) => void;
  updateCurrentQuestion: (val: QuestionInterface) => void;
  updateLastQuestion: (val: boolean) => void;
  updateSpeechToTextStatus: (value: boolean) => void;
  updateResumingStatusStatus: (value: boolean) => void;
  setErrorInSpeechToText: () => void;
  updateScreenWebCamStreaming: (val: boolean) => void;
  updateInputAudioDeviceChanged: (val: boolean) => void;
  toggleWebCamStreamStatus: (val: boolean) => void;
  toggleScreenStreamStatus: (val: boolean) => void;
  markJobDesciptionPageAsVisited: VoidFunction;
  markCandidateSelfieCaptured: () => void;
  markTourAsCompleted: () => void;
  setReasonForReload: (val: string | null) => void;
  setRemainingTime: (val: number) => void;
  updateTestTime: (val: number) => void;
  setDeegramListening: (val: boolean) => void;
  setCollpseAnswerSection: (val: boolean) => void;
  setHydrated: (state: boolean) => void;
};

export const InterviewInitialData = {
  isResumingInterview: null,
  job_posting_uid: null,
  candidate_uid: null,
  session_uid: null,
  question_uids: [],
  asked_question_uids: [],
  job_title: '',
  job_description: '',
  flow_type: null,
  prescreening_status: null,
  intro_message: '',
  role_description: '',
  candidate_short_name: '',
  candidate_full_name: '',
  candidate_level: '',
  interview_status: '',
  n_questions: 0,
  n_followup_questions: 0,
  test_time: 0,
  currency: '',
  org_name: '',
  org_logo_url: '',
  org_favicon_url: '',
  isJobDescriptionPageVisited: false,
  should_ask_fitment_questions: false,
  isCandidateSelfieCaptured: false,
  isTourCompleted: false,
  reasonForReload: null,
  remainingTime: 0,
  avatar: 'NONE' as 'NONE',
  // subscription_plan_details: {
  //   ai_questions: false,
  //   speech_to_text: false,
  //   ai_interview_report: false,
  //   advanced_proctoring: false,
  //   candidate_proxy_matching: false,
  //   avatar: true,
  //   whitelabel: false,
  // },
};

export const useStore = create<State & Actions>()(
  persist(
    (set) => ({
      user: null,
      interview: InterviewInitialData,
      isSocialMediaModalOpen: false,
      isLoading: false,
      isCountDownRunning: false,
      currentQuestion: null,
      appQuestionIds: [], // contains copy of 'resp.detail.question_ids'. These are the questions ids which is not asked yet by filter out the question_ids which are already asked 'resp.detail.asked_question_ids'
      appAskedQuestionIds: [],
      appFollowUpQuestionId: [],
      isLastQuestion: false,
      hasErrorInSpeechToText: false,
      isScreenWebCamStreaming: false,
      isInputAudioDeviceChanged: false,
      isWebCamStreamStopped: false,
      isScreenStreamStopped: false,
      isJobDescriptionPageVisited: false,
      isCandidateSelfieCaptured: false,
      isTourCompleted: false,
      reasonForReload: null,
      remainingTime: 0,
      remainingTestTime: 0,
      isDeegramListening: false,
      collpseAnswerSection: false,
      isHydrated: false,
      setHydrated: (state) => set({ isHydrated: state }),
      setReasonForReload: (val) => set({ reasonForReload: val }),
      setDeegramListening: (val: boolean) => set({ isDeegramListening: val }),
      setCollpseAnswerSection: (val: boolean) =>
        set({ collpseAnswerSection: val }),
      updateTestTime: (val) => set({ remainingTestTime: val }),
      setRemainingTime: (val) => set({ remainingTime: val }),
      markTourAsCompleted: () => set({ isTourCompleted: true }),
      markCandidateSelfieCaptured: () =>
        set({ isCandidateSelfieCaptured: true }),
      markJobDesciptionPageAsVisited: () =>
        set({ isJobDescriptionPageVisited: true }),
      toggleWebCamStreamStatus: (val: boolean) =>
        set({ isWebCamStreamStopped: val }),
      toggleScreenStreamStatus: (val: boolean) =>
        set({ isScreenStreamStopped: val }),
      updateInputAudioDeviceChanged: (val: boolean) =>
        set({ isInputAudioDeviceChanged: val }),
      updateScreenWebCamStreaming: (val: boolean) =>
        set({ isScreenWebCamStreaming: val }),
      updateLastQuestion: (val: boolean) => set({ isLastQuestion: val }),
      setErrorInSpeechToText: () => set({ hasErrorInSpeechToText: true }),

      setInterview: (interview: InterviewInterface) => set({ interview }),
      updateAvatarMode: (val: InterviewInterface['avatar']) =>
        set((state) => ({
          interview: {
            ...state.interview,
            avatar: val,
          },
        })),
      updateSocialMediaModal: (val: boolean) =>
        set({ isSocialMediaModalOpen: val }),
      updateLoadingState: (val: boolean) => set({ isLoading: val }),
      startCountDown: () => set({ isCountDownRunning: true }),
      stopCountDown: () => set({ isCountDownRunning: false }),
      setAppQuestionIds: (list: string[]) => set({ appQuestionIds: list }),
      // TODO: need to wrap the removeQuestionId & addAskedQuestionId to 'updateCurrentQuestion'
      updateCurrentQuestion: (question: QuestionInterface) =>
        set({
          currentQuestion: {
            ...question,
            question: sanitizeToText(question?.question as string),
          },
        }),
      removeQuestionId: (id: number) =>
        set((state) => ({
          appQuestionIds: state.appQuestionIds.filter(
            (qid) => qid !== id.toString(),
          ),
          appAskedQuestionIds: [...state.appAskedQuestionIds, id],
        })),
      addAskedQuestionId: (id: number) =>
        set((state) => ({
          appAskedQuestionIds: [...state.appAskedQuestionIds, id],
        })),

      setFollowUpQuestionId: (id: number) =>
        set((state) => ({
          appAskedQuestionIds: [...state.appAskedQuestionIds, id],
        })),

      setUser: (user) => set({ user }),
      logout: async () => {
        // Perform logout server action
        await fetch('/api/logout', { method: 'POST' });

        // Clear user state
        set({ user: null });
      },

      // removeQuestionId: (id) =>
      //   set((state) => ({
      //     questionIds: state.questionIds.filter((qid) => qid !== id),
      //   })),
      //   draggedTask: null,
      //   addTask: (title: string, description?: string) =>
      //     set((state) => ({
      //       tasks: [
      //         ...state.tasks,
      //         { id: uuid(), title, description, status: "TODO" },
      //       ],
      //     })),
      //   dragTask: (id: string | null) => set({ draggedTask: id }),
      //   removeTask: (id: string) =>
      //     set((state) => ({
      //       tasks: state.tasks.filter((task) => task.id !== id),
      //     })),
      updateSpeechToTextStatus: (value: boolean) =>
        set((state) => ({
          ...state.interview,
          interview: {
            ...state.interview,
            // TODO: will use in future
            // subscription_plan_details: {
            //   ...state.interview?.subscription_plan_details,
            //   speech_to_text: value,
            // },
          },
        })),

      updateResumingStatusStatus: (value: boolean) =>
        set((state) => ({
          ...state.interview,
          interview: {
            ...state.interview,
            isResumingInterview: value,
          },
        })),
    }),
    {
      name: 'ls',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
      storage: createJSONStorage(() =>
        process.env.NODE_ENV === 'production' ? secureStorage : localStorage,
      ),
    },
  ),
);
