import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import { useNavigate, useParams } from 'react-router-dom';


const ChatPage = () => {
    // useParams se URL se chat ID milti hai
    const { id } = useParams()
    const navigate = useNavigate();
    const [refreshSidebar, setRefreshSidebar] = useState(0);

    const handleSelectChat = (chatId) => {
        if (chatId) {
            navigate(`/chat/${chatId}`); // URL update karega: /chat/123
        } else {
            navigate('/'); // New Chat ke liye wapas base URL par
        }// Sidebar se chat select karne ke liye
    };

    const triggerSidebarRefresh = (newId) => {
        setRefreshSidebar(prev => prev + 1); // Jab naya chat bane toh sidebar refresh ho
        if (newId) navigate(`/chat/${newId}`,{ replace: true }); // Pehla message bante hi URL update
    };

    return (
        <div className="flex h-screen bg-[#121212] text-white">
            <Sidebar
                onSelectChat={handleSelectChat}
                activeChatId={id}
                refreshTrigger={refreshSidebar}
            />

            <ChatWindow
                activeChatId={id}
                onFirstMessageSent={triggerSidebarRefresh}
            />
        </div>
    );
};

export default ChatPage;