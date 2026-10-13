/**
 * Базовый компонент для всех View. Используется без изменений.
 * render() кладёт переданные данные в поля экземпляра (Object.assign),
 * что автоматически вызывает сеттеры компонента и обновляет DOM,
 * после чего возвращает корневой контейнер.
 */
export abstract class Component<T> {
  protected constructor(protected readonly container: HTMLElement) {
    // Код в конструкторе исполняется ДО объявлений полей в дочернем классе.
  }

  // Вернуть корневой DOM-элемент
  render(data?: Partial<T>): HTMLElement {
    Object.assign(this as object, data ?? {});
    return this.container;
  }
}