import Image from 'next/image';

import { decodeToken, validateInvite } from '@/app/serverActions/candidate';
import ErrorDisplay from '@/components/ErrorDisplay';
import ExpiredInviteCard from '@/components/ExpiredInviteCard';
import MobileFooter from '@/components/MobileFooter';
import { Card } from '@/components/ui/card';
import { isErrorResponse } from '@/lib/error-handling';

import SendOTPForm from './sendOTPForm';

type TokenVerificationProps = {
  params: {
    token: string;
  };
};

export default async function TokenVerification({
  params,
}: TokenVerificationProps) {
  const { token } = params;
  const tokenResponse = await decodeToken(token);
  if (tokenResponse?.error) {
    return <ErrorDisplay error={tokenResponse.error} />;
  }
  const candidateToken = tokenResponse?.data?.candidate_token as string;
  const inviteResponse = await validateInvite(candidateToken);
  if (isErrorResponse(inviteResponse)) {
    if (inviteResponse.status === 403) {
      return (
        <div className="h-screen flex items-center justify-center">
          <ExpiredInviteCard message={inviteResponse.message as string} />;
        </div>
      );
    }
    return <ErrorDisplay error={inviteResponse} />;
  }

  const { candidate_email, candidate_uid } = inviteResponse?.data || {};

  return (
    <>
      <Card className="h-fit-content hidden md:block shadow-none border-none w-full tablet-lg:p-6 p-3 bg-[#F7F7F7]  ">
        <Card className="h-full flex items-center max-h-fit-content  overflow-hidden shadow-custom justify-center border-none w-full bg-background  ">
          <div className="w-1/2 h-full min-h-fit-content overflow-hidden tablet-lg:block hidden">
            <Image
              src="/assets/images/interviewOnLaptop.svg"
              alt="interview on laptop"
              layout="responsive"
              width={100}
              height={100}
              className="object-contain"
              priority
              placeholder="blur"
              blurDataURL="/assets/images/interviewOnLaptop-blur.svg"
            />
          </div>
          <div className="w-full tablet-lg:w-1/2 min-h-fit-content flex items-center justify-center p-6 md:p-10 xl:p-20">
            <SendOTPForm
              candidate_email={candidate_email as string}
              candidate_uid={candidate_uid as number}
            />
          </div>
        </Card>
      </Card>

      <div className="h-full md:hidden block w-full">
        <div className="flex items-center bg-primary-dodger-light justify-center p-8">
          <Image
            src="/assets/images/logo-frame-mobile.svg"
            alt="log-frame-mobile"
            width={286}
            height={243}
          />
        </div>
        <div className="container mx-auto p-4 sm:px-6 lg:px-14">
          <SendOTPForm
            candidate_email={candidate_email as string}
            candidate_uid={candidate_uid as number}
          />
        </div>
        <MobileFooter />
      </div>
    </>
  );
}
