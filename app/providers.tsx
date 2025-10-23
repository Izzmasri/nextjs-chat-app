"use client";
import { AblyProvider } from "ably/react";
import { useMemo } from "react";
import { getAblyClient } from "@/lib/ablyClient";

export default function Providers({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => {
    // eslint-disable-next-line react-hooks/purity
    const clientId = "user-" + Math.random().toString(36).slice(2, 11);
    return getAblyClient(clientId);
  }, []);

  return <AblyProvider client={client}>{children}</AblyProvider>;
}
