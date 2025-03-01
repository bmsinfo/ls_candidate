import React from 'react';

import Image from 'next/image';

import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface PermissionControlProps {
  icon: string;
  label: string;
  isEnabled: boolean;
  onToggle: () => void;
  classNames?: string;
  error?: string;
}

export function PermissionControl({
  icon,
  label,
  isEnabled,
  onToggle,
  classNames,
  error,
}: PermissionControlProps) {
  return (
    <div className="space-y-1  w-full">
      <div className="flex items-center justify-between w-full py-2 px-4  rounded-lg">
        <div className="flex items-center gap-3">
          <Image src={icon} alt={label} width={40} height={40} />
          <span className="font-medium">{label}</span>
        </div>
        <Switch checked={isEnabled} onCheckedChange={onToggle} />
      </div>
      {error && <p className="text-sm text-red-600 px-4">{error}</p>}
    </div>
  );
}
