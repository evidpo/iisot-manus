import React from 'react';

interface ChatMessageProps {
  message: {
    id: string;
    content: string;
    isUser?: boolean;
    timestamp?: Date | string;
    hasAttachments?: boolean;
    attachments?: {
      name: string;
      url: string;
      type: 'pdf' | 'doc' | 'image' | 'link';
    }[];
    references?: { 
      title: string; 
      url: string; 
      description?: string 
    }[];
  };
  userRole?: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  userRole,
}) => {
  // Безопасная проверка и преобразование timestamp
  const formatTimestamp = (timestamp?: Date | string) => {
    if (!timestamp) return '';
    
    const date = timestamp instanceof Date 
      ? timestamp 
      : new Date(timestamp);
    
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[75%] ${message.isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'} rounded-lg px-4 py-3 shadow-sm`}>
        <div className="flex items-center mb-1">
          <span className="text-xs opacity-75">
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
        <div className="whitespace-pre-wrap">{message.content}</div>
        
        {message.references && message.references.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs font-semibold mb-1">Источники:</p>
            {message.references.map((ref, index) => (
              <a 
                key={index} 
                href={ref.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-xs text-blue-400 hover:underline truncate"
              >
                {ref.title}
              </a>
            ))}
          </div>
        )}
        
        {message.hasAttachments && message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            {message.attachments.map((attachment, index) => (
              <div key={index} className="flex items-center text-sm mt-1">
                <span className="mr-2">
                  {attachment.type === 'pdf' && '📄'}
                  {attachment.type === 'doc' && '📝'}
                  {attachment.type === 'image' && '🖼️'}
                  {attachment.type === 'link' && '🔗'}
                </span>
                <a 
                  href={attachment.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {attachment.name}
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;