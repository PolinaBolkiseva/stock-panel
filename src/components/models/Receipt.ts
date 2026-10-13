// src/components/models/Receipt.ts
import type { IProduct, TReceiptReason, TReceiptErrors } from '../../types';
import type { IEvents } from '../base/Events';

// Состояние черновика — всё, что нужно для отрисовки формы.
type TReceiptState = {
  product: IProduct | null;
  reason: TReceiptReason | null;
  quantityRaw: string;
};

// Данные для проведения — их заберёт у документа презентер.
type TReceiptData = {
  productId: string;
  reason: TReceiptReason | null;
  quantity: number;
};

// МОДЕЛЬ — документ «Поступление товара», разовый черновик.
// Хранит товар, причину и количество, проверяет заполнение
// и сообщает об изменениях событием 'receipt:changed'.
// Количество храним строкой: в черновике лежит ровно то, что набрал
// пользователь, а число из него получаем при валидации и проведении.
export class Receipt {
  protected product: IProduct | null = null;
  protected reason: TReceiptReason | null = null;
  protected quantityRaw = '';

  constructor(protected events: IEvents) {}

  // Открыть документ на конкретный товар — сбросить поля под него.
  start(product: IProduct): void {
    this.product = product;
    this.reason = null;
    this.quantityRaw = '';
    this.events.emit('receipt:changed');
  }

  // Сеттеры полей черновика: каждое изменение объявляется событием.
  setReason(value: TReceiptReason): void {
    this.reason = value;
    this.events.emit('receipt:changed');
  }

  setQuantity(value: string): void {
    this.quantityRaw = value;
    this.events.emit('receipt:changed');
  }

  getState(): TReceiptState {
    return {
      product: this.product,
      reason: this.reason,
      quantityRaw: this.quantityRaw,
    };
  }

  getData(): TReceiptData {
    return {
      productId: this.product?.id ?? '',
      reason: this.reason,
      quantity: Number(this.quantityRaw),
    };
  }

  clear(): void {
    this.product = null;
    this.reason = null;
    this.quantityRaw = '';
    this.events.emit('receipt:changed');
  }

  // Бизнес-правила документа: причина выбрана; количество — целое > 0.
  // Ошибки не печатаем, а возвращаем: они нужны форме на экране.
  validate(): TReceiptErrors {
    const errors: TReceiptErrors = {};
    if (!this.reason) {
      errors.reason = 'Выберите причину поступления';
    }
    const quantity = Number(this.quantityRaw);
    if (!this.quantityRaw || Number.isNaN(quantity) || quantity <= 0) {
      errors.quantity = 'Укажите количество больше 0';
    } else if (!Number.isInteger(quantity)) {
      // Дробное, но в остальном корректное число — своя, точная ошибка.
      errors.quantity = 'Укажите целое число';
    } else if (quantity > 1000) {
      // Дробное, но в остальном корректное число — своя, точная ошибка.
      errors.quantity = 'Не больше 1000 за раз — сверьтесь с накладной';
    }
    return errors;
  }
}