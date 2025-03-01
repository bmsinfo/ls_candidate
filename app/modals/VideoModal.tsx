import Image from 'next/image';

import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';

export default function VideoModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Image
          src="/icons/video.svg"
          className="cursor-pointer"
          width={42}
          height={42}
          alt="profile"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] p-0  bg-transparent border-none text-card-foreground  shadow-lg">
        <div className="relative w-full aspect-video">
          <video
            className="w-full h-full object-cover"
            controls
            controlsList="nodownload"
            autoPlay>
            <source src="/assets/videos/intro.mp4" type="video/mp4" />
          </video>
        </div>
        <div></div>
      </DialogContent>
    </Dialog>
  );
}
