import React, { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface ChatInputProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: (message: string) => void;
  placeholder?: string;
  isProcessing?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value: externalValue,
  onChange: externalOnChange,
  onSendMessage,
  placeholder = 'Введите ваш вопрос...',
  isProcessing = false,
}) => {
  const [internalValue, setInternalValue] = useState('');

  const value = externalValue !== undefined ? externalValue : internalValue;
  const onChange = externalOnChange || ((e) => setInternalValue(e.target.value));

  const handleSend = () => {
    if (value.trim()) {
      onSendMessage(value.trim());
      setInternalValue(''); // Очищаем внутреннее состояние
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && value.trim()) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4 sticky bottom-0">
      <div className="flex items-center gap-2">
        <div className="flex-grow">
          <Input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={isProcessing}
            className="py-3"
            onKeyDown={handleKeyDown}
          />
        </div>
        <Button
          onClick={handleSend}
          disabled={isProcessing || !value.trim()}
          variant="primary"
        >
          Отправить
        </Button>
      </div>
      <div className="text-xs text-gray-500 mt-2">
        Нажмите Enter для отправки сообщения
      </div>
    </div>
  );
};

export default ChatInput;