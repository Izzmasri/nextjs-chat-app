"use client";
import * as Ably from "ably";

let client: Ably.Realtime | null = null;

export function getAblyClient(clientId: string) {
  if (!client) {
    client = new Ably.Realtime({
      authUrl: `/api/ably/token?clientId=${encodeURIComponent(clientId)}`,
      autoConnect: typeof window !== "undefined",
    });
  }
  return client;
}
