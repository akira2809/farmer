'use server';

import { chatWithAIAction, deleteHistoryChatAction } from '@/action/ai';
import { ChatMessage } from '@/models/ai';

export async function sendMessageToAI(
  message: string,
  conversationHistory: ChatMessage[] = []
): Promise<string> {
  try {
    const userMessage: ChatMessage = { role: 'user', content: message };
    const updatedHistory = [...conversationHistory, userMessage];

    const response = await chatWithAIAction({
      message,
      conversation_history: updatedHistory,
    });

    return response?.data?.message || 'Xin lỗi, tôi không thể xử lý yêu cầu ngay lúc này.';
  } catch (error) {
    console.error('Error in sendMessageToAI:', error);
    return 'Đã xảy ra lỗi khi gửi tin nhắn. Vui lòng thử lại sau.';
  }
}

export async function deleteAllChatHistory(): Promise<boolean> {
  try {
    return await deleteHistoryChatAction();
  } catch (error) {
    console.error('Error in deleteAllChatHistory:', error);
    return false;
  }
}