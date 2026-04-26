export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F5F5F4] px-4">
      {children}
    </main>
  );
}
