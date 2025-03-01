import React from 'react';

import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { RingLodderIcon } from '@/components/ui/icons';

import { useStore } from '../store/store';

export type PermissionStatus = 'pending' | 'granted' | 'denied';

interface MobilePermissionModalProps {
  type: 'camera' | 'microphone';
  hasError: string;
  isRequestingMedia: boolean;
  onRequestPermission: () => Promise<void>;
}

const ICONS = {
  camera: '/assets/images/cameraShare.svg',
  microphone: '/assets/images/micShare.svg',
};

export const MobilePermissionModal: React.FC<MobilePermissionModalProps> = ({
  type,
  hasError,
  isRequestingMedia,
  onRequestPermission,
}) => {
  const { org_name } = useStore((state) => state.interview);
  const title = `Allow ${type.charAt(0).toUpperCase() + type.slice(1)} Access ?`;
  const description = `${org_name} needs access to your ${type} for this feature. You can disable it anytime in settings.`;

  return (
    <Dialog open defaultOpen onOpenChange={() => {}}>
      <DialogContent className="max-w-[350px] rounded-2xl max-h-[80vh] h-auto bg-background  flex flex-col px-2">
        <div className="flex flex-col text-center gap-3 px-5 items-center">
          <Image
            src={ICONS[type]}
            alt={`${type} share`}
            width={100}
            height={100}
          />
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="w-full text-grayscale-dark text-sm font-normal">
            {description}
          </p>

          {hasError && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 w-full">
              Permission was denied. Please enable it in your browser settings
              and try again.
            </div>
          )}

          <Button
            variant="nohover"
            onClick={onRequestPermission}
            disabled={isRequestingMedia}
            className="h-12 font-20-24-600 flex items-center gap-1 rounded-sm w-full">
            Continue {isRequestingMedia && <RingLodderIcon />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
