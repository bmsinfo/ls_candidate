'use client';

import { useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useStore } from '@/app/store/store';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

import { BrowserInstructions } from '../(new-ui)/permissions/BrowserInstructions';
import PermissionPannel from '../(new-ui)/permissions/PermissionPannel';

export default function ScreenShareDialog() {
  const { push } = useRouter();
  const { org_name } = useStore((state) => state.interview);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const [showInstructions, setShowInstructions] = useState(true);

  const onOpenChange = (value: boolean) => {
    if (!value) {
      setIsAlertOpen(true);
      return;
    }
    setShowInstructions(value);
  };

  return (
    <div className="">
      <Dialog open={showInstructions} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-screen-md max-h-[80vh] h-auto bg-background  space-y-1 flex flex-col px-2 sm:px-10">
          <DialogHeader>
            <DialogTitle className=" text-base  sm:font-24-32-600">
              Share Your Entire Screen
            </DialogTitle>
            <DialogDescription className=" text-sm sm:font-16-20-400">
              The <span className="text-primary">{org_name}</span> site will be
              able to see the contents of your screen.
            </DialogDescription>
          </DialogHeader>

          <div className="w-full h-full overflow-scroll  ">
            <ScrollArea
              id="tour-guide-question"
              className=" h-full w-full  pb-10">
              <div className="gap-4 flex flex-col w-full">
                <div className="flex gap-4">
                  <div className="relative w-full flex-1 flex flex-col justify-start items-start bg-grayscale-light-bg border border-grayscale-mid-highlight rounded-2xl p-4">
                    {/* <Image
                      src="/icons/screen_share.svg"
                      alt={`Screen sharing svg`}
                      className=" h-auto mb-5 sm:mb-20"
                      width={365}
                      height={198}
                    /> */}
                    <BrowserInstructions />
                  </div>

                  <div className="flex w-full flex-[.8] flex-col items-start bg-grayscale-light-bg border border-grayscale-mid-highlight rounded-xl p-2">
                    <PermissionPannel />
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center justify-center">
              <Image
                src="/icons/cross.svg"
                alt="cross Icon"
                width={72}
                height={72}
              />
            </div>
            <AlertDialogDescription>
              <p className="text-center text-grayscale-dark font-roboto text-2xl font-semibold leading-8">
                Are you sure you want to close it?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => push('/')}>Yes</AlertDialogCancel>
            <AlertDialogAction onClick={() => setIsAlertOpen(false)}>
              No
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
