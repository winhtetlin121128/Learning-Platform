import type { Metadata } from "next";
import Link from "next/link";
import { Inter,JetBrains_Mono } from "next/font/google";
import "./globals.css";
const inter=Inter({subsets:["latin"],variable:"--font-inter"});
const mono=JetBrains_Mono({subsets:["latin"],variable:"--font-mono"});
export const metadata:Metadata={title:"NEXUS LEARN — Find your next step",description:"A thoughtful home for student opportunities, learning, and community."};
export default function RootLayout({children}:{children:React.ReactNode}){
 return <html lang="en"><body className={`${inter.variable} ${mono.variable}`}><header className="site-header"><Link href="/" className="brand"><span className="brand-mark">N</span><span>NEXUS <b>LEARN</b></span></Link><nav><Link href="/#opportunities">Opportunities</Link><Link href="/profile">My space</Link><Link href="/admin" className="nav-admin">Admin</Link><Link href="/auth/sign-in" className="nav-signin">Sign in <span>↗</span></Link></nav></header>{children}<footer className="site-footer"><Link href="/" className="brand"><span className="brand-mark">N</span><span>NEXUS <b>LEARN</b></span></Link><span>Make the next step yours.</span><span className="mono">YANGON · EST. 2026</span></footer></body></html>;
}
