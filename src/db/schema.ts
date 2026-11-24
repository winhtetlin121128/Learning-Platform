import { boolean, date, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid, uniqueIndex } from "drizzle-orm/pg-core";
export const roleEnum=pgEnum("user_role",["student","admin"]);
export const categoryEnum=pgEnum("post_category",["announcement","webinar","meetup","internship","volunteer"]);
export const actionEnum=pgEnum("post_action_type",["saved","applied"]);
export const users=pgTable("users",{
 id:text("id").primaryKey(),name:text("name").notNull(),email:text("email").notNull().unique(),
 role:roleEnum("role").notNull().default("student"),university:text("university").notNull().default(""),
 major:text("major").notNull().default(""),currentStreak:integer("current_streak").notNull().default(0),
 lastCheckinAt:timestamp("last_checkin_at",{withTimezone:true}),
 checkinHistory:jsonb("checkin_history").$type<string[]>().notNull().default([]),
 createdAt:timestamp("created_at",{withTimezone:true}).notNull().defaultNow()
});
export const posts=pgTable("posts",{
 id:uuid("id").defaultRandom().primaryKey(),title:text("title").notNull(),
 category:categoryEnum("category").notNull(),summary:text("summary").notNull(),
 organization:text("organization").notNull(),locationOrLink:text("location_or_link").notNull().default(""),
 eventDate:date("event_date"),deadline:date("deadline"),isPinned:boolean("is_pinned").notNull().default(false),
 createdBy:text("created_by").notNull().references(()=>users.id,{onDelete:"restrict"}),
 createdAt:timestamp("created_at",{withTimezone:true}).notNull().defaultNow()
});
export const userPostActions=pgTable("user_post_actions",{
 id:uuid("id").defaultRandom().primaryKey(),userId:text("user_id").notNull().references(()=>users.id,{onDelete:"cascade"}),
 postId:uuid("post_id").notNull().references(()=>posts.id,{onDelete:"cascade"}),
 actionType:actionEnum("action_type").notNull(),createdAt:timestamp("created_at",{withTimezone:true}).notNull().defaultNow()
},t=>[uniqueIndex("user_post_action_unique").on(t.userId,t.postId,t.actionType)]);
