import { AdminPostForm, AdminPostsTable } from "@/app/admin-components";
import { getAdminData } from "@/lib/data";

export default async function AdminPostsPage() {
  const { listings } = await getAdminData();
  return <div className="admin-page">
    <header className="dashboard-top admin-heading"><div><div className="eyebrow"><i/>Content workspace</div><h1>Posts</h1><p className="muted">Create new listings or edit and remove existing posts.</p></div><span className="mono muted">{listings.length} POSTS</span></header>
    <div className="admin-posts-layout"><section className="panel admin-publish"><h2 className="panel-title">Add a post</h2><AdminPostForm/></section><AdminPostsTable listings={listings.map(post => ({ ...post, locationOrLink: post.locationOrLink ?? "" }))}/></div>
  </div>;
}
