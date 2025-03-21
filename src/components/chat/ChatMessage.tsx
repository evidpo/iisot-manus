import React from 'react';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  hasAttachments?: boolean;
  attachments?: {
    name: string;
    url: string;
    type: 'pdf' | 'doc' | 'image' | 'link';
  }[];
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isUser,
  timestamp,
  hasAttachments = false,
  attachments = [],
}) => {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[75%] ${isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'} rounded-lg px-4 py-3 shadow-sm`}>
        <div className="flex items-center mb-1">
          <span className="text-xs opacity-75">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="whitespace-pre-wrap">{message}</div>
        
        {hasAttachments && attachments.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            {attachments.map((attachment, index) => (
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
