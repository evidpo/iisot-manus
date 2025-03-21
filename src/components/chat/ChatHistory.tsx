import React from 'react';
import { ChatMessage } from './ChatMessage';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  hasAttachments?: boolean;
  attachments?: {
    name: string;
    url: string;
    type: 'pdf' | 'doc' | 'image' | 'link';
  }[];
}

interface ChatHistoryProps {
  messages: Message[];
  loading?: boolean;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  messages,
  loading = false,
}) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-white">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          <p className="text-lg mb-2">Начните диалог с ассистентом</p>
          <p className="text-sm">Задайте вопрос по охране труда или запросите помощь с документами</p>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.content}
              isUser={message.isUser}
              timestamp={message.timestamp}
              hasAttachments={message.hasAttachments}
              attachments={message.attachments}
            />
          ))}
        </>
      )}
      
      {loading && (
        <div className="flex justify-start mb-4">
          <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-3 shadow-sm">
            <div className="flex space-x-2">
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '600ms' }}></div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};
