import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { getCommands } from '@/constants/commands';

interface VoiceCommandModalProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export default function VoiceCommandModal({
  onOpenChange,
  open,
}: VoiceCommandModalProps) {
  const commands = getCommands(true);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[350px] z-[999999] rounded-2xl max-h-[80vh] h-auto bg-background  flex flex-col px-2">
        <div className="flex flex-col text-center gap-3 px-5 items-center">
          <h1 className="text-xl font-semibold">Voice Commands</h1>
          <p className="w-full text-grayscale-dark text-sm font-normal">
            Use these commands to interact with the system
          </p>
          <ul className="flex flex-col text-left w-full mt-3 gap-2">
            {commands.map((cmd, index) => (
              <li key={index} className="flex items-start gap-3 text-sm">
                <Image src={cmd.src} alt="icon" width={20} height={20} />
                <span>{cmd.text}</span>
              </li>
            ))}
          </ul>
          <Button
            variant="nohover"
            onClick={() => onOpenChange(false)}
            className="h-12 mt-3 rounded-sm w-full">
            Okay
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
