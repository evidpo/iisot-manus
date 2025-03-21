import { laborSafetyKnowledgeBase } from './knowledge-base';
import { categorizeQuestion, generateResponse } from './chat-service';
import { Message, Attachment } from './types';

// Обработка сообщения пользователя и генерация ответа
export const processUserMessage = async (message: string): Promise<{
  content: string;
  attachments?: Attachment[];
}> => {
  try {
    // Категоризация вопроса и генерация ответа
    const response = generateResponse(message);
    return response;
  } catch (error) {
    console.error('Error processing message:', error);
    return {
      content: 'Извините, произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте переформулировать вопрос или обратитесь к администратору системы.'
    };
  }
};

// Сохранение истории чата
export const saveChatHistory = (userId: string, messages: Message[]): void => {
  try {
    localStorage.setItem(`chat_history_${userId}`, JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving chat history:', error);
  }
};

// Загрузка истории чата
export const loadChatHistory = (userId: string): Message[] => {
  try {
    const savedMessages = localStorage.getItem(`chat_history_${userId}`);
    if (savedMessages) {
      // Преобразуем строки дат обратно в объекты Date
      return JSON.parse(savedMessages, (key, value) => {
        if (key === 'timestamp') return new Date(value);
        return value;
      });
    }
    return [];
  } catch (error) {
    console.error('Error loading chat history:', error);
    return [];
  }
};

// Поиск в базе знаний по ключевым словам
export const searchKnowledgeBase = (query: string): any[] => {
  const lowerQuery = query.toLowerCase();
  const results = [];
  
  // Поиск в законодательстве
  const legislationResults = laborSafetyKnowledgeBase.legislation.filter(item => 
    item.keywords.some(keyword => lowerQuery.includes(keyword)) ||
    lowerQuery.includes(item.title.toLowerCase())
  );
  results.push(...legislationResults);
  
  // Поиск в стандартах
  const standardResults = laborSafetyKnowledgeBase.safety_standards.filter(item => 
    item.keywords.some(keyword => lowerQuery.includes(keyword)) ||
    lowerQuery.includes(item.title.toLowerCase())
  );
  results.push(...standardResults);
  
  // Поиск в документах
  const documentResults = laborSafetyKnowledgeBase.documents.filter(item => 
    item.keywords.some(keyword => lowerQuery.includes(keyword)) ||
    lowerQuery.includes(item.title.toLowerCase())
  );
  results.push(...documentResults);
  
  // Поиск в обучении
  const trainingResults = laborSafetyKnowledgeBase.training.filter(item => 
    item.keywords.some(keyword => lowerQuery.includes(keyword)) ||
    lowerQuery.includes(item.title.toLowerCase())
  );
  results.push(...trainingResults);
  
  // Поиск в оценке рисков
  const riskResults = laborSafetyKnowledgeBase.risk_assessment.filter(item => 
    item.keywords.some(keyword => lowerQuery.includes(keyword)) ||
    lowerQuery.includes(item.title.toLowerCase())
  );
  results.push(...riskResults);
  
  return results;
};

// Получение списка всех документов из базы знаний
export const getAllDocumentTemplates = () => {
  return laborSafetyKnowledgeBase.documents.flatMap(doc => doc.templates);
};

// Получение списка всех законодательных актов
export const getAllLegislation = () => {
  return laborSafetyKnowledgeBase.legislation;
};

// Получение списка всех стандартов безопасности
export const getAllSafetyStandards = () => {
  return laborSafetyKnowledgeBase.safety_standards;
};
