import { RingLodderIcon } from './ui/icons';

const RingLoader = ({ text }: { text?: string }) => {
  const msg = text ?? 'Loading ...';

  return (
    <div className=" z-20 bg-background bg-opacity-60 flex-col absolute inset-0 flex items-center justify-center  h-screen w-screen">
      <RingLodderIcon className=" size-20" color="#307BF7" />
      <p className="mt-2">{msg}</p>
    </div>
  );
};

export default RingLoader;
