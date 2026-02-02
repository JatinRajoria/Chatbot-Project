import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  MessageSquare,
  LogOut,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  AlertTriangle,
  Menu,
  X,
} from "lucide-react";

const Sidebar = ({ onSelectChat, activeChatId, refreshTrigger }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [activeMenuId, setActiveMenuId] = useState(null);
  const [actionChat, setActionChat] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const fetchChats = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/chat", {
        withCredentials: true,
      });
      if (res.data.success) setChats(res.data.chats);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [refreshTrigger]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3000/api/chat/${actionChat._id}`, {
        withCredentials: true,
      });
      setIsDeleteModalOpen(false);
      fetchChats();
      if (activeChatId === actionChat._id) onSelectChat(null);
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleRename = async () => {
    if (!newTitle.trim()) return;
    try {
      await axios.put(
        `http://localhost:3000/api/chat/rename/${actionChat._id}`,
        { title: newTitle },
        { withCredentials: true },
      );
      setIsRenameModalOpen(false);
      fetchChats();
    } catch (err) {
      alert("Rename failed");
    }
  };

  const confirmLogout = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/auth/logout", {
        withCredentials: true,
      });
      if (res.data.success) {
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenuId(null);
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <>
      <style>{`
        /* Main class jisme scrollbar apply hoga */
        .custom-sidebar-scroll {
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #555 transparent;
        }

        /* Chrome, Safari, and Edge */
        .custom-sidebar-scroll::-webkit-scrollbar {
          width: 6px; /* 4px bahut patla ho jata hai mobile/trackpad ke liye, 6px is better */
        }

        .custom-sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-sidebar-scroll::-webkit-scrollbar-thumb {
          background: #555; /* Color updated for better visibility */
          border-radius: 10px;
          border: 1px solid transparent; /* Taaki thumb track se thoda door dikhe */
          background-clip: content-box;
        }
        .custom-sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: #777; /* Hover par thoda aur light */
        }
      `}</style>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-5 left-4 z-60 ">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 bg-[#bdc3c7] dark:bg-[#212121] border border-black/10 dark:border-white/10 rounded-md text-black dark:text-white shadow-lg"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Sidebar Main */}
      <div
        className={`
        fixed lg:relative z-100 h-screen bg-white dark:bg-[#171717] text-black flex flex-col border-r border-white/10 transition-all duration-300
        ${isCollapsed ? "lg:w-20" : "lg:w-72"} 
        ${isMobileOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div
          className={`p-4 flex items-center ${isCollapsed ? "justify-between lg:justify-center" : "justify-between"} pt-5`}
        >
          {(!isCollapsed || isMobileOpen) && (
            <span className="font-['Inter'] text-xl font-bold text(--text-logo) dark:bg-[#171717] dark:text-gray-200 tracking-tight">
              Ask Freely
            </span>
          )}
          <button
            onClick={() =>
              isMobileOpen
                ? setIsMobileOpen(false)
                : setIsCollapsed(!isCollapsed)
            }
            className="p-2 dark:hover:bg-white/5 hover:bg-gray-200 rounded-lg text-black dark:text-gray-400 transition-colors cursor-pointer"
          >
            {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="px-3">
          <button
            onClick={() => {
              onSelectChat(null);
              if (isMobileOpen) setIsMobileOpen(false);
            }}
            className={`w-full mb-4 flex items-center ${isCollapsed && !isMobileOpen ? "justify-center" : "gap-2 px-4"} p-3 border border-(--primary-color) dark:border-white/20
rounded-xl hover:bg-(--primary-color) dark:hover:bg-[#2f2f2f] text-black dark:text-gray-200
transition-all text-sm font-medium cursor-pointer`}
          >
            <Plus size={18} />
            {(!isCollapsed || isMobileOpen) && <span>New Chat</span>}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 space-y-1 custom-sidebar-scroll">
          {loading ? (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-4">
              Loading Chats...
            </div>
          ) : (
            chats.map((chat) => (
              <div key={chat._id} className="group relative">
                <div
                  onClick={() => {
                    onSelectChat(chat._id);
                    if (isMobileOpen) setIsMobileOpen(false);
                  }}
                  className={`p-3 cursor-pointer rounded-xl transition-colors duration-150 flex items-center ${isCollapsed && !isMobileOpen ? "justify-center" : "gap-3 pr-10"} 
                ${activeChatId === chat._id ? "bg-(--secondary-color) dark:bg-[#212121] border border-white/10" : "hover:bg-(--primary-color) dark:hover:bg-[#212121]"}`}
                >
                  <MessageSquare
                    size={18}
                    className={
                      activeChatId === chat._id
                        ? "text-(--tertiary-color) dark-text-blue-400"
                        : "text-black dark:text-gray-400"
                    }
                  />
                  {(!isCollapsed || isMobileOpen) && (
                    <span className="truncate text-sm font-medium text-black dark:text-gray-300">
                      {chat.title || "New Chat"}
                    </span>
                  )}
                </div>

                {/* 3-DOT BUTTON FIX FOR MOBILE AND PC */}
                {(!isCollapsed || isMobileOpen) && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(
                        activeMenuId === chat._id ? null : chat._id,
                      );
                    }}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-white/10 text-black dark:text-gray-400 transition-all
                    ${isMobileOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100"} cursor-pointer 
                  `}
                  >
                    <MoreVertical size={16} />
                  </button>
                )}

                {/* Dropdown Menu */}
                {activeMenuId === chat._id && (
                  <div className="absolute right-2 top-10 z-110 bg-[#ebe9db] dark:bg-[#252525]  border border-white/10 rounded-lg shadow-2xl py-1 w-32 animate-in fade-in zoom-in-95">
                    <button
                      onClick={() => {
                        setActionChat(chat);
                        setNewTitle(chat.title);
                        setIsRenameModalOpen(true);
                        setActiveMenuId(null);
                      }}
                      className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 font-bold text-black dark:text-white hover:bg-white/10 dark:hover:bg-white/5"
                    >
                      <Pencil size={14} /> Rename
                    </button>
                    <button
                      onClick={() => {
                        setActionChat(chat);
                        setIsDeleteModalOpen(true);
                        setActiveMenuId(null);
                      }}
                      className="w-full text-left px-3 py-2 text-xs flex items-center gap-2 font hover:bg-red-500/20 text-red-500 dark:hover:bg-red-500/10"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t  border-black/10 dark:border-white/10">
          <button
            onClick={() => setIsModalOpen(true)}
            className={`w-full flex items-center ${isCollapsed && !isMobileOpen ? "justify-center" : "gap-3"} p-3 rounded-xl hover:bg-red-500/10 text-red-500 transition-all font-semibold cursor-pointer`}
          >
            <LogOut size={20} />
            {(!isCollapsed || isMobileOpen) && <span>Logout</span>}
          </button>
        </div>
      </div>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-90 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* RENAME, DELETE & LOGOUT MODALS CODE GOES HERE (No changes needed there) */}
      {/* --- RENAME MODAL --- */}
      {isRenameModalOpen && (
        <div className="fixed inset-0 z-1000 flex items-center justify-center p-4 bg-(--secondary-color)/30 dark:bg-black/20 backdrop-blur-sm">
          <div className="dark:bg-[#1e1e1e] bg-[#E9E4F0] w-full max-w-sm rounded-2xl border border-black/10 dark:border-white/10 p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-4 flex items-center gap-2">
              <Pencil size={18} /> Rename Chat
            </h3>
            <input
              autoFocus
              className="w-full bg-(--secondary) text-black dark:text-white dark:bg-[#2a2a2a] border border-black/10 dark:border-white/10 rounded-xl p-3 text-sm outline-none focus:border-[#100f0f] dark:focus:border-blue-500 transition-all mb-6"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setIsRenameModalOpen(false)}
                className="flex-1 p-2.5 rounded-xl text-black dark:text-white bg-[#a7b9c4] dark:bg-white/5 hover:bg-[#7c97b2] dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleRename}
                className="flex-1 p-2.5 rounded-xl text-black dark:text-white bg-[#a88a8a] hover:bg-[#967171]  dark:bg-blue-600 dark:hover:bg-blue-700 border border-black/10 dark:border-white/10 text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE MODAL --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-1000 flex items-center justify-center p-4 bg-(--secondary-color)/30 dark:bg-black/70 backdrop-blur-sm">
          <div className="dark:bg-[#1e1e1e] w-full max-w-sm rounded-2xl border border-black/10 dark:border-white/10 p-6 shadow-2xl text-center">
            <div className="mx-auto w-12 h-12 bg-red-500/10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center mb-4 text-red-500">
              <AlertTriangle />
            </div>
            <h3 className="text-lg text-black dark:text-white font-semibold mb-2">
              Delete Chat?
            </h3>
            <p className="dark:text-gray-400 text-sm text-black mb-6">
              Are you Sure, This Chat Will Be Deleted Permanently?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 p-2.5 rounded-xl text-black dark:text-white bg-[#a7b9c4] hover:bg-[#7c97b2] dark:bg-white/5 dark:hover:bg-white/10 text-sm cursor-pointer"
              >
                No
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 p-2.5 rounded-xl text-black dark:text-white bg-[#a88a8a] hover:bg-[#967171]  dark:bg-red-600 dark:hover:bg-red-700 text-sm cursor-pointer"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- CONFIRMATION MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-(--secondary-color)/30 dark:bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="dark:bg-[#1e1e1e] bg-[#c7bfbf] w-full max-w-sm rounded-2xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 text-center">
              <div className="mx-auto w-12 h-12 bg-red-500/10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center mb-4">
                <AlertTriangle className="text-red-500" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                Confirm Logout
              </h3>
              <p className="dark:text-gray-400  text-black text-sm">
                Are you sure you want to logout? All sessions will end.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="p-4 dark:bg-[#252525] bg-[#bdc3c7] flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#a7b9c4] hover:bg-[#7c97b2] dark:hover:bg-white/10  dark:text-white dark:bg-white/5  border border-black/10 dark:border-white/10 text-black text-sm font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-400 hover:bg-red-500 dark:bg-red-600 dark:hover:bg-red-700 border border-black/10 dark:border-white/10 text-black dark:text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

// Variable,Simple Matlab,Kyu Banaya? (Purpose)
// activeChatId,"""Currently Open Chat""",Ye batata hai ki user abhi kaunsi chat padh raha hai. Iska use karke hum Sidebar mein us chat ko Highlight (blue/grey color) karte hain.
// onSelectChat,"""The Messenger""","Ye ek function (prop) hai. Jab tum sidebar mein kisi chat pe click karte ho, ye function Parent (Home.js) ko bolta hai, ""Bhai, user ne ye ID select ki hai, iska data dikhao."""
// activeMenuId,"""Menu Controller""","Jab tum 3-dots pe click karte ho, toh sirf usi chat ka dropdown khulna chahiye. Ye us chat ki ID store karta hai jiska menu abhi khula hua hai. Agar ye null hai, toh saare menus band hain."
// actionChat,"""The Target""","Ye wo chat object hai jis par tum ""Action"" lene wale ho (Rename ya Delete). Modal khulne par humein pata hona chahiye ki kaunsi chat delete karni hai, ye uski puri jankari (ID, Title) hold karta hai."
