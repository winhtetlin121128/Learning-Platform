import Link from "next/link";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { getViewer } from "@/lib/data";
import { SiteSignOutButton } from "./site-sign-out";

export async function SiteNav() {
  const viewer = await getViewer();
  let isAdmin = false;
  if (viewer && process.env.DATABASE_URL) {
    try {
      const [profile] = await getDb().select({ role: users.role }).from(users).where(eq(users.id, viewer.id)).limit(1);
      isAdmin = profile?.role === "admin";
    } catch {
      isAdmin = false;
    }
  }

  return <nav>
    <Link href="/#opportunities">Opportunities</Link>
    <Link href="/profile">My space</Link>
    {isAdmin && <Link href="/admin" className="nav-admin">Admin</Link>}
    {viewer ? <SiteSignOutButton/> : <Link href="/auth/sign-in" className="nav-signin">Sign in <span>↗</span></Link>}
  </nav>;
}
