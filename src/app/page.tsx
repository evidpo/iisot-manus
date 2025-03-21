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
          className={`${isSidebarOpen ? 'w-64' : 'w-0'
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
          /* Замените блок кнопки переключения сайдбара в src/app/page.tsx */

            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-gray-700 focus:outline-none mr-4"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.85719 3H15.1428C16.2266 2.99999 17.1007 2.99998 17.8086 3.05782C18.5375 3.11737 19.1777 3.24318 19.77 3.54497C20.7108 4.02433 21.4757 4.78924 21.955 5.73005C22.2568 6.32234 22.3826 6.96253 22.4422 7.69138C22.5 8.39925 22.5 9.27339 22.5 10.3572V13.6428C22.5 14.7266 22.5 15.6008 22.4422 16.3086C22.3826 17.0375 22.2568 17.6777 21.955 18.27C21.4757 19.2108 20.7108 19.9757 19.77 20.455C19.1777 20.7568 18.5375 20.8826 17.8086 20.9422C17.1008 21 16.2266 21 15.1428 21H8.85717C7.77339 21 6.89925 21 6.19138 20.9422C5.46253 20.8826 4.82234 20.7568 4.23005 20.455C3.28924 19.9757 2.52433 19.2108 2.04497 18.27C1.74318 17.6777 1.61737 17.0375 1.55782 16.3086C1.49998 15.6007 1.49999 14.7266 1.5 13.6428V10.3572C1.49999 9.27341 1.49998 8.39926 1.55782 7.69138C1.61737 6.96253 1.74318 6.32234 2.04497 5.73005C2.52433 4.78924 3.28924 4.02433 4.23005 3.54497C4.82234 3.24318 5.46253 3.11737 6.19138 3.05782C6.89926 2.99998 7.77341 2.99999 8.85719 3ZM6.35424 5.05118C5.74907 5.10062 5.40138 5.19279 5.13803 5.32698C4.57354 5.6146 4.1146 6.07354 3.82698 6.63803C3.69279 6.90138 3.60062 7.24907 3.55118 7.85424C3.50078 8.47108 3.5 9.26339 3.5 10.4V13.6C3.5 14.7366 3.50078 15.5289 3.55118 16.1458C3.60062 16.7509 3.69279 17.0986 3.82698 17.362C4.1146 17.9265 4.57354 18.3854 5.13803 18.673C5.40138 18.8072 5.74907 18.8994 6.35424 18.9488C6.97108 18.9992 7.76339 19 8.9 19H9.5V5H8.9C7.76339 5 6.97108 5.00078 6.35424 5.05118ZM11.5 5V19H15.1C16.2366 19 17.0289 18.9992 17.6458 18.9488C18.2509 18.8994 18.5986 18.8072 18.862 18.673C19.4265 18.3854 19.8854 17.9265 20.173 17.362C20.3072 17.0986 20.3994 16.7509 20.4488 16.1458C20.4992 15.5289 20.5 14.7366 20.5 13.6V10.4C20.5 9.26339 20.4992 8.47108 20.4488 7.85424C20.3994 7.24907 20.3072 6.90138 20.173 6.63803C19.8854 6.07354 19.4265 5.6146 18.862 5.32698C18.5986 5.19279 18.2509 5.10062 17.6458 5.05118C17.0289 5.00078 16.2366 5 15.1 5H11.5ZM5 8.5C5 7.94772 5.44772 7.5 6 7.5H7C7.55229 7.5 8 7.94772 8 8.5C8 9.05229 7.55229 9.5 7 9.5H6C5.44772 9.5 5 9.05229 5 8.5ZM5 12C5 11.4477 5.44772 11 6 11H7C7.55229 11 8 11.4477 8 12C8 12.5523 7.55229 13 7 13H6C5.44772 13 5 12.5523 5 12Z"
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