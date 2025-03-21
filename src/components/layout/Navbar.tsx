import React from 'react';
import Link from 'next/link';

interface NavbarProps {
  userRole?: 'admin' | 'specialist' | 'manager' | 'hr' | 'employee' | null;
  userName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  userRole,
  userName,
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  const isLoggedIn = !!userRole;
  
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap text-blue-700">
              ОТ-Ассистент
            </span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                Панель управления
              </Link>
              <Link href="/chat" className="text-gray-700 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                Чат
              </Link>
              <Link href="/documents" className="text-gray-700 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                Документы
              </Link>
              
              {/* User dropdown */}
              <div className="relative ml-3">
                <button
                  type="button"
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <span className="sr-only">Открыть меню пользователя</span>
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    {userName ? userName.charAt(0).toUpperCase() : 'U'}
                  </div>
                </button>
                
                {isMenuOpen && (
                  <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="px-4 py-2 text-sm text-gray-900 border-b border-gray-200">
                      <div className="font-medium">{userName || 'Пользователь'}</div>
                      <div className="text-gray-500">{userRole === 'specialist' ? 'Специалист по ОТ' : 
                                                     userRole === 'manager' ? 'Руководитель' :
                                                     userRole === 'hr' ? 'HR-специалист' :
                                                     userRole === 'employee' ? 'Сотрудник' :
                                                     userRole === 'admin' ? 'Администратор' : 'Пользователь'}</div>
                    </div>
                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Профиль
                    </Link>
                    <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Настройки
                    </Link>
                    <Link href="/auth/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Выйти
                    </Link>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-gray-700 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                Войти
              </Link>
              <Link href="/auth/register" className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Регистрация
              </Link>
            </>
          )}
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Открыть меню</span>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pt-2 pb-3">
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium">
                  Панель управления
                </Link>
                <Link href="/chat" className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium">
                  Чат
                </Link>
                <Link href="/documents" className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium">
                  Документы
                </Link>
                <Link href="/profile" className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium">
                  Профиль
                </Link>
                <Link href="/settings" className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium">
                  Настройки
                </Link>
                <Link href="/auth/logout" className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium">
                  Выйти
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium">
                  Войти
                </Link>
                <Link href="/auth/register" className="block text-gray-700 hover:bg-gray-100 px-3 py-2 rounded-md text-base font-medium">
                  Регистрация
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
