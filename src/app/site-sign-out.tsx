"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function SiteSignOutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return <button className="nav-signin nav-signout" type="button" disabled={busy} onClick={async () => {
    setBusy(true);
    try {
      await authClient.signOut();
      router.push("/");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }}>{busy ? "Signing out…" : <>Sign out <span>↗</span></>}</button>;
}
