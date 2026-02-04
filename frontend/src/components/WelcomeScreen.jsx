import { MessageSquare, Zap, ShieldAlert } from "lucide-react";
import { useEffect, useState } from 'react';

const WelcomeScreen = () => {

  const [userName, setUserName] = useState('User');

  useEffect(()=> {
    const storedName = localStorage.getItem('userName');
    if(storedName){
      const firstName = storedName || "Buddy";
      setUserName(firstName);
    }
  },[]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6  py-10 animate-in fade-in zoom-in duration-700">
      <div className="dark:bg-blue-600/10 bg-[#4b5c6eac]  p-4 rounded-full mb-6">
        <Zap className="dark:text-blue-500" size={48} />
      </div>

      <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
        Hello {userName}, <br className="md:hidden"/> How can I help you?
      </h1>
      <p className="text-black dark:text-gray-400 max-w-md mb-10 transition-all duration-300">
        I'm your AI assistant. You can ask me about coding, technology, creative
        thinking, problem-solving, general knowledge, or any topic you need
        assistance with.{" "}
      </p>
    </div>
  );
};
export default WelcomeScreen;
