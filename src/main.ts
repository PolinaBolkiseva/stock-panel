
import { Products } from './components/models/Products';
import type { IProduct } from './types';

// Тестовые данные (в проектной работе такие придут с сервера).
const testItems: IProduct[] = [
  { id: 'p1', name: 'Кофе в зёрнах «Утро»', price: 690, stock: 12 },
  { id: 'p2', name: 'Чай зелёный «Сенча»', price: 320, stock: 4 },
  { id: 'p3', name: 'Печенье овсяное', price: 150, stock: 0 },
];

const products = new Products();

// 1. Загрузка и чтение.
products.setItems(testItems);
console.log('Все товары:', products.getItems());
console.log('Один товар по id:', products.getItem('p2'));
console.log('Несуществующий id:', products.getItem('p99'));

// 2. Валидное поступление: остаток «Сенчи» должен вырасти с 4 до 9.
products.receive('p2', 5);
console.log('Остаток «Сенчи» после поступления 5 шт:', products.getItem('p2')?.stock);

// 3. Нарушения правил: модель должна отклонить некорректные вызовы.
products.receive('p99', 5); // несуществующий товар
products.receive('p1', -3); // отрицательное количество
products.receive('p1', 2.5); // дробное количество
console.log('Остаток кофе не изменился:', products.getItem('p1')?.stock);