import React from 'react';

interface ChatHistoryProps {
  chats: Array<{
    id: string;
    title: string;
    updatedAt: Date | string;
  }>;
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  chats,
  selectedChatId,
  onSelectChat
}) => {
  return (
    <div className="space-y-2 p-2">
      {chats.map((chat) => (
        <div 
          key={chat.id}
          onClick={() => onSelectChat(chat.id)}
          className={`p-3 rounded-lg cursor-pointer ${
            selectedChatId === chat.id 
              ? 'bg-blue-100 border border-blue-300' 
              : 'hover:bg-gray-100 border border-transparent'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="font-medium truncate max-w-[200px]">
              {chat.title}
            </span>
            <span className="text-xs text-gray-500">
              {new Date(chat.updatedAt).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'short'
              })}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;