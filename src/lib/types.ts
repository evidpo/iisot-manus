import { LaborSafetyKnowledge } from '../lib/types';

// Типы для базы знаний по охране труда
export interface LegislationArticle {
  number: string;
  title: string;
  content: string;
}

export interface LegislationItem {
  id: string;
  title: string;
  content: string;
  source: string;
  keywords: string[];
  articles: LegislationArticle[];
}

export interface StandardSection {
  number: string;
  title: string;
  content: string;
}

export interface StandardItem {
  id: string;
  title: string;
  content: string;
  source: string;
  keywords: string[];
  sections: StandardSection[];
}

export interface DocumentTemplate {
  name: string;
  description: string;
  sections: string[];
}

export interface DocumentItem {
  id: string;
  title: string;
  content: string;
  keywords: string[];
  templates: DocumentTemplate[];
}

export interface TrainingDetail {
  name: string;
  description: string;
  responsible?: string;
  documentation?: string;
}

export interface TrainingItem {
  id: string;
  title: string;
  content: string;
  keywords: string[];
  details: TrainingDetail[];
}

export interface RiskMethodologyStep {
  name: string;
  description: string;
  steps: string[];
}

export interface RiskAssessmentItem {
  id: string;
  title: string;
  content: string;
  keywords: string[];
  methodology: RiskMethodologyStep[];
}

export interface LaborSafetyKnowledge {
  legislation: LegislationItem[];
  safety_standards: StandardItem[];
  documents: DocumentItem[];
  training: TrainingItem[];
  risk_assessment: RiskAssessmentItem[];
}

// Типы для сообщений чата
export interface Attachment {
  name: string;
  url: string;
  type: 'pdf' | 'doc' | 'image' | 'link';
}

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  hasAttachments?: boolean;
  attachments?: Attachment[];
}

// Типы категорий вопросов
export type QuestionCategory = 
  | 'legislation' 
  | 'safety_standards' 
  | 'documents' 
  | 'training' 
  | 'risk_assessment'
  | 'general';
