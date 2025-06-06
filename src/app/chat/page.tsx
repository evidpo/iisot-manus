"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth';
import { Navbar } from '../../components/layout/Navbar';
import { ChatMessage } from '../../components/chat/ChatMessage';
import { ChatInput } from '../../components/chat/ChatInput';
import { ChatHistory } from '../../components/chat/ChatHistory';
import { ChatService } from '../../lib/chat-service';
import Link from 'next/link';
import type { Message } from '../../lib/types';

// Сессия чата
interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export default function ChatPage() {
  const { user, loading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  
  // Загрузка истории чатов при монтировании компонента
  useEffect(() => {
    if (user) {
      // В реальном приложении здесь был бы запрос к API
      const savedChats = localStorage.getItem(`user_chats_${user.id}`);
      if (savedChats) {
        try {
          const chats = JSON.parse(savedChats);
          setChatHistory(chats);
          
          // Если есть чаты, выбираем последний
          if (chats.length > 0) {
            const lastChat = chats[chats.length - 1];
            setSelectedChat(lastChat.id);
            setMessages(lastChat.messages);
          }
        } catch (error) {
          console.error('Ошибка при загрузке истории чатов:', error);
        }
      }
    }
  }, [user]);
  
  // Сохранение сообщений в историю чатов
  const saveMessages = (newMessages: Message[]): void => {
    if (!user) return;
    
    let updatedHistory = [...chatHistory];
    
    if (selectedChat) {
      // Обновляем существующий чат
      updatedHistory = updatedHistory.map(chat => 
        chat.id === selectedChat 
          ? { ...chat, messages: newMessages, updatedAt: new Date() } 
          : chat
      );
    } else {
      // Создаем новый чат
      const newChat = {
        id: `chat_${Date.now()}`,
        title: newMessages[0]?.content.substring(0, 30) + '...' || 'Новый чат',
        messages: newMessages,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      updatedHistory.push(newChat);
      setSelectedChat(newChat.id);
    }
    
    setChatHistory(updatedHistory);
    localStorage.setItem(`user_chats_${user.id}`, JSON.stringify(updatedHistory));
  };
  
  // Обработка отправки сообщения
  const handleSendMessage = async (content: string): Promise<void> => {
    if (!content.trim() || isProcessing) return;
    
    setIsProcessing(true);
    
    // Добавляем сообщение пользователя
    const userMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveMessages(updatedMessages);
    
    try {
      // Получаем ответ от ассистента
      const response = await ChatService.getAssistantResponse(content, user.role);
      
      // Добавляем ответ ассистента
      const assistantMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: response.text,
        references: response.references,
        timestamp: new Date()
      };
      
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      saveMessages(finalMessages);
    } catch (error) {
      console.error('Ошибка при получении ответа:', error);
      
      // Добавляем сообщение об ошибке
      const errorMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        content: 'Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте еще раз.',
        timestamp: new Date()
      };
      
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      saveMessages(finalMessages);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Выбор чата из истории
  const handleSelectChat = (chatId: string): void => {
    const selected = chatHistory.find(chat => chat.id === chatId);
    if (selected) {
      setSelectedChat(chatId);
      setMessages(selected.messages);
    }
  };
  
  // Создание нового чата
  const handleNewChat = (): void => {
    setSelectedChat(null);
    setMessages([]);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!user) {
    // Перенаправление на страницу входа, если пользователь не авторизован
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Требуется авторизация</h1>
        <p className="mb-4">Для доступа к чату необходимо войти в систему</p>
        <Link 
          href="/auth/login" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Войти
        </Link>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userRole={user.role} userName={user.fullName} />
      
      <div className="flex-1 flex">
        {/* Боковая панель с историей чатов */}
        <div className="w-64 bg-gray-100 border-r border-gray-200 flex flex-col">
          <div className="p-4">
            <button
              onClick={handleNewChat}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Новый чат
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <ChatHistory 
              chats={chatHistory} 
              selectedChatId={selectedChat} 
              onSelectChat={handleSelectChat} 
            />
          </div>
          
          <div className="p-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Роль: {
                user.role === 'specialist' ? 'Специалист по ОТ' :
                user.role === 'manager' ? 'Руководитель' :
                user.role === 'hr' ? 'HR-специалист' :
                user.role === 'employee' ? 'Сотрудник' : 'Пользователь'
              }
            </div>
          </div>
        </div>
        
        {/* Основная область чата */}
        <div className="flex-1 flex flex-col bg-white">
          {/* Заголовок чата */}
          <div className="border-b border-gray-200 p-4">
            <h1 className="text-xl font-semibold">
              {selectedChat 
                ? chatHistory.find(chat => chat.id === selectedChat)?.title || 'Чат с ассистентом' 
                : 'Новый чат'
              }
            </h1>
            <p className="text-sm text-gray-600">
              Задайте вопрос по охране труда, и я помогу вам найти ответ
            </p>
          </div>
          
          {/* Сообщения */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="bg-blue-100 rounded-full p-4 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold mb-2">Ассистент по охране труда</h2>
                <p className="text-gray-600 mb-6 max-w-md">
                  Я помогу вам с вопросами по законодательству, нормам безопасности и документообороту в сфере охраны труда.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg">
                  <button className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg text-left text-sm">
                    Расскажи о требованиях к проведению инструктажа по охране труда
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg text-left text-sm">
                    Какие документы нужны для специальной оценки условий труда?
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg text-left text-sm">
                    Как оформить несчастный случай на производстве?
                  </button>
                  <button className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg text-left text-sm">
                    Какие изменения в законодательстве по охране труда были в 2025 году?
                  </button>
                </div>
              </div>
            ) : (
              messages.map(message => (
                <ChatMessage 
                  key={message.id} 
                  message={message} 
                  userRole={user.role} 
                />
              ))
            )}
          </div>
          
          {/* Поле ввода сообщения */}
          <div className="border-t border-gray-200 p-4">
            <ChatInput 
              onSendMessage={handleSendMessage} 
              isProcessing={isProcessing} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
