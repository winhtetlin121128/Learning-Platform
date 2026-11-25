import { AdminUsersTable } from "@/app/admin-components";
import { getAdminData, getViewer } from "@/lib/data";

export default async function AdminUsersPage() {
  const [{ people }, viewer] = await Promise.all([getAdminData(), getViewer()]);
  if (!viewer) return null;
  return <div className="admin-page">
    <header className="dashboard-top admin-heading"><div><div className="eyebrow"><i/>People workspace</div><h1>Users</h1><p className="muted">Review accounts and manage student or admin access.</p></div><span className="mono muted">{people.length} USERS</span></header>
    <AdminUsersTable people={people} currentUserId={viewer.id}/>
  </div>;
}
