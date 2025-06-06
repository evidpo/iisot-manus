"use client";

import { knowledgeBase, KnowledgeBaseItem } from './knowledge-base';
import type { UserRole } from './auth';

// Сервис для работы с чатом
/**
 * Ответ ассистента, содержащий текст и список источников.
 */
export interface AssistantResponse {
  text: string;
  references: { title: string; url: string; description?: string }[];
}
export class ChatService {
  /**
   * Получение ответа от ассистента на основе запроса и роли пользователя.
   * @param query Текст запроса пользователя
   * @param userRole Роль пользователя для адаптации ответа
   * @returns Объект с текстом ответа и ссылками на источники
   */
  static async getAssistantResponse(query: string, userRole: UserRole): Promise<AssistantResponse> {
    // В реальном приложении здесь был бы запрос к API ИИ-модели
    // Для демонстрации используем имитацию ответа на основе базы знаний
    
    try {
      // Поиск релевантной информации в базе знаний
      const relevantInfo = this.findRelevantInformation(query);
      
      // Формирование ответа на основе найденной информации
      const response = this.generateResponse(query, relevantInfo, userRole);
      
      // Имитация задержки ответа
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return response;
    } catch (error) {
      console.error('Ошибка при получении ответа:', error);
      throw error;
    }
  }
  
  /**
   * Поиск релевантной информации по ключевым словам в базе знаний.
   */
  private static findRelevantInformation(query: string): KnowledgeBaseItem[] {
    const normalizedQuery = query.toLowerCase();
    
    // Поиск по ключевым словам
    const relevantItems = knowledgeBase.filter(item => {
      const keywords = [...item.keywords, item.title.toLowerCase()];
      return keywords.some(keyword => normalizedQuery.includes(keyword));
    });
    
    // Если ничего не найдено, возвращаем общую информацию
    if (relevantItems.length === 0) {
      return knowledgeBase.filter(item => item.category === 'general');
    }
    
    return relevantItems;
  }
  
  /**
   * Генерация ответа на основе найденной информации и роли пользователя.
   */
  private static generateResponse(query: string, relevantInfo: KnowledgeBaseItem[], userRole: UserRole): AssistantResponse {
    // Адаптация ответа в зависимости от роли пользователя
    const roleSpecificInfo = this.adaptResponseToRole(relevantInfo, userRole);
    
    // Формирование текста ответа
    let responseText = '';
    
    if (roleSpecificInfo.length > 0) {
      // Основной ответ на основе первого наиболее релевантного элемента
      responseText = roleSpecificInfo[0].content;
      
      // Добавление дополнительной информации из других релевантных элементов
      if (roleSpecificInfo.length > 1) {
        responseText += '\n\nДополнительная информация:\n\n';
        responseText += roleSpecificInfo.slice(1, 3).map(item => 
          `${item.title}: ${item.summary}`
        ).join('\n\n');
      }
    } else {
      // Если ничего не найдено
      responseText = 'К сожалению, я не нашел точной информации по вашему запросу. Пожалуйста, уточните ваш вопрос или обратитесь к специалисту по охране труда.';
    }
    
    // Формирование списка источников
    const references = roleSpecificInfo.map(item => ({
      title: item.title,
      url: item.source,
      description: item.summary
    }));
    
    return {
      text: responseText,
      references: references
    };
  }
  
  // Адаптация ответа в зависимости от роли пользователя
  private static adaptResponseToRole(relevantInfo: any[], userRole: string) {
    switch (userRole) {
      case 'specialist':
        // Для специалистов по ОТ - полная детальная информация
        return relevantInfo;
        
      case 'manager':
        // Для руководителей - акцент на ответственности и организационных аспектах
        return relevantInfo.filter(item => 
          item.relevantFor.includes('manager') || 
          item.category === 'responsibility' ||
          item.category === 'organization'
        );
        
      case 'hr':
        // Для HR - акцент на обучении и документообороте
        return relevantInfo.filter(item => 
          item.relevantFor.includes('hr') || 
          item.category === 'training' ||
          item.category === 'documents'
        );
        
      case 'employee':
        // Для сотрудников - упрощенная информация о правилах безопасности
        return relevantInfo.filter(item => 
          item.relevantFor.includes('employee') || 
          item.category === 'safety_rules'
        );
        
      default:
        // По умолчанию - общая информация
        return relevantInfo;
    }
  }
}
