"use client";

import Sidebar from "../Sidebar";
import { Camera, Send } from "lucide-react";
import { useState } from "react";

export default function DoctorPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "ai",
      text: 'Chào bạn! Mình là AI của ứng dụng, và bạn có thể coi mình là "Bác Sĩ Riêng" cực kỳ tận tâm cho cây trồng của bạn. Cây đang có dấu hiệu lạ, úa vàng hay bị côn trùng ghé thăm ư? Đừng lo lắng! Bạn chỉ việc chụp một tấm ảnh gửi cho mình, và "tít tắc", mình sẽ chẩn đoán bệnh cùng đưa ra lời khuyên chăm sóc tốt nhất cho "bệnh nhân xanh" của bạn đó!',
    },
  ]);

  const suggestedPrompts = [
    "Chụp Ảnh Cây Bệnh",
    "Cây tôi bị bệnh, nên làm gì?",
    "Ngày tưới bao nhiêu lần...",
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { id: Date.now(), type: "user", text: message }]);
      setMessage("");
      // Simulate AI response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            type: "ai",
            text: "Cảm ơn bạn đã chia sẻ! Tôi đang phân tích thông tin và sẽ đưa ra lời khuyên phù hợp ngay.",
          },
        ]);
      }, 1000);
    }
  };

  return (
    <div className="bg-[#fffcf6] flex flex-col md:flex-row items-start relative min-h-screen w-full overflow-hidden">
      <Sidebar activePage="doctor" />

      <div className="flex flex-col h-screen w-full md:ml-[60px] lg:ml-[72px] relative">
        {/* Chat Messages Area - Scrollable */}
        <div className="flex-1 overflow-y-auto px-[20px] md:px-[40px] py-[20px] md:py-[30px] space-y-4">
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
                <p className="font-['Be_Vietnam_Pro'] font-semibold leading-[1.5] text-[14px] md:text-[16px] text-black">
                  {msg.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Suggested Prompts - Only show if few messages */}
        {messages.length <= 2 && (
          <div className="px-[20px] md:px-[40px] pb-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[12px] md:gap-[16px]">
              {suggestedPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setMessage(prompt)}
                  className="bg-[#ebf5ed] box-border flex items-center justify-center px-[12px] md:px-[16px] py-[10px] md:py-[12px] rounded-[14px] hover:bg-[#d5e5d1] transition-colors"
                >
                  <p className="font-['Be_Vietnam_Pro'] font-semibold text-[13px] md:text-[15px] text-black text-center">
                    {prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area - Fixed at bottom */}
        <div className="border-t border-[#2e8623]/20 bg-[#fffcf6] px-[20px] md:px-[40px] py-[15px] md:py-[20px] pb-[20px] md:pb-[25px]">
          <div className="bg-[#ebf5ed] border border-[#2e8623] border-solid box-border flex gap-[8px] md:gap-[10px] h-[56px] md:h-[64px] items-center px-[10px] md:px-[12px] py-[8px] rounded-[18px] max-w-[1000px] mx-auto">
            <button className="h-[40px] md:h-[48px] w-[40px] md:w-[48px] flex items-center justify-center hover:opacity-80 transition-opacity shrink-0">
              <Camera className="size-[24px] md:size-[28px] text-[#2e8623]" />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Nhập tin nhắn..."
              className="flex-1 bg-transparent outline-none px-2 text-[14px] md:text-[16px] text-black placeholder:text-[#191f19]/40"
            />
            <button
              onClick={handleSendMessage}
              className="h-[40px] md:h-[48px] w-[40px] md:w-[48px] bg-[#2e8623] rounded-full flex items-center justify-center hover:bg-[#267019] transition-colors shrink-0"
            >
              <Send className="size-[20px] md:size-[24px] text-[#fffcf6]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
