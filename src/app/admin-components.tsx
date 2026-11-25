"use client";

import { Fragment, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Pencil, ShieldCheck, Trash2, X } from "lucide-react";
import { deletePost, publishPost, removeAction, updatePost, updateUserRole } from "./actions";

const categories = ["announcement", "hackathon", "webinar", "event", "meetup", "internship", "volunteer"] as const;
const pretty = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const dateLabel = (s: string | null) => s ? new Date(s + "T12:00:00").toLocaleDateString("en", { month: "short", day: "numeric" }) : "Open";
type Listing = { id: string; title: string; category: string; summary: string; organization: string; locationOrLink: string; eventDate: string | null; deadline: string | null; isPinned: boolean };
type Person = { id: string; name: string; email: string; university: string; role: string; currentStreak: number };

export function ActionTabs({ rows }: { rows: { action: { id: string; actionType: "saved" | "applied" }; post: Listing }[] }) {
  const [tab, setTab] = useState<"saved" | "applied">("saved");
  const [busy, start] = useTransition();
  const list = rows.filter(r => r.action.actionType === tab);
  return <section className="panel"><h2 className="panel-title">Your opportunities</h2><div className="tabs"><button className={`tab ${tab === "saved" ? "active" : ""}`} onClick={() => setTab("saved")}>Saved</button><button className={`tab ${tab === "applied" ? "active" : ""}`} onClick={() => setTab("applied")}>Applied</button></div><div className="action-list">{list.length ? list.map(r => <div className="action-item" key={r.action.id}><div><h4>{r.post.title}</h4><p>{r.post.organization} · {pretty(r.post.category)}</p></div><button className="icon-btn" disabled={busy} onClick={() => start(() => removeAction(r.action.id))}><Trash2 size={14}/> {tab === "saved" ? "Remove" : "Withdraw"}</button></div>) : <p className="muted">Nothing in this list yet. Save a listing to keep it close.</p>}</div></section>;
}

export function AdminPostForm() {
  const router = useRouter();
  const [busy, start] = useTransition();
  const [message, setMessage] = useState("");
  return <form className="form" action={f => start(async () => { try { await publishPost(f); setMessage("Listing published."); router.refresh(); } catch (e) { setMessage(e instanceof Error ? e.message : "Could not publish listing."); } })}>
    <label>Title<input name="title" required minLength={5} maxLength={120} placeholder="A clear, useful title"/></label>
    <div className="form-grid"><label>Category<select name="category">{categories.map(c => <option key={c} value={c}>{pretty(c)}</option>)}</select></label><label>Organization<input name="organization" required placeholder="Organization name"/></label></div>
    <label>Summary<textarea name="summary" required minLength={15} maxLength={800} placeholder="What should students know?"/></label>
    <label>Location or link<input name="locationOrLink" maxLength={200} placeholder="Yangon · In person / Online"/></label>
    <div className="form-grid"><label>Event date<input name="eventDate" type="date"/></label><label>Deadline<input name="deadline" type="date"/></label></div>
    <label className="checkbox-label"><input type="checkbox" name="isPinned"/> Pin announcement</label>
    {message && <div className={message === "Listing published." ? "success" : "error"}>{message}</div>}
    <button className="button" disabled={busy}>{busy ? "Publishing…" : "Publish listing"} <ArrowUpRight size={13}/></button>
  </form>;
}

function AdminPostEditor({ post, onClose }: { post: Listing; onClose: (saved?: boolean) => void }) {
  const [busy, start] = useTransition();
  const [message, setMessage] = useState("");
  return <form className="form admin-edit-form" action={f => start(async () => { try { await updatePost(f); onClose(true); } catch (e) { setMessage(e instanceof Error ? e.message : "Could not update listing."); } })}>
    <input type="hidden" name="postId" value={post.id}/>
    <div className="admin-edit-grid">
      <label>Title<input name="title" required minLength={5} maxLength={120} defaultValue={post.title}/></label>
      <label>Category<select name="category" defaultValue={post.category}>{categories.map(c => <option key={c} value={c}>{pretty(c)}</option>)}</select></label>
      <label>Organization<input name="organization" required minLength={2} defaultValue={post.organization}/></label>
      <label>Location or link<input name="locationOrLink" maxLength={200} defaultValue={post.locationOrLink}/></label>
      <label>Event date<input name="eventDate" type="date" defaultValue={post.eventDate ?? ""}/></label>
      <label>Deadline<input name="deadline" type="date" defaultValue={post.deadline ?? ""}/></label>
      <label className="admin-edit-summary">Summary<textarea name="summary" required minLength={15} maxLength={800} defaultValue={post.summary}/></label>
      <label className="checkbox-label"><input type="checkbox" name="isPinned" defaultChecked={post.isPinned}/> Pin announcement</label>
    </div>
    {message && <div className="error">{message}</div>}
    <div className="admin-edit-actions"><button className="button" disabled={busy}>{busy ? "Saving…" : "Save changes"}</button><button type="button" className="button secondary" onClick={() => onClose()}><X size={13}/> Cancel</button></div>
  </form>;
}

export function AdminPostsTable({ listings }: { listings: Listing[] }) {
  const [busy, start] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const router = useRouter();
  return <section className="panel admin-panel">
      <div className="admin-section-head"><div><h2 className="panel-title">Manage posts</h2><p className="muted">Edit or remove listings published to the home page.</p></div><span className="mono muted">{listings.length} POSTS</span></div>
      {message && <p className="success" role="status">{message}</p>}
      <div className="table-wrap"><table className="data-table"><thead><tr><th>Post</th><th>Category</th><th>Date / deadline</th><th>Pinned</th><th>Actions</th></tr></thead><tbody>{listings.map(p => <Fragment key={p.id}>
        <tr key={p.id}><td>{p.title}<div className="muted">{p.organization}</div></td><td>{pretty(p.category)}</td><td>{p.deadline ? dateLabel(p.deadline) : dateLabel(p.eventDate)}</td><td>{p.isPinned ? "Yes" : "—"}</td><td><div className="admin-row-actions"><button className="icon-btn" onClick={() => setEditingId(editingId === p.id ? null : p.id)}><Pencil size={13}/> {editingId === p.id ? "Close" : "Edit"}</button><button className="icon-btn" disabled={busy} onClick={() => { if (confirm(`Delete “${p.title}”?`)) start(async () => { try { await deletePost(p.id); setMessage("Post deleted."); router.refresh(); } catch (e) { setMessage(e instanceof Error ? e.message : "Could not delete post."); } }); }}><Trash2 size={13}/> Delete</button></div></td></tr>
        {editingId === p.id && <tr key={`${p.id}-edit`}><td colSpan={5}><AdminPostEditor post={p} onClose={saved => { setEditingId(null); if (saved) setMessage("Post updated."); }}/></td></tr>}
      </Fragment>)}</tbody></table></div>
    </section>;
}

export function AdminUsersTable({ people, currentUserId }: { people: Person[]; currentUserId: string }) {
  const [busy, start] = useTransition();
  const [message, setMessage] = useState("");
  const router = useRouter();
  return <section className="panel admin-panel"><div className="admin-section-head"><div><h2 className="panel-title">Manage users</h2><p className="muted">Review accounts and assign student or admin access.</p></div><span className="mono muted">{people.length} USERS</span></div>
      {message && <p className="success" role="status">{message}</p>}
      <div className="table-wrap"><table className="data-table"><thead><tr><th>Name</th><th>Email</th><th>University</th><th>Role</th><th>Streak</th><th>Access</th></tr></thead><tbody>{people.map(p => { const self = p.id === currentUserId; const nextRole = p.role === "admin" ? "student" : "admin"; return <tr key={p.id}><td>{p.name}{self && <div className="muted">Your account</div>}</td><td>{p.email}</td><td>{p.university || "—"}</td><td><span className={`role-pill ${p.role}`}>{pretty(p.role)}</span></td><td>{p.currentStreak} days</td><td><button className="icon-btn" disabled={busy || self} title={self ? "You cannot change your own role" : undefined} onClick={() => { if (!self && confirm(`${nextRole === "admin" ? "Grant" : "Remove"} admin access ${nextRole === "admin" ? "to" : "from"} ${p.name}?`)) start(async () => { try { await updateUserRole(p.id, nextRole); setMessage(`${p.name} is now ${nextRole === "student" ? "a student" : "an admin"}.`); router.refresh(); } catch (e) { setMessage(e instanceof Error ? e.message : "Could not update user role."); } }); }}><ShieldCheck size={13}/> {p.role === "admin" ? "Make student" : "Make admin"}</button></td></tr>; })}</tbody></table></div>
    </section>;
}
