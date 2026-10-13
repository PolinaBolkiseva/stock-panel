// src/utils/utils.ts

// Найти ОДИН элемент по селектору (или вернуть уже готовый элемент).
// Если элемента нет — останавливаем программу с понятной ошибкой:
// разметка обязана соответствовать ожиданиям View.
export function ensureElement<T extends HTMLElement>(
  selectorElement: T | string,
  context: HTMLElement = document.body
): T {
  if (typeof selectorElement === 'string') {
    const element = context.querySelector(selectorElement);
    if (!element) {
      throw new Error(`Селектор ${selectorElement} ничего не нашёл`);
    }
    return element as T;
  }
  return selectorElement;
}

// Клонировать содержимое <template> и вернуть корневой элемент копии.
export function cloneTemplate<T extends HTMLElement>(
  query: string | HTMLTemplateElement
): T {
  const template = ensureElement<HTMLTemplateElement>(query);
  if (!template.content.firstElementChild) {
    throw new Error(`Шаблон ${query} пуст`);
  }
  return template.content.firstElementChild.cloneNode(true) as T;
}

// Найти ВСЕ элементы по селектору. Пустой результат — не ошибка:
// сколько элементов нашлось, столько и вернём.
export function ensureAllElements<T extends HTMLElement>(
  selectorElement: string,
  context: HTMLElement = document.body
): T[] {
  return Array.from(context.querySelectorAll(selectorElement)) as T[];
}