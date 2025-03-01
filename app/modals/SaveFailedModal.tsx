import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface SaveFailedModalProps {
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export default function SaveFailedModal({
  onOpenChange,
  open,
}: SaveFailedModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[350px] rounded-2xl max-h-[80vh] p-0 h-auto bg-background  flex flex-col">
        <Image
          src="/assets/images/sadPerson.svg"
          alt="happy person"
          className="w-full h-auto mt-5"
          width={100}
          height={100}
        />
        <div className="flex flex-col text-center gap-3 p-5 items-center">
          <h1 className="text-xl font-semibold">Save Failed. </h1>

          <p className="w-full text-grayscale-dark text-sm font-normal">
            Unable to save your response at the moment. Please retry.
          </p>

          <Button variant="nohover" className="h-12 mt-3 rounded-sm w-full">
            Try Again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
