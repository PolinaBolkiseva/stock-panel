// src/components/views/ProductCard.ts
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

// Данные, которые карточка умеет показывать.
interface IProductCard {
  title: string;
  price: number;
  stock: number;
}

// VIEW — карточка товара в списке. Получает готовую разметку (клон шаблона),
// один раз находит свои элементы и обновляет их через сеттеры.
export class ProductCard extends Component<IProductCard> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected stockElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
    this.stockElement = ensureElement<HTMLElement>('.card__stock', this.container);
  }

  // Сеттеры protected: снаружи компонент обновляется только через render().
  protected set title(value: string) {
    this.titleElement.textContent = value;
  }

  protected set price(value: number) {
    this.priceElement.textContent = `${value} ₽`;
  }

  protected set stock(value: number) {
    this.stockElement.textContent = `Остаток: ${value} шт`;
    this.stockElement.classList.toggle('card__stock_empty', value === 0);
  }
}