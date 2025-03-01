export default function UILayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="container mx-auto md:py-4 md:px-6 lg:px-14 pb-10">
      {children}
    </main>
  );
}
