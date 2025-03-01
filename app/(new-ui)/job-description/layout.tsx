import JobProfileCardMobile from '@/components/JobProfileCardMobile';

export default function UILayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <JobProfileCardMobile />
      {children}
    </div>
  );
}
