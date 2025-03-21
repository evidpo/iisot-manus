import React from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  placeholder = 'Введите ваш вопрос...',
  disabled = false,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && value.trim()) {
      e.preventDefault();
      onSend();
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
            disabled={disabled}
            className="py-3"
            onKeyDown={handleKeyDown}
          />
        </div>
        <Button
          onClick={onSend}
          disabled={disabled || !value.trim()}
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
