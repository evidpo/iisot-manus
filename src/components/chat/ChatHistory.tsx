import React, { useState } from 'react';

interface ChatHistoryProps {
  chats: Array<{
    id: string;
    title: string;
    updatedAt: Date | string;
  }>;
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onEditChat?: (chatId: string) => void;
  onDeleteChat?: (chatId: string) => void;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  chats,
  selectedChatId,
  onSelectChat,
  onEditChat,
  onDeleteChat
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(openMenuId === chat.id ? null : chat.id);
                }}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
              {openMenuId === chat.id && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onEditChat?.(chat.id);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      Редактировать
                    </a>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onDeleteChat?.(chat.id);
                      }}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      role="menuitem"
                    >
                      Удалить
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatHistory;