import { DocumentTemplateWithFields } from './document-templates';

// Интерфейс для заполненных данных документа
export interface DocumentData {
  templateId: string;
  fields: Record<string, string | boolean | Date>;
  createdAt: Date;
  createdBy: string;
  documentName: string;
}

// Сервис для генерации документов
export class DocumentGenerationService {
  // Генерация документа на основе шаблона и данных
  static generateDocument(template: DocumentTemplateWithFields, data: Record<string, string | boolean | Date>): string {
    let documentContent = '';
    
    // Добавляем заголовок документа
    if (template.category === 'instruction') {
      documentContent += this.generateInstructionHeader(template, data);
    } else if (template.category === 'act') {
      documentContent += this.generateActHeader(template, data);
    } else if (template.category === 'journal') {
      documentContent += this.generateJournalHeader(template, data);
    } else if (template.category === 'report') {
      documentContent += this.generateReportHeader(template, data);
    }
    
    // Добавляем содержимое документа в зависимости от категории
    if (template.category === 'instruction') {
      documentContent += this.generateInstructionContent(template, data);
    } else if (template.category === 'act') {
      documentContent += this.generateActContent(template, data);
    } else if (template.category === 'journal') {
      documentContent += this.generateJournalContent(template, data);
    } else if (template.category === 'report') {
      documentContent += this.generateReportContent(template, data);
    }
    
    // Добавляем подписи и дату
    documentContent += this.generateSignatureBlock(template, data);
    
    return documentContent;
  }
  
  // Генерация заголовка для инструкции
  private static generateInstructionHeader(template: DocumentTemplateWithFields, data: Record<string, string | boolean | Date>): string {
    const companyName = data.company_name || '';
    const directorPosition = data.director_position || '';
    const directorName = data.director_name || '';
    const approvalDate = data.approval_date ? new Date(data.approval_date).toLocaleDateString('ru-RU') : '';
    const instructionNumber = data.instruction_number || '';
    
    return `
                                                                "УТВЕРЖДАЮ"
                                                    ${directorPosition} ${companyName}
                                                    _____________ ${directorName}
                                                    "${approvalDate}"
    
    
                                    ИНСТРУКЦИЯ ПО ОХРАНЕ ТРУДА
                                    ${template.name}
                                    ${instructionNumber}
    
    `;
  }
  
  // Генерация заголовка для акта
  private static generateActHeader(template: DocumentTemplateWithFields, data: Record<string, string | boolean | Date>): string {
    const companyName = data.company_name || '';
    const companyAddress = data.company_address || '';
    const accidentDate = data.accident_date ? new Date(data.accident_date).toLocaleDateString('ru-RU') : '';
    
    return `
                                    ФОРМА Н-1
                        АКТ О НЕСЧАСТНОМ СЛУЧАЕ НА ПРОИЗВОДСТВЕ
    
    1. Дата и время несчастного случая: ${accidentDate}
    2. Организация: ${companyName}
    3. Адрес организации: ${companyAddress}
    
    `;
  }
  
  // Генерация заголовка для журнала
  private static generateJournalHeader(template: DocumentTemplateWithFields, data: Record<string, string | boolean | Date>): string {
    const companyName = data.company_name || '';
    const department = data.department || '';
    const startDate = data.start_date ? new Date(data.start_date).toLocaleDateString('ru-RU') : '';
    
    return `
                                    ЖУРНАЛ
                        РЕГИСТРАЦИИ ИНСТРУКТАЖА НА РАБОЧЕМ МЕСТЕ
    
    Организация: ${companyName}
    Подразделение: ${department}
    Начат: ${startDate}
    
    `;
  }
  
  // Генерация заголовка для отчета
  private static generateReportHeader(template: DocumentTemplateWithFields, data: Record<string, string | boolean | Date>): string {
    const companyName = data.company_name || '';
    const department = data.department || '';
    const assessmentDate = data.assessment_date ? new Date(data.assessment_date).toLocaleDateString('ru-RU') : '';
    
    return `
                                    КАРТА
                        ОЦЕНКИ ПРОФЕССИОНАЛЬНЫХ РИСКОВ
    
    Организация: ${companyName}
    Подразделение: ${department}
    Дата проведения оценки: ${assessmentDate}
    
    `;
  }
  
  // Генерация содержимого для инструкции
  private static generateInstructionContent(template: DocumentTemplateWithFields, data: Record<string, string | boolean | Date>): string {
    let content = '';
    
    // Добавляем разделы инструкции
    if (template.id === 'instruction_general') {
      content += `
1. ОБЩИЕ ТРЕБОВАНИЯ ОХРАНЫ ТРУДА

${data.general_requirements || ''}

2. ТРЕБОВАНИЯ ОХРАНЫ ТРУДА ПЕРЕД НАЧАЛОМ РАБОТЫ

${data.before_work_requirements || ''}

3. ТРЕБОВАНИЯ ОХРАНЫ ТРУДА ВО ВРЕМЯ РАБОТЫ

${data.during_work_requirements || ''}

4. ТРЕБОВАНИЯ ОХРАНЫ ТРУДА В АВАРИЙНЫХ СИТУАЦИЯХ

${data.emergency_requirements || ''}

5. ТРЕБОВАНИЯ ОХРАНЫ ТРУДА ПО ОКОНЧАНИИ РАБОТЫ

${data.after_work_requirements || ''}
`;
    } else if (template.id === 'instruction_office') {
      content += `
1. ОБЩИЕ ТРЕБОВАНИЯ ОХРАНЫ ТРУДА

${data.general_requirements || ''}

2. ТРЕБОВАНИЯ ОХРАНЫ ТРУДА ПЕРЕД НАЧАЛОМ РАБОТЫ

${data.before_work_requirements || ''}

3. ТРЕБОВАНИЯ ОХРАНЫ ТРУДА ВО ВРЕМЯ РАБОТЫ ЗА КОМПЬЮТЕРОМ

${data.computer_work_requirements || ''}

4. ТРЕБОВАНИЯ К ОРГАНИЗАЦИИ РАБОЧЕГО МЕСТА

${data.workplace_requirements || ''}

5. ТРЕБОВАНИЯ ОХРАНЫ ТРУДА В АВАРИЙНЫХ СИТУАЦИЯХ

${data.emergency_requirements || ''}

6. ТРЕБОВАНИЯ ОХРАНЫ ТРУДА ПО ОКОНЧАНИИ РАБОТЫ

${data.after_work_requirements || ''}
`;
    }
    
    return content;
  }
  
  // Генерация содержимого для акта
  private static generateActContent(template: DocumentTemplateWithFields, data: Record<string, string | boolean | Date>): string {
    if (template.id === 'accident_report') {
      return `
СВЕДЕНИЯ О ПОСТРАДАВШЕМ:

ФИО: ${data.victim_fullname || ''}
Пол: ${data.victim_gender || ''}
Дата рождения: ${data.victim_birthdate ? new Date(data.victim_birthdate).toLocaleDateString('ru-RU') : ''}
Профессия (должность): ${data.victim_position || ''}
Стаж работы: ${data.victim_experience || ''}

ОБСТОЯТЕЛЬСТВА НЕСЧАСТНОГО СЛУЧАЯ:

Место несчастного случая: ${data.accident_location || ''}
Описание обстоятельств: ${data.accident_description || ''}
Характер полученных повреждений: ${data.injury_type || ''}

ПРИЧИНЫ НЕСЧАСТНОГО СЛУЧАЯ:

${data.accident_cause || ''}

ЛИЦА, ДОПУСТИВШИЕ НАРУШЕНИЕ ТРЕБОВАНИЙ ОХРАНЫ ТРУДА:

${data.responsible_persons || ''}

МЕРОПРИЯТИЯ ПО УСТРАНЕНИЮ ПРИЧИН НЕСЧАСТНОГО СЛУЧАЯ:

${data.prevention_measures || ''}
`;
    }
    
    return '';
  }
  
  // Генерация содержимого для журнала
  private static generateJournalContent(template: DocumentTemplateWithFields, data: Record<string, string | boolean | Date>): string {
    if (template.id === 'training_journal') {
      return `
ОТВЕТСТВЕННОЕ ЛИЦО ЗА ПРОВЕДЕНИЕ ИНСТРУКТАЖА:

${data.responsible_person || ''}

ЗАПИСИ ЖУРНАЛА:

Дата | ФИО инструктируемого | Профессия | Вид инструктажа | Причина проведения | ФИО инструктирующего | Подпись инструктирующего | Подпись инструктируемого
-----|----------------------|-----------|----------------|-------------------|---------------------|--------------------------|----------------------
${data.journal_entries || ''}
`;
    }
    
    return '';
  }
  
  // Генерация содержимого для отчета
  private static generateReportContent(template: DocumentTemplateWithFields, data: Record<string, string | boolean | Date>): string {
    if (template.id === 'risk_assessment_card') {
      return `
ОБЩИЕ СВЕДЕНИЯ О РАБОЧЕМ МЕСТЕ:

Наименование рабочего места: ${data.workplace_name || ''}

ИДЕНТИФИКАЦИЯ ОПАСНОСТЕЙ:

${data.identified_hazards || ''}

ОЦЕНКА УРОВНЯ РИСКА:

${data.risk_levels || ''}

МЕРЫ УПРАВЛЕНИЯ РИСКАМИ:

${data.control_measures || ''}

ПЛАН МЕРОПРИЯТИЙ ПО СНИЖЕНИЮ УРОВНЯ РИСКОВ:

Мероприятия: ${data.control_measures || ''}
Ответственные лица: ${data.responsible_persons || ''}
Сроки выполнения: ${data.implementation_dates || ''}
`;
    }
    
    return '';
  }
  
  // Генерация блока подписей
  private static generateSignatureBlock(template: DocumentTemplateWithFields, data: Record<string, string | boolean | Date>): string {
    const currentDate = new Date().toLocaleDateString('ru-RU');
    
    if (template.category === 'instruction') {
      return `

Инструкцию разработал: _________________ / _________________ /
                          (подпись)             (ФИО)

С инструкцией ознакомлен: _________________ / _________________ /
                              (подпись)             (ФИО)

Дата: ${currentDate}
`;
    } else if (template.category === 'act') {
      return `

Председатель комиссии: _________________ / _________________ /
                          (подпись)             (ФИО)

Члены комиссии:       _________________ / _________________ /
                          (подпись)             (ФИО)
                      _________________ / _________________ /
                          (подпись)             (ФИО)

Дата: ${currentDate}
`;
    } else if (template.category === 'report') {
      return `

Оценку провел:        _________________ / _________________ /
                          (подпись)             (ФИО)

Утвердил:             _________________ / _________________ /
                          (подпись)             (ФИО)

Дата: ${currentDate}
`;
    }
    
    return '';
  }
  
  // Сохранение документа
  static saveDocument(documentData: DocumentData): string {
    // В реальном приложении здесь был бы код для сохранения в базу данных
    // Для демонстрации просто возвращаем идентификатор документа
    return `doc_${Date.now()}`;
  }
  
  // Получение списка документов пользователя
  static getUserDocuments(userId: string): DocumentData[] {
    // В реальном приложении здесь был бы код для получения из базы данных
    // Для демонстрации возвращаем пустой массив
    return [];
  }
}
