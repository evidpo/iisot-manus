import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              ИИ-ассистент по охране труда
            </h1>
            <p className="text-xl mb-8">
              Интеллектуальный помощник для специалистов, руководителей, HR и сотрудников предприятий
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/auth/register" 
                className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium text-lg transition-colors"
              >
                Начать бесплатно
              </Link>
              <Link 
                href="/auth/login" 
                className="bg-blue-600 hover:bg-blue-800 px-6 py-3 rounded-lg font-medium text-lg border border-blue-500 transition-colors"
              >
                Войти в систему
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Функциональность ассистента</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Консультант по охране труда</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Отвечает на вопросы по законодательству, ГОСТам, нормам безопасности</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Поддерживает актуальные изменения в законодательной базе</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Помощник по документообороту</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Автоматически формирует отчеты, акты, приказы, напоминания</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Интеграция с корпоративными системами документооборота</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Тарифные планы</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold mb-2">Базовый</h3>
              <p className="text-gray-500 mb-4">Для начинающих пользователей</p>
              <p className="text-3xl font-bold mb-6">Бесплатно</p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Базовые консультации</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Простая аналитика</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Ограниченное количество запросов</span>
                </li>
              </ul>
              
              <Link 
                href="/auth/register" 
                className="block text-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors w-full"
              >
                Начать бесплатно
              </Link>
            </div>
            
            {/* Pro Plan */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 relative">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                ПОПУЛЯРНЫЙ
              </div>
              <h3 className="text-xl font-bold mb-2">Профессиональный</h3>
              <p className="text-gray-500 mb-4">Для специалистов по ОТ</p>
              <p className="text-3xl font-bold mb-6">2 500 ₽<span className="text-base font-normal text-gray-500">/мес</span></p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Все функции базового тарифа</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Расширенная аналитика</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Генерация документов</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Неограниченное количество запросов</span>
                </li>
              </ul>
              
              <Link 
                href="/auth/register?plan=pro" 
                className="block text-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors w-full"
              >
                Выбрать тариф
              </Link>
            </div>
            
            {/* Enterprise Plan */}
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold mb-2">Корпоративный</h3>
              <p className="text-gray-500 mb-4">Для предприятий</p>
              <p className="text-3xl font-bold mb-6">По запросу</p>
              
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Все функции профессионального тарифа</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>API-интеграции</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Индивидуальная настройка</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Приоритетная поддержка</span>
                </li>
              </ul>
              
              <Link 
                href="/contact" 
                className="block text-center bg-gray-800 hover:bg-gray-900 text-white px-6 py-2 rounded-lg font-medium transition-colors w-full"
              >
                Связаться с нами
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-lg font-semibold">Ассистент по охране труда</p>
              <p className="text-gray-400">© 2025 Все права защищены</p>
            </div>
            <div className="flex gap-6">
              <Link href="/about" className="hover:text-blue-400 transition-colors">О нас</Link>
              <Link href="/contact" className="hover:text-blue-400 transition-colors">Контакты</Link>
              <Link href="/privacy" className="hover:text-blue-400 transition-colors">Политика конфиденциальности</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
