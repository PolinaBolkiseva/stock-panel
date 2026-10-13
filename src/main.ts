// src/main.ts
import './styles.css';

import { Catalog } from './components/views/Catalog';
import { ProductCard } from './components/views/ProductCard';
import { cloneTemplate, ensureElement } from './utils/utils';

// Фейковые данные «для отображения». Заметьте: это НЕ товары из модели —
// просто объекты той формы, которую ждёт карточка.
const fakeCards = [
  { title: 'Кофе в зёрнах «Утро»', price: 690, stock: 12 },
  { title: 'Чай зелёный «Сенча»', price: 320, stock: 4 },
  { title: 'Печенье овсяное', price: 150, stock: 0 },
];

// Каталог живёт в статичной разметке страницы.
const catalog = new Catalog(ensureElement<HTMLElement>('.catalog__list'));

// На каждый набор данных: клон шаблона → компонент → рендер.
const cards = fakeCards.map((data) =>
  new ProductCard(cloneTemplate<HTMLElement>('#product-card')).render(data)
);

// Отдаём готовые элементы каталогу.
catalog.render({ items: cards });