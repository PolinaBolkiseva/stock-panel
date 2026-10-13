// src/components/views/ProductPreview.ts
import { ensureElement } from '../../utils/utils';
import { Card } from './Card';

// Добавка подробной карточки к общим данным ICard.
interface IPreviewExtra {
  description: string;
}

// VIEW — подробная карточка товара. Заголовок, цену и остаток наследует
// у Card, от себя добавляет описание. Только показывает данные —
// действий пользователя у неё нет.
export class ProductPreview extends Card<IPreviewExtra> {
  protected descriptionElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>('.card__description', this.container);
  }

  // Сеттер protected: снаружи компонент обновляется только через render().
  protected set description(value: string) {
    this.descriptionElement.textContent = value;
  }
}