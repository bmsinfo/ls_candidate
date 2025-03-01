'use client';

import { useStore } from '@/app/store/store';

const FaviIcon = () => {
  const orgFaviconUrl = useStore((state) => state.interview.org_favicon_url);
  const fallbackUrl = '/icons/company.svg';

  return (
    <>
      <link
        rel="icon"
        href={orgFaviconUrl || fallbackUrl}
        type="image/x-icon"
        key="favicon"
      />
      <link
        rel="apple-touch-icon"
        href={orgFaviconUrl || fallbackUrl}
        key="apple-touch-icon"
      />
    </>
  );
};
export default FaviIcon;
