import "server-only";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
export function getDb(){
 const url=process.env.DATABASE_URL;
 if(!url)throw new Error("DATABASE_URL is not configured. Copy .env.example to .env.local and add your Neon connection string.");
 return drizzle(neon(url),{schema});
}
