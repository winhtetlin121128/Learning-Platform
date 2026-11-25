import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { getViewer } from "@/lib/data";
import { AdminSidebar } from "./admin-sidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getViewer();
  if (!viewer) redirect("/auth/sign-in");
  if (!process.env.DATABASE_URL) redirect("/profile");

  const [profile] = await getDb().select({ role: users.role }).from(users).where(eq(users.id, viewer.id)).limit(1);
  if (profile?.role !== "admin") redirect("/profile");

  return <div className="dashboard admin-dashboard"><div className="admin-layout"><AdminSidebar/><div className="admin-content">{children}</div></div></div>;
}
