import type { IProduct } from '../../types';
import type { IEvents } from '../base/Events';

// МОДЕЛЬ — слой данных. Хранит товары и бизнес-правила.
// Ничего не знает про DOM и внешний вид приложения.
export class Products {
  // Данные закрыты: снаружи их можно менять только через методы модели.
  protected items: IProduct[] = [];
  /*
  Модификатор protected у параметра конструктора — знакомый вам уже приём: 
  параметр сразу становится полем класса, 
  и брокер доступен в методах как this.events. 
  Заметьте тип поля: IEvents, интерфейс, а не класс EventEmitter. 
  Модели неважно, как брокер устроен внутри, — важно лишь, 
  что он умеет on и emit. 
  */
  constructor(protected events: IEvents) {} 
  // Загрузить каталог целиком (в проектной работе сюда придут данные с сервера).
  setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit('catalog:changed');
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItem(id: string): IProduct | undefined {
    return this.items.find((item) => item.id === id);
  }

// Бизнес-операция: провести поступление товара (пополнить остаток).
  receive(id: string, amount: number): void {
    const item = this.getItem(id);
    if (!item) {
      console.log(`Товар с id "${id}" не найден`);
      return;
    }
    if (!Number.isInteger(amount) || amount <= 0) {
      console.log('Количество должно быть положительным целым числом');
      return;
    }
    item.stock += amount;
    this.events.emit('catalog:changed');
  }   

  getOutOfStock(): IProduct[] {
    const productIsOutList: IProduct[] = this.items.filter(el=>el.stock===0);
    return productIsOutList;
  }
} 