import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { getAdminData,getViewer } from "@/lib/data";
import { AdminPostForm,AdminTable } from "@/app/admin-components";
export const dynamic="force-dynamic";
export default async function AdminPage(){
 const u=await getViewer();if(!u)redirect("/auth/sign-in");
 if(!process.env.DATABASE_URL)return <main className="dashboard"><div className="eyebrow"><i/>Administration</div><h1 className="page-title">The admin desk.</h1><p className="muted">Add DATABASE_URL, push the schema, and make an admin profile with the bootstrap code to manage listings.</p></main>;
 const db=getDb(),[me]=await db.select().from(users).where(eq(users.id,u.id)).limit(1);if(!me||me.role!=="admin")redirect("/profile");
 const{people,listings,applicationCount}=await getAdminData();
 return <main className="dashboard"><div className="dashboard-top"><div><div className="eyebrow"><i/>Nexus operations</div><h1>The admin desk.</h1><p className="muted">A clear view of what’s growing in the community.</p></div><span className="mono muted">SIGNED IN AS {u.email}</span></div><div className="kpis"><div className="kpi"><strong>{people.length}</strong><span>Total users</span></div><div className="kpi"><strong>{listings.length}</strong><span>Active listings</span></div><div className="kpi"><strong>{applicationCount}</strong><span>Applications</span></div><div className="kpi"><strong>{listings.filter(p=>p.isPinned).length}</strong><span>Pinned posts</span></div></div><div className="admin-grid"><section className="panel"><h2 className="panel-title">Publish a listing</h2><AdminPostForm/></section><div><AdminTable listings={listings.map(p=>({...p,locationOrLink:p.locationOrLink??""}))} people={people}/></div></div></main>;
}
