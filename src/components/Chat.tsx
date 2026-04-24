import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { Send, AlertCircle } from "lucide-react";

const supabase = createClient(
  "https://gzbiqhftbsqmdcofodhl.supabase.co",
  "sb_publishable_N3_vo3ilLtngmDuM8ajP8A_0z1K2DVq"
);

interface Message {
  id: string;
  user_name: string;
  text: string;
  created_at: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [username, setUsername] = useState<string>("");
  const [inputUsername, setInputUsername] = useState<string>("");
  const [messageText, setMessageText] = useState<string>("");
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [onlineCount, setOnlineCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    const storedName = localStorage.getItem("gzone_chat_name");
    if (storedName) {
      setUsername(storedName);
    }
    loadMessages();

    const userId = Math.random().toString(36);

    const channel = supabase.channel("chat-room", {
      config: {
        presence: { key: userId },
      },
    });
    
    channelRef.current = channel;

    channel.on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "messages" },
      (payload) => {
        setMessages((prev) => [...prev, payload.new as Message]);
      }
    );

    // handle presence sync
    channel.on("presence", { event: "sync" }, () => {
      const state = channel.presenceState();
      
      const users = Object.values(state)
        .flat()
        .map((u: any) => u.username)
        .filter(Boolean);

      const uniqueUsers = [...new Set(users)];

      setOnlineUsers(uniqueUsers);
      setOnlineCount(uniqueUsers.length);
    });

    // join message (fires once on connect)
    channel.on("presence", { event: "join" }, () => {
      const chat = document.getElementById("chat");
      if (chat) {
        const msg = document.createElement("div");
        msg.style.opacity = "0.5";
        msg.style.fontSize = "12px";
        msg.style.marginBottom = "12px";
        msg.style.color = "#a1a1aa";
        msg.innerText = "someone just joined...";
        chat.appendChild(msg);
        chat.scrollTop = chat.scrollHeight;
      }
    });

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        const currentName = localStorage.getItem("gzone_chat_name");
        if (currentName) {
          await channel.track({ 
            username: currentName,
            online_at: new Date().toISOString() 
          });
        }
      }
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(50);

      if (error) throw error;
      if (data) {
        setMessages(data);
      }
    } catch (err) {
      console.error("Load error:", err);
      setErrorMsg("Failed to load messages.");
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = inputUsername.trim().substring(0, 20);
    if (name) {
      setUsername(name);
      localStorage.setItem("gzone_chat_name", name);
      setErrorMsg(null);
      
      if (channelRef.current) {
        await channelRef.current.track({
          username: name,
          online_at: new Date().toISOString()
        });
      }
    } else {
      setErrorMsg("Please enter a name to join.");
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = messageText.trim();
    if (!text || !username || isSending) return;

    setIsSending(true);
    setErrorMsg(null);
    try {
      const { error } = await supabase
        .from("messages")
        .insert([{ user_name: username, text: text }]);

      if (error) throw error;
      setMessageText("");
    } catch (err) {
      console.error("Send error:", err);
      setErrorMsg("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (!username) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-black/80 p-4">
        <div className="w-full max-w-sm text-center">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-6 text-white">
            Join the Chat
          </h2>
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-400 text-sm text-left">
              <AlertCircle size={16} className="shrink-0" />
              <p>{errorMsg}</p>
            </div>
          )}
          <form onSubmit={handleJoin} className="space-y-4">
            <input
              type="text"
              placeholder="Enter your name..."
              maxLength={20}
              value={inputUsername}
              onChange={(e) => setInputUsername(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 text-white px-4 py-3 rounded-lg outline-none focus:border-brand transition-colors"
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-brand text-black font-bold uppercase tracking-wider py-3 rounded-lg hover:bg-brand/90 transition-colors"
            >
              Join Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-black p-2 md:p-4">
      <div className="flex justify-between items-center mb-1 px-2">
        <span className="text-brand font-bold uppercase tracking-widest text-[10px] md:text-sm">Live Chat</span>
        <div className="text-brand text-[10px] md:text-sm font-mono">
          🔥 <span id="onlineCount">{onlineCount}</span> online
        </div>
      </div>
      <div className="text-[8px] md:text-xs text-zinc-500 mb-2 px-2 text-right">
        <span id="onlineUsers">
          {onlineUsers.slice(0, 5).join(", ")}
          {onlineUsers.length > 5 ? ` +${onlineUsers.length - 5}` : ""}
        </span>
      </div>
      <div
        id="chat"
        ref={chatRef}
        className="flex-grow overflow-y-auto border border-white/10 p-4 bg-white/5 rounded-xl mb-4 scroll-smooth"
      >
        {messages.map((msg, idx) => (
          <div key={msg.id || idx} className="mb-3 text-sm leading-relaxed animate-in fade-in slide-in-from-bottom-2">
            <span className="text-brand font-bold mr-2">{msg.user_name}</span>
            <span className="text-white/30 text-[10px] mr-2">
              {formatTime(msg.created_at || new Date().toISOString())}
            </span>
            <span className="text-white/80 break-words">{msg.text}</span>
          </div>
        ))}
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle size={16} className="shrink-0" />
          <p>{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          maxLength={200}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          disabled={isSending}
          className="flex-grow bg-zinc-900 border border-zinc-800 text-white px-4 py-3 rounded-lg outline-none focus:border-brand transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={isSending || !messageText.trim()}
          className="bg-brand text-black px-6 rounded-lg font-bold uppercase tracking-wider hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
