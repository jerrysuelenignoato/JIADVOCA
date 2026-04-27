"use client";

import { usePathname } from "next/navigation";

export default function PageRemounter({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <div key={pathname} className="flex-1 overflow-auto">{children}</div>;
}
