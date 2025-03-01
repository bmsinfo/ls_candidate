'use client';

import { useState } from 'react';

// import TermsAndConditions from '../../../(pre-screening)/terms-conditions/_components/TermsAndCondition';
import SendOTPForm from '../sendOTPForm';

type MultiStepComponentProps = {
  candidateEmail: string;
  candidateId: number;
};

export default function MultiStepComponent({
  candidateEmail,
  candidateId,
}: MultiStepComponentProps) {
  const [step, setStep] = useState(1);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);

  const handleAcceptTerms = () => {
    setIsTermsAccepted(true);
    setStep(2);
  };

  const renderStepContent = () => {
    if (isTermsAccepted) {
      return (
        <SendOTPForm
          candidate_email={candidateEmail}
          candidate_uid={candidateId}
        />
      );
    }

    switch (step) {
      case 1:
        return (
          <SendOTPForm
            candidate_email={candidateEmail}
            candidate_uid={candidateId}
          />
        );
      case 2:
      // return <TermsAndConditions />;

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex-col flex items-center justify-center ">
        {renderStepContent()}
      </div>
    </div>
  );
}
