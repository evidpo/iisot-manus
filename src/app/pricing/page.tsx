"use client";

import React from 'react';
import { useAuth } from '../../lib/auth';
import { Navbar } from '../../components/layout/Navbar';
import { pricingPlans } from '../../lib/pricing-plans';
import Link from 'next/link';

export default function PricingPage() {
  const { user, loading } = useAuth();
  const [selectedPlan, setSelectedPlan] = React.useState(null);
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  
  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    setShowPaymentModal(true);
  };
  
  const handleCloseModal = () => {
    setShowPaymentModal(false);
  };
  
  const handleSubscribe = () => {
    if (!selectedPlan || !user) return;
    
    // В реальном приложении здесь был бы запрос к API для оформления подписки
    
    // Для демонстрации сохраняем информацию о подписке в localStorage
    const subscriptionData = {
      userId: user.id,
      planId: selectedPlan,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 дней
      status: 'active'
    };
    
    localStorage.setItem(`user_plan_${user.id}`, JSON.stringify(subscriptionData));
    
    // Закрываем модальное окно
    setShowPaymentModal(false);
    
    // Перенаправляем на панель управления
    window.location.href = '/dashboard';
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userRole={user?.role} userName={user?.fullName} />
      
      <div className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Тарифные планы
            </h1>
            <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
              Выберите подходящий тариф для вашей организации
            </p>
          </div>
          
          <div className="mt-12 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-x-6">
            {pricingPlans.map((plan) => (
              <div 
                key={plan.id}
                className={`relative p-6 rounded-lg border ${
                  plan.popular 
                    ? 'border-blue-500 shadow-lg' 
                    : 'border-gray-200'
                } bg-white`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="inline-flex rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white">
                      Популярный
                    </span>
                  </div>
                )}
                
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                  <div className="mt-4 flex items-center justify-center">
                    <span className="px-3 flex items-start text-6xl tracking-tight text-gray-900">
                      <span className="mt-2 mr-2 text-2xl font-medium">₽</span>
                      <span className="font-extrabold">{plan.price}</span>
                    </span>
                    <span className="text-xl font-medium text-gray-500">/мес</span>
                  </div>
                  <p className="mt-4 text-sm text-gray-500">
                    {plan.description}
                  </p>
                </div>
                
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="ml-3 text-sm text-gray-700">{feature}</p>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8">
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    } font-medium py-2 px-4 rounded-md transition-colors`}
                  >
                    {plan.id === 'free' ? 'Начать бесплатно' : 'Выбрать тариф'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:px-6 bg-gray-50">
              <h2 className="text-lg font-medium text-gray-900">Сравнение тарифов</h2>
            </div>
            <div className="border-t border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Функция
                    </th>
                    {pricingPlans.map((plan) => (
                      <th key={plan.id} scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {plan.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Консультации по охране труда
                    </td>
                    {pricingPlans.map((plan) => (
                      <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        {plan.limits.consultationsPerDay === Infinity ? (
                          <span className="text-green-600">Без ограничений</span>
                        ) : (
                          <span>{plan.limits.consultationsPerDay} в день</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Генерация документов
                    </td>
                    {pricingPlans.map((plan) => (
                      <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        {plan.limits.documentsPerMonth === Infinity ? (
                          <span className="text-green-600">Без ограничений</span>
                        ) : (
                          <span>{plan.limits.documentsPerMonth} в месяц</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Хранение истории чатов
                    </td>
                    {pricingPlans.map((plan) => (
                      <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        {plan.limits.chatHistoryDays === Infinity ? (
                          <span className="text-green-600">Без ограничений</span>
                        ) : (
                          <span>{plan.limits.chatHistoryDays} дней</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Количество пользователей
                    </td>
                    {pricingPlans.map((plan) => (
                      <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        {plan.limits.maxUsers === Infinity ? (
                          <span className="text-green-600">Без ограничений</span>
                        ) : (
                          <span>До {plan.limits.maxUsers}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      API доступ
                    </td>
                    {pricingPlans.map((plan) => (
                      <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        {plan.limits.apiAccess ? (
                          <svg className="h-5 w-5 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Расширенная аналитика
                    </td>
                    {pricingPlans.map((plan) => (
                      <td key={plan.id} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                        {plan.limits.advancedAnalytics ? (
                          <svg className="h-5 w-5 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Модальное окно оплаты */}
      {showPaymentModal && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Оформление подписки
                    </h3>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-4">
                        Вы выбрали тариф: <span className="font-medium text-gray-900">
                          {pricingPlans.find(p => p.id === selectedPlan)?.name}
                        </span>
                      </p>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                            Номер карты
                          </label>
                          <input
                            type="text"
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                              Срок действия
                            </label>
                            <input
                              type="text"
                              id="expiryDate"
                              placeholder="MM/YY"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                              CVC
                            </label>
                            <input
                              type="text"
                              id="cvc"
                              placeholder="123"
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="cardholderName" className="block text-sm font-medium text-gray-700">
                            Имя владельца карты
                          </label>
                          <input
                            type="text"
                            id="cardholderName"
                            placeholder="IVAN IVANOV"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSubscribe}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Оформить подписку
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Отменить
                </button>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);
}