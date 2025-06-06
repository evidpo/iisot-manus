/**
 * Статья законодательства с номером и содержанием.
 */
export interface LegislationArticle {
  number: string;
  title: string;
  content: string;
}

/**
 * Элемент нормативно-правового акта.
 */
export interface LegislationItem {
  id: string;
  title: string;
  content: string;
  source: string;
  keywords: string[];
  articles: LegislationArticle[];
}

/**
 * Раздел стандарта или нормативного документа.
 */
export interface StandardSection {
  number: string;
  title: string;
  content: string;
}

/**
 * Элемент стандарта или нормативного документа.
 */
export interface StandardItem {
  id: string;
  title: string;
  content: string;
  source: string;
  keywords: string[];
  sections: StandardSection[];
}

/**
 * Шаблон документа с именем, описанием и разделами.
 */
export interface DocumentTemplate {
  name: string;
  description: string;
  sections: string[];
}

/**
 * Элемент документа с ключевыми словами и шаблонами.
 */
export interface DocumentItem {
  id: string;
  title: string;
  content: string;
  keywords: string[];
  templates: DocumentTemplate[];
}

/**
 * Детали обучения: наименование, описание и дополнительная документация.
 */
export interface TrainingDetail {
  name: string;
  description: string;
  responsible?: string;
  documentation?: string;
}

/**
 * Элемент учебного урока или программы обучения.
 */
export interface TrainingItem {
  id: string;
  title: string;
  content: string;
  keywords: string[];
  details: TrainingDetail[];
}

/**
 * Шаг методологии оценки профессиональных рисков.
 */
export interface RiskMethodologyStep {
  name: string;
  description: string;
  steps: string[];
}

/**
 * Элемент оценки профессиональных рисков с методологией.
 */
export interface RiskAssessmentItem {
  id: string;
  title: string;
  content: string;
  keywords: string[];
  methodology: RiskMethodologyStep[];
}

/**
 * Структура базы знаний по охране труда.
 */
export interface LaborSafetyKnowledge {
  legislation: LegislationItem[];
  safety_standards: StandardItem[];
  documents: DocumentItem[];
  training: TrainingItem[];
  risk_assessment: RiskAssessmentItem[];
}

/**
 * Вложение в сообщении чата (имя, URL и тип).
 */
export interface Attachment {
  name: string;
  url: string;
  type: 'pdf' | 'doc' | 'image' | 'link';
}

/**
 * Сообщение чата с идентификатором, содержанием и метаданными.
 */
export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  hasAttachments?: boolean;
  attachments?: Attachment[];
}

/**
 * Категории вопросов, используемые для классификации запросов.
 */
export type QuestionCategory = 
  | 'legislation' 
  | 'safety_standards' 
  | 'documents' 
  | 'training' 
  | 'risk_assessment'
  | 'general';
