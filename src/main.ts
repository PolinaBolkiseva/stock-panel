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
import { Receipt } from './components/models/Receipt';
import { Modal } from './components/views/Modal';
import { ReceiptForm } from './components/views/ReceiptForm';
import { ProductPreview } from './components/views/ProductPreview';

// Тестовые данные (в проектной работе такие придут с сервера).
const testItems: IProduct[] = [
  {
    id: 'p1',
    name: 'Кофе в зёрнах «Утро»',
    description: 'Плотная обжарка, ноты шоколада и карамели. Подходит для эспрессо и турки.',
    price: 690,
    stock: 12,
  },
  {
    id: 'p2',
    name: 'Чай зелёный «Сенча»',
    description: 'Классический японский зелёный чай: свежий, травянистый, с лёгкой сладостью.',
    price: 320,
    stock: 4,
  },
  {
    id: 'p3',
    name: 'Печенье овсяное',
    description: 'Овсяные хлопья, мёд и изюм. Печётся небольшими партиями каждую неделю.',
    price: 150,
    stock: 0,
  },
];

// --- Участники ---

// Единственный брокер на всё приложение.
const events = new EventEmitter();

// Модель документа поступления.
const receipt = new Receipt(events);

// Модалка живёт в статичной разметке страницы.
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'));

// Форму создаём один раз из шаблона — статичный компонент.
const receiptForm = new ReceiptForm(events, cloneTemplate<HTMLFormElement>('#receipt'));

// Подробную карточку тоже создаём один раз — статичный компонент.
const preview = new ProductPreview(cloneTemplate<HTMLElement>('#product-preview'));

// --- Отладка ---
// Для отладки — лог всей событийной «переписки» (приём из урока о сборке приложения).
events.onAll(({ eventName, data }) => console.log(eventName, data));

// Модель получает брокер, чтобы объявлять об изменениях.
const products = new Products(events);

// Каталог живёт в статичной разметке страницы.
const catalog = new Catalog(ensureElement<HTMLElement>('.catalog__list'));

// --- Презентер ---
// Сводка о проведении для консоли.
events.on('receipt:submitted', () => {
  const { productId, quantity, reason } = receipt.getData();
  const item = products.getItem(productId);
  console.log(`Проведено: ${item?.name}, +${quantity} шт, причина: ${reason}`);
});

// Каталог изменился → забрать товары у модели и перерисовать карточки.
events.on('catalog:changed', () => {
  const cards = products.getItems().map((item) =>
    new ProductCard(cloneTemplate<HTMLElement>('#product-card'), {
      // Клик по телу карточки: сообщаем факт — какой товар выбрали.
      onClick: () => events.emit('card:selected', item),
      // Кнопка «Поступление товара»: сообщаем факт — для какого товара его запросили.
      onReceipt: () => events.emit('receipt:requested', item),
    }).render({
      title: item.name, // у модели поле name, у карточки — title
      price: item.price,
      stock: item.stock,
    })
  );

  catalog.render({ items: cards });
});

// Запросили поступление → открыть документ и показать форму в модалке.
events.on('receipt:requested', (item: IProduct) => {
  receipt.start(item); // эмитит 'receipt:changed' → форма отрисуется в подписчике ниже
  modal.render({ content: receiptForm.render() });
});

// Ввод в форме → сохранить в документ. По имени поля презентер
// выбирает, какой сеттер модели вызвать.
events.on('form:changed', (data: { field: 'reason' | 'quantity'; value: string }) => {
  if (data.field === 'reason') {
    receipt.setReason(data.value as TReceiptReason);
  } else {
    receipt.setQuantity(data.value);
  }
});

// Документ изменился → перерисовать форму из актуальных данных модели.
events.on('receipt:changed', () => {
  const state = receipt.getState();
  const errors = receipt.validate();
  // Ошибки показываем, только когда пользователь начал заполнять документ.
  const touched = state.reason !== null || state.quantityRaw !== '';

  receiptForm.render({
    title: `Поступление: ${state.product?.name ?? ''}`,
    stock: `Текущий остаток: ${state.product?.stock ?? 0} шт`,
    reason: state.reason,
    quantity: state.quantityRaw,
    valid: Object.keys(errors).length === 0,
    errors: touched ? Object.values(errors).join('; ') : '',
  });
  
});

// Проведение документа → выполнить операцию в модели товаров,
// выбросить черновик и закрыть модалку.
events.on('receipt:submitted', () => {
  const { productId, quantity } = receipt.getData();
  products.receive(productId, quantity); // эмитит 'catalog:changed' → каталог обновится
  receipt.clear();
  modal.close();
});

// Выбрали товар → показать подробную карточку в модалке.
events.on('card:selected', (item: IProduct) => {
  modal.render({
    content: preview.render({
      title: item.name,
      description: item.description,
      price: item.price,
      stock: item.stock,
    }),
  });
});
// --- Запуск ---

// Загружаем каталог. Модель объявит 'catalog:changed' — и презентер отрисует его.
products.setItems(testItems);
