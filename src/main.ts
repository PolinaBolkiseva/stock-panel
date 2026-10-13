// src/main.ts — точка входа. Здесь собирается всё приложение.
// ПРЕЗЕНТЕР пока живёт прямо в этом файле (упрощение) —
// в большом проекте это был бы отдельный класс.
import './styles.css';

import { EventEmitter } from './components/base/Events';
import { Products } from './components/models/Products';
import { Catalog } from './components/views/Catalog';
import { ProductCard } from './components/views/ProductCard';
import type { IProduct } from './types';
import { cloneTemplate, ensureElement } from './utils/utils';

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
