import { useUIStore } from '@/app/store/ui-store';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FITMENT, PROFILES } from '@/lib/constants';

export const ProgressTabs = () => {
  const { isMobile } = useUIStore((state) => state);

  return isMobile ? (
    <TabsList className="grid w-full grid-cols-2">
      <TabsTrigger value={PROFILES}>Add Profile</TabsTrigger>
      <TabsTrigger value={FITMENT}>Prescreening Questions</TabsTrigger>
    </TabsList>
  ) : (
    <TabsList className="flex items-center gap-2 bg-transparent border-none my-5">
      <TabsTrigger
        className="h-6px w-290px rounded-10px bg-primary-dodger-light shadow-none p-0 data-[state=active]:shadow-none data-[state=active]:bg-primary-dodger border-none"
        value={PROFILES}
      />
      <TabsTrigger
        className="h-6px w-290px rounded-10px bg-primary-dodger-light shadow-none p-0  data-[state=active]:shadow-none data-[state=active]:bg-primary-dodger border-none"
        value={FITMENT}
      />
    </TabsList>
  );
};
