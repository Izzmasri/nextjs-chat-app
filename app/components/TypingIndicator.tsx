"use client";
import { useState, useRef } from "react";
import { usePresence, usePresenceListener } from "ably/react";

type TypingData = { typing: boolean };

export default function TypingIndicator({ room }: { room: string }) {
  const { updateStatus } = usePresence<TypingData>(room, { typing: false });
  const [typers, setTypers] = useState<Record<string, boolean>>({});
  const timeoutRef = useRef<number | null>(null);

  usePresenceListener(room, (presenceUpdate) => {
    const { clientId, data, action } = presenceUpdate;
    setTypers((prev) => {
      const next = { ...prev };
      if (action === "leave") {
        delete next[clientId];
      } else {
        next[clientId] = Boolean((data as TypingData | undefined)?.typing);
      }
      return next;
    });
  });

  const handleTyping = () => {
    updateStatus({ typing: true });
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      updateStatus({ typing: false });
    }, 800);
  };

  const typingCount = Object.values(typers).filter(Boolean).length;

  return (
    <div className="text-xs text-gray-500 h-5">
      {typingCount > 0
        ? `${typingCount} ${typingCount === 1 ? "person" : "people"} typing...`
        : ""}
    </div>
  );
}
