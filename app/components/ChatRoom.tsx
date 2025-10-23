// "use client";
// import { useState, useCallback, FormEvent } from "react";
// import { ChannelProvider, useChannel } from "ably/react";
// import type * as Ably from "ably";

// function ChatMessages({ room }: { room: string }) {
//   const [messages, setMessages] = useState<Ably.Message[]>([]);
//   const [inputValue, setInputValue] = useState("");

//   const { publish } = useChannel(room, (message) => {
//     setMessages((prev) => [...prev, message]);
//   });

//   const handleSubmit = useCallback(
//     async (e: FormEvent) => {
//       e.preventDefault();
//       if (!inputValue.trim()) return;

//       await publish("message", { text: inputValue });
//       setInputValue("");
//     },
//     [inputValue, publish]
//   );

//   return (
//     <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
//       <div className="flex-1 overflow-y-auto mb-4 space-y-2">
//         {messages.map((msg, index) => (
//           <div key={msg.id || index} className="p-3 bg-gray-100 rounded">
//             <div className="text-xs text-gray-500 mb-1">
//               {msg.clientId || "Anonymous"}
//             </div>
//             <div className="text-sm">
//               {typeof msg.data === "object" ? msg.data.text : String(msg.data)}
//             </div>
//           </div>
//         ))}
//       </div>

//       <form onSubmit={handleSubmit} className="flex gap-2">
//         <input
//           type="text"
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//           placeholder="Type a message..."
//           className="flex-1 px-4 py-2 border rounded"
//         />
//         <button
//           type="submit"
//           className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//           Send
//         </button>
//       </form>
//     </div>
//   );
// }

// export default function ChatRoom({ room }: { room: string }) {
//   return (
//     <ChannelProvider channelName={room} options={{ params: { rewind: "25" } }}>
//       <ChatMessages room={room} />
//     </ChannelProvider>
//   );
// }
"use client";
import { useState, useCallback, FormEvent, useEffect, useRef } from "react";
import { ChannelProvider, useChannel } from "ably/react";
import type * as Ably from "ably";

function ChatMessages({ room }: { room: string }) {
  const [messages, setMessages] = useState<Ably.Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { publish } = useChannel(room, (message) => {
    setMessages((prev) => [...prev, message]);
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!inputValue.trim()) return;

      await publish("message", { text: inputValue });
      setInputValue("");
    },
    [inputValue, publish]
  );

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getAvatarColor = (clientId: string) => {
    const colors = [
      "bg-gradient-to-br from-purple-500 to-pink-500",
      "bg-gradient-to-br from-blue-500 to-cyan-500",
      "bg-gradient-to-br from-green-500 to-emerald-500",
      "bg-gradient-to-br from-orange-500 to-red-500",
      "bg-gradient-to-br from-indigo-500 to-purple-500",
      "bg-gradient-to-br from-teal-500 to-green-500",
    ];
    const hash = clientId
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 shadow-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                {room.split(":")[1] || room}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {messages.length}{" "}
                {messages.length === 1 ? "message" : "messages"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                No messages yet
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Be the first to start the conversation!
              </p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const data =
                typeof msg.data === "object"
                  ? msg.data
                  : { text: String(msg.data) };
              const clientId = msg.clientId || "Anonymous";
              const isFirstInGroup =
                index === 0 || messages[index - 1].clientId !== clientId;

              return (
                <div
                  key={msg.id || index}
                  className={`flex gap-3 group hover:bg-slate-100 dark:hover:bg-slate-800/50 -mx-4 px-4 py-2 rounded-lg transition-colors ${
                    !isFirstInGroup ? "mt-1" : ""
                  }`}
                >
                  <div className="flex-shrink-0">
                    {isFirstInGroup ? (
                      <div
                        className={`w-10 h-10 rounded-xl ${getAvatarColor(
                          clientId
                        )} flex items-center justify-center text-white font-bold text-sm shadow-lg`}
                      >
                        {clientId.charAt(0).toUpperCase()}
                      </div>
                    ) : (
                      <div className="w-10 h-10"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    {isFirstInGroup && (
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-semibold text-slate-900 dark:text-white text-sm">
                          {clientId}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formatTime(msg.timestamp!)}
                        </span>
                      </div>
                    )}
                    <div className="text-slate-700 dark:text-slate-300 text-[15px] leading-relaxed break-words">
                      {data.text}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative flex items-center bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-400 transition-shadow">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-transparent px-5 py-3.5 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none text-[15px]"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="mx-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-slate-400 disabled:to-slate-400 text-white font-medium rounded-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm hover:shadow-md flex items-center gap-2"
              >
                <span>Send</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ChatRoom({ room }: { room: string }) {
  return (
    <ChannelProvider channelName={room} options={{ params: { rewind: "25" } }}>
      <ChatMessages room={room} />
    </ChannelProvider>
  );
}
