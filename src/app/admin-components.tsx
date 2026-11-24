"use client";
import { useState,useTransition } from "react";
import { ArrowUpRight,Trash2 } from "lucide-react";
import { deletePost,publishPost,removeAction } from "./actions";

const pretty=(s:string)=>s.charAt(0).toUpperCase()+s.slice(1);
const dateLabel=(s:string|null)=>s?new Date(s+"T12:00:00").toLocaleDateString("en",{month:"short",day:"numeric"}):"Open";
type Listing={id:string;title:string;category:string;summary:string;organization:string;locationOrLink:string;eventDate:string|null;deadline:string|null;isPinned:boolean};
type Person={id:string;name:string;email:string;university:string;role:string;currentStreak:number};

export function ActionTabs({rows}:{rows:{action:{id:string;actionType:"saved"|"applied"};post:Listing}[]}){
 const[tab,setTab]=useState<"saved"|"applied">("saved"),[busy,start]=useTransition();
 const list=rows.filter(r=>r.action.actionType===tab);
 return <section className="panel"><h2 className="panel-title">Your opportunities</h2><div className="tabs"><button className={`tab ${tab==="saved"?"active":""}`} onClick={()=>setTab("saved")}>Saved</button><button className={`tab ${tab==="applied"?"active":""}`} onClick={()=>setTab("applied")}>Applied</button></div><div className="action-list">{list.length?list.map(r=><div className="action-item" key={r.action.id}><div><h4>{r.post.title}</h4><p>{r.post.organization} · {pretty(r.post.category)}</p></div><button className="icon-btn" disabled={busy} onClick={()=>start(()=>removeAction(r.action.id))}><Trash2 size={14}/> {tab==="saved"?"Remove":"Withdraw"}</button></div>):<p className="muted">Nothing in this list yet. Save a listing to keep it close.</p>}</div></section>
}
export function AdminPostForm(){
 const[busy,start]=useTransition(),[message,setMessage]=useState("");
 return <form className="form" action={f=>start(async()=>{try{await publishPost(f);setMessage("Listing published.")}catch(e){setMessage(e instanceof Error?e.message:"Could not publish listing.")}})}><label>Title<input name="title" required minLength={5} maxLength={120} placeholder="A clear, useful title"/></label><div className="form-grid"><label>Category<select name="category">{["announcement","webinar","meetup","internship","volunteer"].map(c=><option key={c} value={c}>{pretty(c)}</option>)}</select></label><label>Organization<input name="organization" required placeholder="Organization name"/></label></div><label>Summary<textarea name="summary" required minLength={15} maxLength={800} placeholder="What should students know?"/></label><label>Location or link<input name="locationOrLink" maxLength={200} placeholder="Yangon · In person / Online"/></label><div className="form-grid"><label>Event date<input name="eventDate" type="date"/></label><label>Deadline<input name="deadline" type="date"/></label></div><label className="checkbox-label"><input type="checkbox" name="isPinned"/> Pin announcement</label>{message&&<div className={message==="Listing published."?"success":"error"}>{message}</div>}<button className="button" disabled={busy}>{busy?"Publishing…":"Publish listing"} <ArrowUpRight size={13}/></button></form>
}
export function AdminTable({listings,people}:{listings:Listing[];people:Person[]}){
 const[busy,start]=useTransition();
 return <><section className="panel" style={{marginBottom:14}}><h2 className="panel-title">Manage listings</h2><div className="table-wrap"><table className="data-table"><thead><tr><th>Listing</th><th>Category</th><th>Date / deadline</th><th>Pinned</th><th></th></tr></thead><tbody>{listings.map(p=><tr key={p.id}><td>{p.title}<div className="muted">{p.organization}</div></td><td>{pretty(p.category)}</td><td>{p.deadline?dateLabel(p.deadline):dateLabel(p.eventDate)}</td><td>{p.isPinned?"Yes":"—"}</td><td><button className="icon-btn" disabled={busy} onClick={()=>{if(confirm("Delete this listing?"))start(()=>deletePost(p.id))}}><Trash2 size={13}/> Delete</button></td></tr>)}</tbody></table></div></section><section className="panel"><h2 className="panel-title">Registered students</h2><div className="table-wrap"><table className="data-table"><thead><tr><th>Name</th><th>Email</th><th>University</th><th>Role</th><th>Streak</th></tr></thead><tbody>{people.map(p=><tr key={p.id}><td>{p.name}</td><td>{p.email}</td><td>{p.university||"—"}</td><td>{pretty(p.role)}</td><td>{p.currentStreak} days</td></tr>)}</tbody></table></div></section></>
}
