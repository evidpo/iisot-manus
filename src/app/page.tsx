"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/auth';
import { Navbar } from '../components/layout/Navbar';
import { ChatMessage } from '../components/chat/ChatMessage';
import { ChatInput } from '../components/chat/ChatInput';
import { ChatHistory } from '../components/chat/ChatHistory';
import { ChatService } from '../lib/chat-service';
import Link from 'next/link';

export default function ChatPage() {
  const { user, loading } = useAuth();
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Загрузка истории чатов при монтировании компонента
  useEffect(() => {
    if (user) {
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
  const saveMessages = (updatedHistory) => {
    if (user) {
      localStorage.setItem(`user_chats_${user.id}`, JSON.stringify(updatedHistory));
    }
  };
  
  // Обработка отправки сообщения
  const handleSendMessage = async (content) => {
    if (!content.trim() || isProcessing) return;
    
    setIsProcessing(true);
    
    // Добавляем сообщение пользователя
    const userMessage = {
      id: `msg_${Date.now()}`,
      content,
      isUser: true,
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
        content: response.text,
        isUser: false,
        timestamp: new Date(),
        references: response.references
      };
      
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      saveMessages(finalMessages);
    } catch (error) {
      console.error('Ошибка при получении ответа:', error);
      
      // Добавляем сообщение об ошибке
      const errorMessage = {
        id: `msg_${Date.now() + 1}`,
        content: 'Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте еще раз.',
        isUser: false,
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
  const handleSelectChat = (chatId) => {
    const selectedChat = chatHistory.find(chat => chat.id === chatId);
    if (selectedChat) {
      setSelectedChat(chatId);
      setMessages(selectedChat.messages);
    }
  };
  
  // Создание нового чата
  const handleNewChat = () => {
    setSelectedChat(null);
    setMessages([]);
  };
  
  // Редактирование чата
  const handleEditChat = (chatId) => {
    const chatToEdit = chatHistory.find(chat => chat.id === chatId);
    if (chatToEdit) {
      const newTitle = prompt('Введите новое название чата', chatToEdit.title);
      if (newTitle) {
        const updatedHistory = chatHistory.map(chat =>
          chat.id === chatId ? { ...chat, title: newTitle } : chat  
        );
        setChatHistory(updatedHistory);
        saveMessages(updatedHistory);
      }
    }
  };
  
  // Удаление чата
  const handleDeleteChat = (chatId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот чат?')) {
      const updatedHistory = chatHistory.filter(chat => chat.id !== chatId);
      setChatHistory(updatedHistory);
      saveMessages(updatedHistory);
      
      if (selectedChat === chatId) {
        setSelectedChat(null);
        setMessages([]);
      }
    }
  };

  // Переключение видимости боковой панели
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
        <div
          className={`${
            isSidebarOpen ? 'w-64' : 'w-0'
          } bg-gray-100 border-r border-gray-200 flex flex-col transition-width duration-300 ease-in-out`}
        >
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
              onEditChat={handleEditChat}  
              onDeleteChat={handleDeleteChat}
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
          <div className="border-b border-gray-200 p-4 flex justify-between items-center">
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-gray-700 focus:outline-none mr-4"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isSidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
            <h1 className="text-xl font-semibold">
              {selectedChat 
                ? chatHistory.find(chat => chat.id === selectedChat)?.title || 'Чат с ассистентом' 
                : 'Новый чат'
              }
            </h1>
            <div className="w-6"></div>
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
                  <button className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg text-left textsm">
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
</div> {/* Поле ввода сообщения */}
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