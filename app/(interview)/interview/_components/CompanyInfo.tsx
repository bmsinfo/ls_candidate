import React from 'react';

import { ImageWithFallback } from '@/components/ImageWithFallback';

interface CompanyInfoProps {
  orgName: string;
  orgLogoUrl: string | null;
}

export const CompanyInfo: React.FC<CompanyInfoProps> = ({
  orgName,
  orgLogoUrl,
}) => (
  <div className="flex items-center gap-2">
    <ImageWithFallback
      src={orgLogoUrl ?? '/icons/company.svg'}
      fallbackSrc="/icons/company.svg"
      width={32}
      height={32}
      alt={`${orgName} logo`}
    />
    <h3 className="font-20-24-700 text-blue-dark-electric">{orgName}</h3>
  </div>
);
