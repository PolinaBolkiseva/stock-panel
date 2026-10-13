// src/components/views/ProductCard.ts
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

// Данные, которые карточка умеет показывать.
interface IProductCard {
  title: string;
  price: number;
  stock: number;
}

// Обработчики действий пользователя на карточке. Карточка — динамический
// компонент: события не эмитит, а получает готовые коллбеки через конструктор.
interface IProductCardActions {
  onReceipt: () => void; // клик по кнопке «Поступление товара»
} 

// VIEW — карточка товара в списке. Получает готовую разметку (клон шаблона),
// один раз находит свои элементы и обновляет их через сеттеры.
export class ProductCard extends Component<IProductCard> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected stockElement: HTMLElement;
  protected receiptButton: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IProductCardActions) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
    this.stockElement = ensureElement<HTMLElement>('.card__stock', this.container);
    this.receiptButton = ensureElement<HTMLButtonElement>('.card__receipt', this.container);
    // Клик по кнопке → вызвать переданный обработчик. Что случится дальше,
    // карточка не знает: это решает тот, кто её создал.
    if (actions?.onReceipt) {
      this.receiptButton.addEventListener('click', actions.onReceipt);
    }
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