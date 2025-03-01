import { useStore } from '@/app/store/store';

const useRequiredData = () => {
  const { candidate_uid, job_posting_uid, session_uid } = useStore(
    (state) => state.interview,
  );
  const hasRequiredData = candidate_uid && job_posting_uid && session_uid;
  return { hasRequiredData };
};

export default useRequiredData;
