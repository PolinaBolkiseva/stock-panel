// src/main.ts — точка входа. Здесь собирается всё приложение.
// ПРЕЗЕНТЕР пока живёт прямо в этом файле (упрощение) —
// в большом проекте это был бы отдельный класс.
import './styles.css';

import { EventEmitter } from './components/base/Events';
import { Products } from './components/models/Products';
import { Catalog } from './components/views/Catalog';
import { ProductCard } from './components/views/ProductCard';
import type { IProduct, TReceiptReason } from './types';
import { cloneTemplate, ensureElement } from './utils/utils';
//import { Receipt } from './components/models/Receipt'; 
//import { Modal } from './components/views/Modal';
//import { ReceiptForm } from './components/views/ReceiptForm';

// Тестовые данные (в проектной работе такие придут с сервера).
const testItems: IProduct[] = [
  { id: 'p1', name: 'Кофе в зёрнах «Утро»', price: 690, stock: 12 },
  { id: 'p2', name: 'Чай зелёный «Сенча»', price: 320, stock: 4 },
  { id: 'p3', name: 'Печенье овсяное', price: 150, stock: 0 },
];

// --- Участники ---

// Единственный брокер на всё приложение.
const events = new EventEmitter();

// --- Отладка ---
events.onAll(({ eventName }) => console.log('Событие:', eventName));

// Модель получает брокер, чтобы объявлять об изменениях.
const products = new Products(events);

// Каталог живёт в статичной разметке страницы.
const catalog = new Catalog(ensureElement<HTMLElement>('.catalog__list'));

// --- Презентер ---

// Каталог изменился → забрать товары у модели и перерисовать карточки.
events.on('catalog:changed', () => {
  const cards = products.getItems().map((item) =>
    new ProductCard(cloneTemplate<HTMLElement>('#product-card')).render({
      title: item.name, // у модели поле name, у карточки — title
      price: item.price,
      stock: item.stock,
    })
  );

  catalog.render({ items: cards });
});

// --- Запуск ---

// Загружаем каталог. Модель объявит 'catalog:changed' — и презентер отрисует его.
products.setItems(testItems);

// Временная демонстрация: через три секунды на склад «привозят» 5 упаковок чая.
//setTimeout(() => products.receive('p2', 5), 3000);
//setTimeout(() => products.receive('p2', -3), 3000);
/*
// =============================================================
// Временный тест: модалка и форма (удалим в конце урока).
// Готовый код выше не трогаем — новые детали проверяем рядом.
// =============================================================

// Свой брокер: новые детали проверяем в изоляции от приложения.
const testEvents = new EventEmitter();

// Модалка живёт в статичной разметке страницы.
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'));

// Форму создаём один раз из шаблона — статичный компонент.
const receiptForm = new ReceiptForm(testEvents, cloneTemplate<HTMLFormElement>('#receipt'));

// Слушаем всю «переписку» формы — приём из урока о событиях.
testEvents.onAll(({ eventName, data }) => console.log('Событие формы:', eventName, data));

// Открываем модалку с формой, отрисованной из фейковых данных.
modal.render({
  content: receiptForm.render({
    title: 'Поступление: Тестовый товар',
    stock: 'Текущий остаток: 4 шт',
    reason: null,
    quantity: '',
    valid: true, // включим кнопку, чтобы проверить и submit
    errors: '',
  }),
});

// Мини-презентер для теста: вернуть выбор причины обратно в форму.
testEvents.on<{ field: string; value: TReceiptReason }>('form:changed', (data) => {
  if (data.field === 'reason') {
    receiptForm.render({ reason: data.value });
  }
});

*/
/*
// =============================================================
// Временный тест: модель Receipt (удалим в конце урока).
// Готовый код выше не трогаем — новую деталь проверяем рядом.
// =============================================================

// Свой брокер: документ проверяем в полной изоляции —
// даже от брокера работающего приложения.
const testEvents = new EventEmitter();
const receipt = new Receipt(testEvents);

// Тест-подписчик: документ изменился — печатаем его состояние.
testEvents.on('receipt:changed', () => {
  console.log('Документ изменился:', receipt.getState());
});

// 1. Открываем документ на товар — модель должна объявить об изменении.
receipt.start({ id: 'p2', name: 'Чай зелёный «Сенча»', price: 320, stock: 4 });
console.log('Ошибки пустого документа:', receipt.validate());

// 2. Заполняем поля — каждое изменение объявляется событием.
receipt.setReason('supplier');
receipt.setQuantity('5');
console.log('Ошибки заполненного документа:', receipt.validate());
console.log('Данные для проведения:', receipt.getData());


// 2. Заполняем поля — каждое изменение объявляется событием.
receipt.setReason('supplier');
receipt.setQuantity('5000');
console.log('Ошибки заполненного документа:', receipt.validate());
console.log('Данные для проведения:', receipt.getData());
// 3. Портим количество — валидация должна это поймать.
receipt.setQuantity('2.5');
console.log('Ошибки с дробным количеством:', receipt.validate()); 
*/
