import Image from 'next/image';

import { ChevronDownIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';

export default function FAQModal({
  secondaryButton,
}: {
  secondaryButton?: boolean;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {secondaryButton ? (
          <Image
            src="/assets/icons/faq.svg"
            className="cursor-pointer"
            width={42}
            height={42}
            alt="faq button"
          />
        ) : (
          <Button
            variant={'nohover'}
            className="font-20-23-600 rounded h-47px w-85px ">
            FAQ
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] sm:max-w-[425px] overflow-auto remove-scrollbar max-h-[80vh]">
        <DialogHeader>
          {/* // TODO: icons need to be added */}
          <DialogTitle className="text-2xl font-bold">
            Frequently Asked Questions
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Find answers to common questions about our products and services.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-6">
          <Collapsible>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-muted px-4 py-3 text-left font-medium transition-colors hover:bg-muted/50">
              <span className="text-lg font-semibold">
                Do&apos;s and Dont&apos;s
              </span>
              <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 py-3 text-muted-foreground">
              {DOES_NOT_POINTS?.map((point, index) => (
                <p className="mt-1" key={`dos-dont-${index}`}>{`${point}`}</p>
              ))}
            </CollapsibleContent>
          </Collapsible>
          <Collapsible>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-muted px-4 py-3 text-left font-medium transition-colors hover:bg-muted/50">
              <span className="text-lg font-semibold">
                Mic not working or speech to text not working ?
              </span>
              <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 py-3 text-muted-foreground">
              {MICROPHONE_POINTS?.map((point, index) => (
                <p className="mt-1" key={`microphone-${index}`}>{`${point}`}</p>
              ))}
            </CollapsibleContent>
          </Collapsible>
          <Collapsible>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-muted px-4 py-3 text-left font-medium transition-colors hover:bg-muted/50">
              <span className="text-lg font-semibold">
                Unable to take selfie or camera error or camera not working?
              </span>
              <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 py-3 text-muted-foreground">
              {CAMERA_POINTS?.map((point, index) => (
                <p className="mt-1" key={`camera-${index}`}>{`${point}`}</p>
              ))}
            </CollapsibleContent>
          </Collapsible>
          <Collapsible>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-muted px-4 py-3 text-left font-medium transition-colors hover:bg-muted/50">
              <span className="text-lg font-semibold">
                Voice of the virtual interviewer is suddenly lost or you are
                unable to hear?
              </span>
              <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 py-3 text-muted-foreground">
              {VIRTUAL_POINTS?.map((point, index) => (
                <p className="mt-1" key={`voice-${index}`}>{`${point}`}</p>
              ))}
            </CollapsibleContent>
          </Collapsible>
          <Collapsible>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md bg-muted px-4 py-3 text-left font-medium transition-colors hover:bg-muted/50">
              <span className="text-lg font-semibold">Submit not working?</span>
              <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 py-3 text-muted-foreground">
              {SUBMIT_POINTS?.map((point, index) => (
                <p className="mt-1" key={`submit-${index}`}>{`${point}`}</p>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
        <DialogFooter>
          <div>
            <DialogClose asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const DOES_NOT_POINTS = [
  'a). Recommended to use browsers Chrome and Edge for a good user experience.',
  `b). If at any point in time-there is a session hang or unresponsiveness-just try below:`,
  `   Refresh icon on the question to the right can be used.If it does not resolve-close the browser.Again open the interview link in a new browser and restart the interview`,
  `c). In general at any point in time-the questions can be viewed through the icons provided on the right side(using speech to text),refresh or play button`,
  `d). The background while giving interview needs to be maintained as much as plain with good source of light and candidate should be visible during the entirety of the interview.`,
  `e). Internet speed should be overall good to avoid slowness and glitches`,
  `f). If the camera shutter is closed /no camera images are seen-then it shall be regarded as an identity manipulation`,
  `g). Use the support details provided in the welcome email for any queries that you may have`,
  'h). Never try to reload the whole page.',
];

const MICROPHONE_POINTS = [
  'a). Check if browser setting"Allow microphone" is enabled at the start of the interview.',
  'b). If problem still persists post enabling microphone setting-kindly go to the browser settings- search for "mic" in the textbox and ensure that mic is allowed or enabled for the site in use .If not,then enable it and reopen the browser.Reload the interview.',
  `c). As a workaround-you may choose to answer the question by typing your responses and clicking on 'Submit.'`,
];

const CAMERA_POINTS = [
  'a). Check if browser setting "Allow webcam or camera" is enabled at the start of the interview.',
  'b). If problem still persists post enabling microphone setting-kindly go to the browser settings search for "camera" in the textbox and ensure that camera is allowed or enabled for the site in use .If not,then enable it and reopen the browser.Reload the interview.',
];

const SUBMIT_POINTS = [
  'a). If you are saying "Submit" or "Submit answer" and it is not yet submitting then click on  Submit button manually.',
  'b). After every submit-you will get a response that "Your answer submitted" which should be a verification that its submitted.',
  'c). If problem persists-try to refresh the question through refresh icon and again submitting answer.',
];

const VIRTUAL_POINTS = [
  'a). Check by doing a refresh on the question and see if the sound returns.If this does not work,try step b',
  'b). Playback the same question and provide answer using mic and saying Submit answer.',
  'c). If problem persists-use voice to text conversion icon,read the question and answer through typing on the screen and send submit.',
];
