import React, { useRef } from 'react';

import { useStore } from '@/app/store/store';

import { DesktopHeader } from './DesktopHeader';
import { MobileHeader } from './MobileHeader';
import { WebCamWrapperRef } from './WebCamWrapper';

const InterviewHeader = () => {
  const webCamReference = useRef<WebCamWrapperRef | null>(null);

  const { org_name, org_logo_url, job_title, avatar } = useStore(
    (state) => state.interview,
  );

  return (
    <div id="interview-header">
      <MobileHeader
        orgName={org_name}
        orgLogoUrl={org_logo_url}
        jobTitle={job_title}
        avatar={avatar}
        webCamReference={webCamReference}
      />

      <DesktopHeader
        orgName={org_name}
        orgLogoUrl={org_logo_url}
        jobTitle={job_title}
      />
    </div>
  );
};

InterviewHeader.displayName = 'InterviewHeader';

export default React.memo(InterviewHeader);
