export const pricingPlans = [
  {
    id: 'free',
    name: 'Базовый',
    price: 0,
    description: 'Для ознакомления с возможностями системы',
    popular: false,
    features: [
      'Консультации по базовым вопросам охраны труда',
      'Доступ к основным нормативным документам',
      'Базовые шаблоны документов',
      'Один пользователь'
    ],
    limits: {
      consultationsPerDay: 5,
      documentsPerMonth: 10,
      chatHistoryDays: 7,
      maxUsers: 1,
      apiAccess: false,
      advancedAnalytics: false
    }
  },
  {
    id: 'standard',
    name: 'Стандартный',
    price: 1990,
    description: 'Для малого и среднего бизнеса',
    popular: true,
    features: [
      'Неограниченные консультации по охране труда',
      'Полный доступ к базе знаний',
      'Расширенные шаблоны документов',
      'До 5 пользователей',
      'Приоритетная поддержка'
    ],
    limits: {
      consultationsPerDay: 20,
      documentsPerMonth: 50,
      chatHistoryDays: 30,
      maxUsers: 5,
      apiAccess: false,
      advancedAnalytics: false
    }
  },
  {
    id: 'premium',
    name: 'Премиум',
    price: 4990,
    description: 'Для крупных предприятий',
    popular: false,
    features: [
      'Неограниченные консультации по охране труда',
      'Полный доступ к базе знаний',
      'Все шаблоны документов',
      'До 20 пользователей',
      'Приоритетная поддержка 24/7',
      'Расширенная аналитика',
      'API доступ'
    ],
    limits: {
      consultationsPerDay: 100,
      documentsPerMonth: 200,
      chatHistoryDays: 90,
      maxUsers: 20,
      apiAccess: true,
      advancedAnalytics: true
    }
  },
  {
    id: 'corporate',
    name: 'Корпоративный',
    price: 9990,
    description: 'Индивидуальные решения для крупных организаций',
    popular: false,
    features: [
      'Неограниченные консультации по охране труда',
      'Полный доступ к базе знаний',
      'Все шаблоны документов',
      'Неограниченное количество пользователей',
      'Выделенная линия поддержки 24/7',
      'Расширенная аналитика и отчетность',
      'Полный API доступ',
      'Интеграция с корпоративными системами'
    ],
    limits: {
      consultationsPerDay: Infinity,
      documentsPerMonth: Infinity,
      chatHistoryDays: Infinity,
      maxUsers: Infinity,
      apiAccess: true,
      advancedAnalytics: true
    }
  }
];

// Функция для получения лимитов плана по ID
export function getPlanLimits(planId: string) {
  const plan = pricingPlans.find(p => p.id === planId);
  return plan ? plan.limits : pricingPlans[0].limits;
}
