"use client";
import dynamic from "next/dynamic";

const ChatRoom = dynamic(() => import("./components/ChatRoom"), {
  ssr: false,
});

export default function HomePage() {
  return (
    <main className="h-screen">
      <ChatRoom room="chat:general" />
    </main>
  );
}
