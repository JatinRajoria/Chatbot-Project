import React from "react";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

const MessageBox = ({ msg }) => {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === "user";
  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);

    // 2 second baad wapas copy icon dikhao
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div
      className={`flex flex-col ${isUser ? "items-end" : "items-start"} mb-4 group`}
    >
      <div className="relative max-w-[80%] md:max-w-[70%]">
        <div
          className={`p-3.5 rounded-2xl shadow-sm text-sm md:text-base ${
            isUser
              ? "dark:bg-blue-600 bg-(--message-color) text-black border-black/3 dark:text-white rounded-tr-none"
              : "bg-(--aimessage-color) dark:bg-[#212121] text-black dark:text-gray-200 rounded-tl-none border border-black/3  dark:border-white/5"
          }`}
        >
          <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed">
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        </div>

        {/* Copy Button - Sirf hover par dikhega (group-hover) */}
        <button
          onClick={handleCopy}
          className={`absolute top-0 ${isUser ? "-left-8" : "-right-8"} p-1.5 rounded-md bg-[#cfc4de] dark:bg-[#1e1e1e] border border-black/10 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#a896bf] dark:hover:bg-[#2a2a2a] text-black dark:text-gray-400`}
          title="Copy message"
        >
          {copied ? (
            <Check size={14} className="text-green-500" />
          ) : (
            <Copy size={14} />
          )}
        </button>
      </div>

      <span className="text-[10px] text-black dark:text-gray-500 mt-1.5 px-1 font-medium">
        {msg.createdAt
          ? new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Just now"}
      </span>
    </div>
  );
};

export default MessageBox;

// <span className="...">
//   {msg.createdAt ? (
//     (new Date() - new Date(msg.createdAt)) < 60000 ? 'Just now' : 
//     new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//   ) : 'Just now'}
// </span>