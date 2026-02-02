import { MessageSquare, Zap, ShieldAlert } from "lucide-react";

const WelcomeScreen = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 animate-in fade-in zoom-in duration-500">
      <div className="dark:bg-blue-600/10 bg-[#4b5c6eac]  p-4 rounded-full mb-6">
        <Zap className="dark:text-blue-500" size={48} />
      </div>

      <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
        Hello buddy! How can I help you today?
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
