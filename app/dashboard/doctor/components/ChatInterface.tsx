'use client';

import { Camera, Send, Trash2 } from "lucide-react";
import { toast } from 'sonner';
import { useState, useRef, useEffect } from "react";
import { sendMessageToAI, deleteAllChatHistory } from '../action'; // ← Thêm deleteAllChatHistory
import { ChatMessage } from '@/models/ai';
import { useRouter } from 'next/navigation'; // ← Thêm import này

export interface Message {
  id: number;
  type: 'ai' | 'user';
  text: string;
}

interface ChatInterfaceProps {
  initialMessages: Message[];
  suggestedPrompts: string[];
}

export default function ChatInterface({ 
  initialMessages: initialMessagesProp, 
  suggestedPrompts: suggestedPromptsProp
}: ChatInterfaceProps) {
  const router = useRouter(); // ← Thêm router
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialMessagesProp);
  const [suggestedPrompts] = useState<string[]>(suggestedPromptsProp);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // ← Thêm state này
  
  // Initialize conversation history from loaded messages (excluding the default welcome message)
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>(() => {
    // If there are messages and it's not just the default welcome message
    if (initialMessagesProp.length > 1 || (initialMessagesProp.length === 1 && initialMessagesProp[0].id !== 1)) {
      return initialMessagesProp.map(msg => ({
        role: msg.type === 'ai' ? 'assistant' as const : 'user' as const,
        content: msg.text
      }));
    }
    return [];
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    const userMessage = message.trim();
    if (!userMessage || isLoading) return;

    // Add user message
    const userMessageObj = { id: Date.now(), type: "user" as const, text: userMessage };
    setMessages(prev => [...prev, userMessageObj]);
    setMessage("");
    
    setIsLoading(true);
    
    try {
      // Update conversation history
      const chatMessage: ChatMessage = { role: 'user', content: userMessage };
      const updatedHistory = [...conversationHistory, chatMessage];
      
      // Call server action - gọi trực tiếp như function bình thường
      const aiResponse = await sendMessageToAI(userMessage, updatedHistory);
      
      // Add AI response to conversation history
      const aiChatMessage: ChatMessage = { role: 'assistant', content: aiResponse };
      setConversationHistory([...updatedHistory, aiChatMessage]);
      
      // Add AI message to UI
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "ai" as const,
          text: aiResponse,
        },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          type: "ai" as const,
          text: "Đã xảy ra lỗi khi xử lý tin nhắn. Vui lòng thử lại sau.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = async () => {
    if (!confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử trò chuyện? Hành động này không thể hoàn tác.')) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      const success = await deleteAllChatHistory();
      
      if (success) {
        const defaultMessage = {
          id: 1,
          type: "ai" as const,
          text: 'Chào bạn! Mình là AI của ứng dụng, và bạn có thể coi mình là "Bác Sĩ Riêng" cực kỳ tận tâm cho cây trồng của bạn. Cây đang có dấu hiệu lạ, úa vàng hay bị côn trùng ghé thăm ư? Đừng lo lắng! Bạn chỉ việc chụp một tấm ảnh gửi cho mình, và "tít tắc", mình sẽ chẩn đoán bệnh cùng đưa ra lời khuyên chăm sóc tốt nhất cho "bệnh nhân xanh" của bạn đó!',
        };
        
        setMessages([defaultMessage]);
        setConversationHistory([]);
        router.refresh();
        
        toast.success('Đã xóa lịch sử trò chuyện', {
          description: 'Cuộc trò chuyện đã được đặt lại về trạng thái ban đầu',
          duration: 3000,
        });
      } else {
        toast.error('Lỗi', {
          description: 'Không thể xóa lịch sử trò chuyện. Vui lòng thử lại sau.',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error deleting chat history:', error);
      toast.error('Lỗi', {
        description: 'Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại sau.',
        duration: 3000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] md:h-screen w-full relative">
      {/* Reset Chat Button */}
      <div className="flex justify-end px-4 pt-4">
        <button 
          onClick={resetChat}
          disabled={isDeleting || isLoading}
          className="flex items-center gap-2 text-sm text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Xóa lịch sử trò chuyện"
        >
          <Trash2 className="size-4" />
          <span className="hidden sm:inline">
            {isDeleting ? 'Đang xóa...' : 'Xóa lịch sử trò chuyện'}
          </span>
        </button>
      </div>

      {/* Chat Messages Area - Scrollable */}
      <div className="flex-1 overflow-y-auto px-[20px] md:px-[40px] py-[20px] md:py-[30px] space-y-4 pb-[180px] md:pb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`box-border flex flex-col gap-[10px] items-start overflow-clip p-[16px] md:p-[20px] relative rounded-[18px] max-w-[85%] md:max-w-[65%] ${
                msg.type === "ai"
                  ? "bg-[#b9e2b3] rounded-tl-none"
                  : "bg-[#ebf5ed] rounded-tr-none"
              }`}
            >
              <p className="font-['Be_Vietnam_Pro'] font-semibold leading-[1.5] text-[14px] md:text-[16px] text-black whitespace-pre-wrap">
                {msg.text}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#b9e2b3] rounded-[18px] rounded-tl-none p-[16px] md:p-[20px]">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts - Only show if few messages */}
      {messages.length <= 2 && (
        <div className="px-[20px] md:px-[40px] pb-[90px] md:pb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[12px] md:gap-[16px]">
            {suggestedPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setMessage(prompt)}
                disabled={isLoading || isDeleting}
                className="bg-[#ebf5ed] box-border flex items-center justify-center px-[12px] md:px-[16px] py-[10px] md:py-[12px] rounded-[14px] hover:bg-[#d5e5d1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <p className="font-['Be_Vietnam_Pro'] font-medium text-[14px] leading-[20px] text-black text-center">
                  {prompt}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area - Fixed at bottom */}
      <div className="w-full px-[20px] md:px-[40px] py-3 md:py-4 bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 md:static md:border-t-0 mb-16 md:mb-0 z-10">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <button className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50" disabled={isLoading || isDeleting}>
            <Camera className="size-5" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            placeholder={isLoading ? "Đang xử lý..." : "Nhập tin nhắn..."}
            disabled={isLoading || isDeleting}
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-[14px] md:text-[16px] disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-600 transition-colors"
            disabled={!message.trim() || isLoading || isDeleting}
          >
            <Send className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}