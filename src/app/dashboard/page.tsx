"use client";

import React from 'react';
import { useAuth } from '../../lib/auth';
import { Navbar } from '../../components/layout/Navbar';
import { pricingPlans, getPlanLimits } from '../../lib/pricing-plans';
import Link from 'next/link';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [currentPlan, setCurrentPlan] = React.useState('free');
  const [subscriptionEndDate, setSubscriptionEndDate] = React.useState(null);
  const [usageStats, setUsageStats] = React.useState({
    documentsCreated: 0,
    documentsLimit: 5,
    chatHistoryDays: 7,
    usersCount: 1,
    apiAccess: false,
    advancedAnalytics: false
  });
  
  // Загрузка информации о текущем тарифе пользователя
  React.useEffect(() => {
    if (user) {
      // В реальном приложении здесь был бы запрос к API
      const savedPlan = localStorage.getItem(`user_plan_${user.id}`);
      if (savedPlan) {
        try {
          const planData = JSON.parse(savedPlan);
          setCurrentPlan(planData.planId);
          setSubscriptionEndDate(new Date(planData.endDate));
          
          // Получаем лимиты по текущему тарифу
          const limits = getPlanLimits(planData.planId);
          
          // Имитация статистики использования
          setUsageStats({
            documentsCreated: Math.floor(Math.random() * 10),
            documentsLimit: limits.documentsPerMonth,
            chatHistoryDays: limits.chatHistoryDays,
            usersCount: Math.min(3, limits.maxUsers),
            apiAccess: limits.apiAccess,
            advancedAnalytics: limits.advancedAnalytics
          });
        } catch (error) {
          console.error('Ошибка при загрузке информации о тарифе:', error);
        }
      }
    }
  }, [user]);
  
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
        <p className="mb-4">Для доступа к панели управления необходимо войти в систему</p>
        <Link 
          href="/auth/login" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Войти
        </Link>
      </div>
    );
  }
  
  const planInfo = pricingPlans.find(p => p.id === currentPlan);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userRole={user.role} userName={user.fullName} />
      
      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Панель управления</h1>
          <p className="mt-2 text-gray-600">Добро пожаловать, {user.fullName}!</p>
          
          {/* Информация о текущем тарифе */}
          <div className="mt-8 bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">Информация о подписке</h2>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Текущий тариф: <span className="font-bold text-blue-600">{planInfo?.name || 'Базовый'}</span></h3>
                  {subscriptionEndDate && (
                    <p className="mt-1 text-sm text-gray-600">
                      Активен до: {subscriptionEndDate.toLocaleDateString()}
                    </p>
                  )}
                  <div className="mt-4">
                    <Link 
                      href="/pricing" 
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Изменить тариф
                    </Link>
                  </div>
                </div>
                
                <div className="border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6">
                  <h3 className="text-lg font-medium text-gray-900">Способы оплаты</h3>
                  {currentPlan !== 'free' ? (
                    <div className="mt-2">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M4 4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4H4ZM4 6H20V10H4V6ZM4 12H6V14H4V12ZM8 12H10V14H8V12ZM12 12H14V14H12V12Z" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">Visa •••• 4242</p>
                          <p className="text-xs text-gray-500">Срок действия: 12/25</p>
                        </div>
                        <div className="ml-auto">
                          <button className="text-sm text-blue-600 hover:text-blue-800">
                            Изменить
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        Следующее списание: {new Date(subscriptionEndDate).toLocaleDateString()}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 text-sm text-gray-600">
                      У вас активирован бесплатный тариф. Для доступа к расширенным функциям перейдите на платный тариф.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Статистика использования */}
          <div className="mt-8 bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">Статистика использования</h2>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-base font-medium text-gray-900">Документы</h3>
                  <div className="mt-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">Создано в этом месяце</div>
                      <div className="text-sm font-medium text-gray-900">{usageStats.documentsCreated} / {usageStats.documentsLimit === Infinity ? '∞' : usageStats.documentsLimit}</div>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${usageStats.documentsLimit === Infinity ? 10 : (usageStats.documentsCreated / usageStats.documentsLimit) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base font-medium text-gray-900">История чатов</h3>
                  <div className="mt-2 text-sm text-gray-600">
                    {usageStats.chatHistoryDays === Infinity ? (
                      <span>Неограниченное хранение истории чатов</span>
                    ) : (
                      <span>Хранение истории чатов: {usageStats.chatHistoryDays} дней</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-base font-medium text-gray-900">Пользователи</h3>
                  <div className="mt-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">Активные пользователи</div>
                      <div className="text-sm font-medium text-gray-900">{usageStats.usersCount} / {usageStats.usersCount === Infinity ? '∞' : usageStats.usersCount}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-base font-medium text-gray-900">API доступ</h3>
                  <div className="mt-2 flex items-center">
                    <div className={`flex-shrink-0 h-5 w-5 ${usageStats.apiAccess ? 'text-green-500' : 'text-gray-300'}`}>
                      {usageStats.apiAccess ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-2 text-sm text-gray-600">
                      {usageStats.apiAccess ? 'Доступен' : 'Недоступен в текущем тарифе'}
                    </div>
                  </div>
                  {usageStats.apiAccess && (
                    <div className="mt-2">
                      <button className="text-sm text-blue-600 hover:text-blue-800">
                        Управление API ключами
                      </button>
                    </div>
                  )}
                </div>
                
                <div>
                  <h3 className="text-base font-medium text-gray-900">Расширенная аналитика</h3>
                  <div className="mt-2 flex items-center">
                    <div className={`flex-shrink-0 h-5 w-5 ${usageStats.advancedAnalytics ? 'text-green-500' : 'text-gray-300'}`}>
                      {usageStats.advancedAnalytics ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div className="ml-2 text-sm text-gray-600">
                      {usageStats.advancedAnalytics ? 'Доступна' : 'Недоступна в текущем тарифе'}
                    </div>
                  </div>
                  {usageStats.advancedAnalytics && (
                    <div className="mt-2">
                      <button className="text-sm text-blue-600 hover:text-blue-800">
                        Перейти к аналитике
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Последние действия */}
          <div className="mt-8 bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">Последние действия</h2>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                <li className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900">Создан документ "Инструкция по охране труда для офисных работников"</div>
                    <div className="text-sm text-gray-500">2 часа назад</div>
                  </div>
                </li>
                <li className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900">Консультация по вопросу "Требования к проведению инструктажа"</div>
                    <div className="text-sm text-gray-500">Вчера</div>
                  </div>
                </li>
                <li className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-900">Создан документ "Журнал регистрации инструктажа на рабочем месте"</div>
                    <div className="text-sm text-gray-500">3 дня назад</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
