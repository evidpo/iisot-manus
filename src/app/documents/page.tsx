"use client";

import React from 'react';
import { useAuth } from '../../lib/auth';
import { Navbar } from '../../components/layout/Navbar';
import { documentTemplates } from '../../lib/document-templates';
import { DocumentGenerationService } from '../../lib/document-service';
import Link from 'next/link';

export default function Documents() {
  const { user, loading } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = React.useState(null);
  const [formData, setFormData] = React.useState({});
  const [generatedDocument, setGeneratedDocument] = React.useState('');
  const [documentName, setDocumentName] = React.useState('');
  const [savedDocuments, setSavedDocuments] = React.useState([]);
  
  // Загрузка сохраненных документов при монтировании компонента
  React.useEffect(() => {
    if (user) {
      // В реальном приложении здесь был бы запрос к API
      const savedDocs = localStorage.getItem(`user_documents_${user.id}`);
      if (savedDocs) {
        try {
          setSavedDocuments(JSON.parse(savedDocs));
        } catch (error) {
          console.error('Ошибка при загрузке документов:', error);
        }
      }
    }
  }, [user]);
  
  // Обработка выбора шаблона
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setFormData({});
    setGeneratedDocument('');
  };
  
  // Обработка изменения полей формы
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Генерация документа
  const handleGenerateDocument = () => {
    if (!selectedTemplate) return;
    
    const document = DocumentGenerationService.generateDocument(selectedTemplate, formData);
    setGeneratedDocument(document);
  };
  
  // Сохранение документа
  const handleSaveDocument = () => {
    if (!generatedDocument || !documentName) return;
    
    const documentData = {
      templateId: selectedTemplate.id,
      fields: formData,
      createdAt: new Date(),
      createdBy: user.id,
      documentName: documentName
    };
    
    // В реальном приложении здесь был бы запрос к API
    const newDocuments = [...savedDocuments, documentData];
    localStorage.setItem(`user_documents_${user.id}`, JSON.stringify(newDocuments));
    setSavedDocuments(newDocuments);
    
    // Сброс формы
    setSelectedTemplate(null);
    setFormData({});
    setGeneratedDocument('');
    setDocumentName('');
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
        <p className="mb-4">Для доступа к документам необходимо войти в систему</p>
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
      
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Генерация документов по охране труда</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Левая колонка - выбор шаблона */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Шаблоны документов</h2>
            
            <div className="space-y-2">
              {documentTemplates.map((template) => (
                <div 
                  key={template.id}
                  className={`p-3 rounded-md cursor-pointer transition-colors ${
                    selectedTemplate?.id === template.id 
                      ? 'bg-blue-100 border border-blue-300' 
                      : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <h3 className="font-medium">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                  <div className="text-xs text-gray-500 mt-1">
                    Категория: {
                      template.category === 'instruction' ? 'Инструкция' :
                      template.category === 'act' ? 'Акт' :
                      template.category === 'journal' ? 'Журнал' :
                      template.category === 'report' ? 'Отчет' :
                      template.category === 'order' ? 'Приказ' : 'Документ'
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Средняя колонка - форма заполнения */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">
              {selectedTemplate 
                ? `Заполнение данных: ${selectedTemplate.name}` 
                : 'Выберите шаблон документа'
              }
            </h2>
            
            {selectedTemplate ? (
              <form className="space-y-4">
                {selectedTemplate.fields.map((field) => (
                  <div key={field.id} className="space-y-1">
                    <label 
                      htmlFor={field.id} 
                      className="block text-sm font-medium text-gray-700"
                    >
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </label>
                    
                    {field.type === 'text' && (
                      <input
                        type="text"
                        id={field.id}
                        name={field.id}
                        value={formData[field.id] || ''}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={field.required}
                      />
                    )}
                    
                    {field.type === 'date' && (
                      <input
                        type="date"
                        id={field.id}
                        name={field.id}
                        value={formData[field.id] || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={field.required}
                      />
                    )}
                    
                    {field.type === 'select' && (
                      <select
                        id={field.id}
                        name={field.id}
                        value={formData[field.id] || ''}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={field.required}
                      >
                        <option value="">Выберите...</option>
                        {field.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    )}
                    
                    {field.type === 'checkbox' && (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={field.id}
                          name={field.id}
                          checked={formData[field.id] || false}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label 
                          htmlFor={field.id} 
                          className="ml-2 block text-sm text-gray-700"
                        >
                          {field.label}
                        </label>
                      </div>
                    )}
                    
                    {field.type === 'textarea' && (
                      <textarea
                        id={field.id}
                        name={field.id}
                        value={formData[field.id] || field.defaultValue || ''}
                        onChange={handleInputChange}
                        placeholder={field.placeholder}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={field.required}
                      />
                    )}
                  </div>
                ))}
                
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleGenerateDocument}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
                  >
                    Сгенерировать документ
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-10 text-gray-500">
                Выберите шаблон документа из списка слева
              </div>
            )}
          </div>
          
          {/* Правая колонка - предпросмотр и сохранение */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Предпросмотр документа</h2>
            
            {generatedDocument ? (
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-md p-4 bg-gray-50 h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-mono text-sm">
                    {generatedDocument}
                  </pre>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label 
                      htmlFor="documentName" 
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Название документа
                    </label>
                    <input
                      type="text"
                      id="documentName"
                      value={documentName}
                      onChange={(e) => setDocumentName(e.target.value)}
                      placeholder="Введите название для сохранения"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={handleSaveDocument}
                      disabled={!documentName}
                      className={`flex-1 font-medium py-2 px-4 rounded-md ${
                        documentName 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Сохранить документ
                    </button>
                    
                    <button
                      type="button"
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md"
                    >
                      Скачать PDF
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                Заполните форму и нажмите "Сгенерировать документ"
              </div>
            )}
            
            {/* Список сохраненных документов */}
            {savedDocuments.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium text-gray-700 mb-2">Сохраненные документы</h3>
                <div className="space-y-2">
                  {savedDocuments.map((doc, index) => (
                    <div 
                      key={index}
                      className="p-2 bg-gray-50 border border-gray-200 rounded-md flex justify-between items-center"
                    >
                      <div>
                        <div className="font-medium">{doc.documentName}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Открыть
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
