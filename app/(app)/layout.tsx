import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AppSidebar from "@/components/app/AppSidebar";
import PageRemounter from "@/components/app/PageRemounter";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="flex min-h-screen bg-[#F5F5F4]">
      <AppSidebar user={user} />
      <PageRemounter>{children}</PageRemounter>
    </div>
  );
}
