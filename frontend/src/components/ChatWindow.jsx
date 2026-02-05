import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { Loader2, Send } from 'lucide-react';
import MessageBox from './MessageBox'; // Import the new component
import WelcomeScreen from './WelcomeScreen';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const ChatWindow = ({ activeChatId, onFirstMessageSent }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isAiTyping, setIsAiTyping] = useState(false);
    const scrollRef = useRef(null);
    const socketRef = useRef(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        socketRef.current = io('https://ask-freely.onrender.com', {  //https://ask-freely.onrender.com  http://localhost:3000
            withCredentials: true,
            transports: ["websocket", "polling"], // ✅ Stability ke liye
            reconnectionAttempts: 5, // Limit lagao taaki logout ke baad infinite loop na chale
        });
    
        // return unmount ke time chlega cleanup ke liye
        return ()=>{
            if(socketRef.current){
                // disconnect connect kat dega jab tum kissi aur chat pr hoge ya fir logout kr rhe hoge
                socketRef.current.disconnect();
                console.log("Socket cleanup : Connection closed successfully");
            }
        }
    },[])

    useEffect(() => {
        if (activeChatId) {
            axios.get(`https://ask-freely.onrender.com/api/chat/messages/${activeChatId}`, { withCredentials: true })
                .then(res => { if (res.data.success) setMessages(res.data.messages); })
                .catch(err => console.error("History fetch error:", err));
        } else {
            setMessages([]);
        }
    }, [activeChatId]);

    useEffect(() => {
        socketRef.current.on("ai_response", (data) => {
            setIsAiTyping(false);
            setMessages((prev) => [...prev, { content: data.content, role: 'model', createdAt: new Date().toISOString() }]);
            if (!activeChatId && data.chat) {
                // setActiveChatId(data.chat);
                onFirstMessageSent(data.chat);
            }
        });
        socketRef.current.on("error_message", (err) => { setIsAiTyping(false); alert(err.message); });
        return () => { socketRef.current.off("ai_response"); socketRef.current.off("error_message"); };
    }, [activeChatId, onFirstMessageSent]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isAiTyping]);

    const handleSend = () => {
        if (!input.trim()) return;
        const userMsg = { content: input, role: 'user', createdAt: new Date().toISOString() };
        setMessages((prev) => [...prev, userMsg]);
        setIsAiTyping(true);
        socketRef.current.emit("ai_message", { content: input, chat: activeChatId });
        setInput("");
       
    };

    // Correct Logic for Date Dividers
    const renderContent = () => {
        let lastDate = null;
        return messages.map((msg, idx) => {
            const msgDate = new Date(msg.createdAt).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
            const showDivider = msgDate !== lastDate;
            lastDate = msgDate;

            return (
                <div key={idx} className="w-full">
                    {showDivider && (
                        <div className="flex justify-center my-6">
                            <span className="bg-[#EEF4FF] dark:bg-[#1e1e1e] font-medium text-black dark:text-gray-500 text-[11px] px-3 py-1 rounded-full border border-white/5 uppercase tracking-widest">
                                {msgDate === new Date().toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' }) ? "Today" : msgDate}
                            </span>
                        </div>
                    )}
                    <MessageBox msg={msg} />
                </div>
            );
        });
    };

    return (
        <div className="flex flex-col h-100dvh w-full bg-white dark:bg-[#121212] overflow-hidden transition-all duration-300">
        <style>{`
                    /* Main class jisme scrollbar apply hoga */
                    .custom-textarea-scroll {
                        overflow-y: auto;
                        scrollbar-width: thin;
                        scrollbar-color: #555 transparent;
                    }

                    /* Chrome, Safari, and Edge */
                    .custom-textarea-scroll::-webkit-scrollbar {
                        width: 6px; /* 4px bahut patla ho jata hai mobile/trackpad ke liye, 6px is better */
                    }

                    .custom-textarea-scroll::-webkit-scrollbar-track {
                        background: transparent;
                    }

                    .custom-textarea-scroll::-webkit-scrollbar-thumb {
                        background: #555; /* Color updated for better visibility */
                        border-radius: 10px;
                        border: 1px solid transparent; /* Taaki thumb track se thoda door dikhe */
                        background-clip: content-box;
                    }
                        .custom-textarea-scroll::-webkit-scrollbar-thumb:hover {
                        background: #777; /* Hover par thoda aur light */
                    }
            `}</style>

            {/* Header */}
            <div className="w-full flex-none h-18.75 p-5 pl-17 lg:p-5 border-b border-black/10 dark:border-white/5 bg-white dark:bg-[#171717] z-10 flex items-center justify-between transition-all duration-300">
                <h2 className="text-md font-semibold text-gray-600 dark:text-gray-300 text-center">
                    {activeChatId ? "Your Space to Ask & Explore" : "New Chat"}
                </h2>
                <ThemeToggle /> 
            </div>

            {/* Messages Area - Isme renderContent() call kiya hai */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-textarea-scroll lg:px-10 xl:px-20 2xl:px-50 transition-all duration-300">
                {/* --- CONDITION START --- */}
                {messages.length === 0 ? (
                    <WelcomeScreen />
                ) : (
                    renderContent() // Purana renderContent logic jo messages dikhata hai
                )}
                {/* --- CONDITION END --- */}
                {isAiTyping && (
                    <div className="flex flex-col items-start animate-pulse mt-4">
                        <div className="dark:bg-[#212121] bg-(--quadratic-color) font-medium p-4 rounded-2xl rounded-tl-none border border-black/5 dark:border-white/5 flex items-center gap-3">
                            <Loader2 className="animate-spin font-bold text-blue-500" size={18} />
                            <span className="text-sm text-black dark:text-gray-400">Ask Freely is thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input Area */}
            <div className="flex-none p-4 pb-safe bg-white dark:bg-[#121212] w-full mx-auto transition-all duration-300">
                <div className="max-w-4xl mx-auto flex  items-end gap-2 border border-black/10 dark:border-white/5 rounded-xl  p-3">
                    
                    <textarea
                        rows="1"
                        className="flex-1 bg-transparent text-black dark:text-gray-200 p-2 outline-none resize-none max-h-40 custom-textarea-scroll placeholder:text-gray-600 "
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            // Auto-resize logic:
                            e.target.style.height = 'auto'; //phle height auto krdo taki scrollHeight shi mile
                            e.target.style.height = e.target.scrollHeight + 'px'; //fir scrollHeight ke hisab se height set krdo
                        }} 
                        onKeyDown={(e) => {
                            // Enter se send ho, Shift+Enter se naya line aaye
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Type a message..."
                        style={{ minHeight: '44px' }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isAiTyping || !input.trim()}
                        className="bg-(--tertiary-color) disabled:hover:bg-[#445b76] dark:bg-blue-600 dark:hover:bg-blue-700 p-3 rounded-xl disabled:opacity-30 dark:disabled:hover:bg-blue-600 transition-colors mb-1"
                    >
                        <Send size={20} className="text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;


// useEffect(() => {
//     const fetchHistory = async () => {
//         try {
//             const res = await axios.get(.../${activeChatId}, { withCredentials: true });
//             if (res.data.success) setMessages(res.data.messages);
//         } catch (err) {
//             console.error("History fetch error:", err);
//         }
//     };

//     if (activeChatId) {
//         fetchHistory();
//     } else {
//         // Yeh zaroori hai: Agar koi chat selected nahi hai toh purani screen saaf karo
//         setMessages([]);
//     }
// }, [activeChatId]);

// dono ka   difference 
    // useEffect(() => {

    //     if (activeChatId) {
    //         axios.get(https://ask-freely.onrender.com/api/chat/messages/${activeChatId}, { withCredentials: true })
    //             .then(res => { if (res.data.success) setMessages(res.data.messages); })
    //             .catch(err => console.error("History fetch error:", err));
    //     } else {
    //         setMessages([]);
    //     }
    // }, [activeChatId]);

// Bhai, pehle ek chota sa correction: Tune likha hai ki "niche wale mein async use nahi kiya," par actually niche wale mein hi async/await use hua hai. Upar wala code .then() (Promises) use kar raha hai.

// Dono mein se Best kaunsa hai? Industry standard ke hisaab se Niche wala (async/await) best hai. Chalo detail mein samjhata hoon kyun.

// 1. Upar Wala Code: .then() (Classic Way)
// Yeh JavaScript ka purana (ES6) tarika hai.

// Kaise kaam karta hai: Yeh code kehta hai—"Axios, tum request bhejo, jab free ho jao toh .then ke andar wala kaam kar dena, tab tak main aage ka code chala raha hoon."

// Problem: Jab tumhare paas 3-4 API calls ek ke baad ek karni ho, toh yeh .then().then().then() ban jata hai, jise "Callback Hell" kehte hain. Yeh padhne mein mushkil hota hai.

// 2. Niche Wala Code: async/await (Modern & Best)
// Yeh aaj kal ka sabse popular tarika hai. Iska structure bilkul normal code jaisa dikhta hai.

// Best kyu hai?

// Readability: Isse dekh kar aisa lagta hai ki code line-by-line chal raha hai (bhale hi peeche se wo async ho).

// Error Handling: Isme try-catch block use hota hai, jo bilkul normal errors ki tarah handle hota hai.

// Clean Logic: Niche wale code mein tumne fetchHistory ko ek alag function banaya, jo ek bahut achi practice hai.

// 3. Ek Zaroori Baat: useEffect ke saath async ka natak
// Tumne notice kiya hoga ki maine useEffect(async () => ...) nahi likha, balki uske andar ek naya function const fetchHistory = async () => ... banaya.

// Kyun? React ka useEffect kabhi bhi seedha async function accept nahi karta. Agar tum useEffect(async () => ...) likhoge, toh React gussa ho jayega. Kyun? Kyunki async function hamesha ek Promise return karta hai, lekin useEffect ko sirf ek Cleanup Function (ya kuch nahi) chahiye hota hai.

// Isliye hum andar ek alag function banate hain aur use turant niche call kar dete hain: if (activeChatId) fetchHistory();.