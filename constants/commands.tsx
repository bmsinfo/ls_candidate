type Command = {
  src: string;
  text: React.ReactNode | string;
};

const basicCommands: Command[] = [
  {
    src: '/icons/submit.svg',
    text: <span>Say &apos;Submit Answer&apos; to submit your responds</span>,
  },

  {
    src: '/icons/clear.svg',
    text: <span>Say &apos;Clear Answer&apos; to clear the answer. </span>,
  },
];

const avatarCommands: Command[] = [
  {
    src: '/icons/repeat2.svg',
    text: <span>Say &apos;Repeat Answer&apos; to Hear the answer.</span>,
  },
  {
    src: '/icons/repeat2.svg',
    text: (
      <span> Say &apos;Repeat Question&apos; to hear the question again</span>
    ),
  },
];

export const getCommands = (hasAvatar: boolean) => {
  return hasAvatar ? [...basicCommands, ...avatarCommands] : basicCommands;
};
