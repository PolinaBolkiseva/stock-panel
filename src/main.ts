// src/main.ts
import { EventEmitter } from './components/base/Events';
import { Products } from './components/models/Products';
import type { IProduct } from './types';

// Тестовые данные (в проектной работе такие придут с сервера).
const testItems: IProduct[] = [
  { id: 'p1', name: 'Кофе в зёрнах «Утро»', price: 690, stock: 12 },
  { id: 'p2', name: 'Чай зелёный «Сенча»', price: 320, stock: 4 },
  { id: 'p3', name: 'Печенье овсяное', price: 150, stock: 0 },
];

// Один брокер на всё приложение; модель получает его через конструктор.
const events = new EventEmitter();
const products = new Products(events);

// Тест-подписчик: услышал событие — забрал у модели свежее состояние геттером.
events.on('catalog:changed', () => {
  console.log(
    'Событие catalog:changed! Остатки:',
    products.getItems().map((item) => `${item.name}: ${item.stock}`)
  );
});

let changesCount = 0;
events.on('catalog:changed', () => {
  changesCount++;
  console.log(
    'Изменений каталога: N:', `${changesCount }`
  );
});

// 1. Загрузка каталога — модель должна объявить об изменении.
products.setItems(testItems);

// 2. Валидное поступление — ещё одно объявление, остаток «Сенчи» вырастет до 9.
products.receive('p2', 5);

// 3. Нарушение правила — данные не изменились, события быть не должно.
products.receive('p1', -3);

products.receive('p3', 99);